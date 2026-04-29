/**
 * CRM storage adapter — Vercel Blob with per-collection index files.
 *
 * Layout:
 *   crm/{collection}/_index.json  → array of lightweight index entries
 *   crm/{collection}/{id}.json    → full record
 *
 * Listing reads only the index (one fetch). Opening reads one record.
 *
 * Single-user, single-writer assumption — no optimistic concurrency control.
 * Escape hatch for migration: this is the ONE file callers go through, swap
 * the body when moving to Supabase/Turso.
 */

import { put, list, del } from "@vercel/blob";
import type {
  Lead, LeadIndexEntry,
  Outreach, OutreachIndexEntry,
  Mockup, MockupIndexEntry,
  Offer, OfferIndexEntry,
  CrmProject, CrmProjectIndexEntry,
  CostEntry, CostIndexEntry,
  CrmMeta,
} from "./crm-types";

/* ── Collection registry ─────────────────────────────────── */

export type Collection = "leads" | "outreach" | "mockups" | "offers" | "crm-projects" | "costs";

type RecordOf<C extends Collection> =
  C extends "leads" ? Lead :
  C extends "outreach" ? Outreach :
  C extends "mockups" ? Mockup :
  C extends "offers" ? Offer :
  C extends "crm-projects" ? CrmProject :
  C extends "costs" ? CostEntry :
  never;

type IndexEntryOf<C extends Collection> =
  C extends "leads" ? LeadIndexEntry :
  C extends "outreach" ? OutreachIndexEntry :
  C extends "mockups" ? MockupIndexEntry :
  C extends "offers" ? OfferIndexEntry :
  C extends "crm-projects" ? CrmProjectIndexEntry :
  C extends "costs" ? CostIndexEntry :
  never;

/* ── Path helpers ────────────────────────────────────────── */

function recordPath(collection: Collection, id: string): string {
  return `crm/${collection}/${id}.json`;
}

function indexPath(collection: Collection): string {
  return `crm/${collection}/_index.json`;
}

const META_PATH = "crm/_meta.json";

/* ── Blob helpers ────────────────────────────────────────── */

async function readBlobJson<T>(pathname: string): Promise<T | null> {
  try {
    const { blobs } = await list({ prefix: pathname, limit: 1 });
    const match = blobs.find(b => b.pathname === pathname);
    if (!match) return null;
    // Cache-bust to defeat Vercel Blob's CDN cache between writes & reads.
    const res = await fetch(`${match.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function writeBlobJson(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

/* ── ID generation (no nanoid dep — short URL-safe IDs) ──── */

const ID_PREFIX: Record<Collection, string> = {
  "leads": "lead",
  "outreach": "out",
  "mockups": "mock",
  "offers": "off",
  "crm-projects": "proj",
  "costs": "cost",
};

const ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function makeId(collection: Collection): string {
  let s = "";
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < bytes.length; i++) {
    s += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  }
  return `${ID_PREFIX[collection]}_${s}`;
}

/* ── Index projection ────────────────────────────────────── */

function toIndexEntry<C extends Collection>(collection: C, record: RecordOf<C>): IndexEntryOf<C> {
  switch (collection) {
    case "leads": {
      const r = record as Lead;
      return { id: r.id, name: r.businessName, status: r.status, priority: r.priority, updatedAt: r.updatedAt } as IndexEntryOf<C>;
    }
    case "outreach": {
      const r = record as Outreach;
      return { id: r.id, leadId: r.leadId, subject: r.subject, sentAt: r.sentAt, followUpAt: r.followUpAt, replyStatus: r.replyStatus, touchCount: r.touchCount, sequenceClosedAt: r.sequenceClosedAt, updatedAt: r.updatedAt } as IndexEntryOf<C>;
    }
    case "mockups": {
      const r = record as Mockup;
      return { id: r.id, leadId: r.leadId, status: r.status, sent: r.sent, updatedAt: r.updatedAt } as IndexEntryOf<C>;
    }
    case "offers": {
      const r = record as Offer;
      return { id: r.id, offerNumber: r.offerNumber, client: r.client, amount: r.amount, contractSigned: r.contractSigned, invoiceSent: r.invoiceSent, paid: r.paid, validUntil: r.validUntil, updatedAt: r.updatedAt } as IndexEntryOf<C>;
    }
    case "crm-projects": {
      const r = record as CrmProject;
      return { id: r.id, client: r.client, status: r.status, updatedAt: r.updatedAt } as IndexEntryOf<C>;
    }
    case "costs": {
      const r = record as CostEntry;
      return { id: r.id, category: r.category, amount: r.amount, month: r.month, updatedAt: r.updatedAt } as IndexEntryOf<C>;
    }
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
}

/* ── CRUD ────────────────────────────────────────────────── */

export async function crmList<C extends Collection>(collection: C): Promise<IndexEntryOf<C>[]> {
  const idx = await readBlobJson<IndexEntryOf<C>[]>(indexPath(collection));
  return idx ?? [];
}

export async function crmGet<C extends Collection>(collection: C, id: string): Promise<RecordOf<C> | null> {
  return readBlobJson<RecordOf<C>>(recordPath(collection, id));
}

/**
 * Create-or-update. Caller is responsible for setting `id`, `createdAt`, `updatedAt`, `createdBy`.
 * Use `crmCreate` / `crmUpdate` for the typical flow.
 */
export async function crmPut<C extends Collection>(collection: C, record: RecordOf<C>): Promise<RecordOf<C>> {
  await writeBlobJson(recordPath(collection, record.id), record);

  // Update index in place
  const idx = await crmList(collection);
  const entry = toIndexEntry(collection, record);
  const existingIdx = idx.findIndex(e => e.id === record.id);
  if (existingIdx >= 0) {
    idx[existingIdx] = entry;
  } else {
    idx.unshift(entry);
  }
  await writeBlobJson(indexPath(collection), idx);

  return record;
}

export async function crmDelete<C extends Collection>(collection: C, id: string): Promise<boolean> {
  // Remove from index first (the source of truth for listings)
  const idx = await crmList(collection);
  const next = idx.filter(e => e.id !== id);
  if (next.length === idx.length) return false;
  await writeBlobJson(indexPath(collection), next);

  // Then delete the record blob (best-effort — index removal is what matters)
  try {
    const path = recordPath(collection, id);
    const { blobs } = await list({ prefix: path, limit: 1 });
    const match = blobs.find(b => b.pathname === path);
    if (match) await del(match.url);
  } catch { /* swallow */ }

  return true;
}

/**
 * Convenience: assigns id, audit timestamps, defaults `createdBy: "colin"`.
 */
export async function crmCreate<C extends Collection>(
  collection: C,
  partial: Omit<RecordOf<C>, "id" | "createdAt" | "updatedAt" | "createdBy"> & { createdBy?: "colin" | "system" },
): Promise<RecordOf<C>> {
  const now = new Date().toISOString();
  const record = {
    ...partial,
    id: makeId(collection),
    createdAt: now,
    updatedAt: now,
    createdBy: partial.createdBy ?? "colin",
  } as RecordOf<C>;
  return crmPut(collection, record);
}

export async function crmUpdate<C extends Collection>(
  collection: C,
  id: string,
  patch: Partial<Omit<RecordOf<C>, "id" | "createdAt" | "createdBy">>,
): Promise<RecordOf<C> | null> {
  const existing = await crmGet(collection, id);
  if (!existing) return null;
  const merged = {
    ...existing,
    ...patch,
    id: existing.id,
    createdAt: existing.createdAt,
    createdBy: existing.createdBy,
    updatedAt: new Date().toISOString(),
  } as RecordOf<C>;
  return crmPut(collection, merged);
}

/* ── Meta (offer counter) ────────────────────────────────── */

export async function crmReadMeta(): Promise<CrmMeta> {
  const meta = await readBlobJson<CrmMeta>(META_PATH);
  return meta ?? { offerCounter: 0, offerYear: new Date().getUTCFullYear() };
}

export async function crmWriteMeta(meta: CrmMeta): Promise<void> {
  await writeBlobJson(META_PATH, meta);
}

export async function nextOfferNumber(): Promise<string> {
  const meta = await crmReadMeta();
  const year = new Date().getUTCFullYear();
  const next: CrmMeta = year === meta.offerYear
    ? { offerYear: meta.offerYear, offerCounter: meta.offerCounter + 1 }
    : { offerYear: year, offerCounter: 1 };
  await crmWriteMeta(next);
  return `OF-${next.offerYear}-${String(next.offerCounter).padStart(3, "0")}`;
}
