/**
 * Inbox event log + activity log adapter.
 * Append-only arrays in Vercel Blob (capped at 500 / 1000 entries).
 *
 * Layout:
 *   crm/inbox/_log.json     → InboxEvent[]   (user-facing triage stream)
 *   crm/activity/_log.json  → ActivityItem[] (internal action audit)
 *   crm/agent-runs/_log.json → AgentRun[]    (agent invocation history)
 */

import { put, list as blobList } from "@vercel/blob";
import type { InboxEvent, InboxEventCreate, ActivityItem } from "./inbox-types";
import type { AgentRun } from "./agent-types";

export type { ActivityItem };

const INBOX_PATH = "crm/inbox/_log.json";
const ACTIVITY_PATH = "crm/activity/_log.json";
const AGENT_RUNS_PATH = "crm/agent-runs/_log.json";

const INBOX_CAP = 500;
const ACTIVITY_CAP = 1000;
const AGENT_RUNS_CAP = 200;

const ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function makeId(prefix: string): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return `${prefix}_${s}`;
}

async function readArray<T>(pathname: string): Promise<T[]> {
  try {
    const { blobs } = await blobList({ prefix: pathname, limit: 1 });
    const match = blobs.find(b => b.pathname === pathname);
    if (!match) return [];
    const res = await fetch(`${match.url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeArray(pathname: string, data: unknown[]): Promise<void> {
  await put(pathname, JSON.stringify(data), {
    access: "public",
    contentType: "application/json",
    allowOverwrite: true,
  });
}

/* ── Inbox events ────────────────────────────────────────── */

export async function inboxList(): Promise<InboxEvent[]> {
  return readArray<InboxEvent>(INBOX_PATH);
}

export async function inboxAppend(input: InboxEventCreate): Promise<InboxEvent> {
  const all = await inboxList();
  const event: InboxEvent = {
    id: makeId("evt"),
    severity: "info",
    ...input,
    createdAt: new Date().toISOString(),
  };
  const next = [event, ...all].slice(0, INBOX_CAP);
  await writeArray(INBOX_PATH, next);
  return event;
}

export async function inboxMarkRead(id: string, when?: string): Promise<boolean> {
  const all = await inboxList();
  const idx = all.findIndex(e => e.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], readAt: when ?? new Date().toISOString() };
  await writeArray(INBOX_PATH, all);
  return true;
}

export async function inboxMarkHandled(id: string): Promise<boolean> {
  const all = await inboxList();
  const idx = all.findIndex(e => e.id === id);
  if (idx === -1) return false;
  const now = new Date().toISOString();
  all[idx] = { ...all[idx], readAt: all[idx].readAt ?? now, handledAt: now };
  await writeArray(INBOX_PATH, all);
  return true;
}

export async function inboxMarkAllRead(): Promise<number> {
  const all = await inboxList();
  const now = new Date().toISOString();
  let count = 0;
  for (let i = 0; i < all.length; i++) {
    if (!all[i].readAt) { all[i] = { ...all[i], readAt: now }; count++; }
  }
  if (count > 0) await writeArray(INBOX_PATH, all);
  return count;
}

/* ── Activity log (internal audit) ───────────────────────── */

export async function activityList(limit = 100): Promise<ActivityItem[]> {
  const all = await readArray<ActivityItem>(ACTIVITY_PATH);
  return all.slice(0, limit);
}

export async function activityAppend(item: Omit<ActivityItem, "id" | "createdAt">): Promise<ActivityItem> {
  const all = await readArray<ActivityItem>(ACTIVITY_PATH);
  const entry: ActivityItem = {
    id: makeId("act"),
    ...item,
    createdAt: new Date().toISOString(),
  };
  const next = [entry, ...all].slice(0, ACTIVITY_CAP);
  await writeArray(ACTIVITY_PATH, next);
  return entry;
}

/* ── Agent runs ──────────────────────────────────────────── */

export async function agentRunsList(): Promise<AgentRun[]> {
  return readArray<AgentRun>(AGENT_RUNS_PATH);
}

export async function agentRunsAppend(run: AgentRun): Promise<void> {
  const all = await agentRunsList();
  const next = [run, ...all].slice(0, AGENT_RUNS_CAP);
  await writeArray(AGENT_RUNS_PATH, next);
}

export async function agentRunsUpdate(id: string, patch: Partial<AgentRun>): Promise<boolean> {
  const all = await agentRunsList();
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return false;
  all[idx] = { ...all[idx], ...patch };
  await writeArray(AGENT_RUNS_PATH, all);
  return true;
}
