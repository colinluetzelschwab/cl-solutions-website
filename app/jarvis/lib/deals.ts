/**
 * Deal projection — read-only view that merges Lead + Brief + Offer +
 * CrmProject records into a single business-object stream.
 *
 * v1 strategy (per masterplan): pure projection. NO writes to a `deals/`
 * collection. The 4 source collections remain authoritative. Reversible.
 *
 * Stage funnel (canonical 8 + 2 side branches):
 *   prospect → qualified → mockup → outreach → negotiating
 *           → signed → building → live → maintenance
 *           ⇣ side branches: lost · dormant
 */

import type {
  Lead, LeadIndexEntry, LeadStatus,
  OfferIndexEntry,
  CrmProjectIndexEntry, ProjectStatus,
} from "./crm-types";
import type { BriefSummary } from "./types";

export type DealStage =
  | "prospect"
  | "qualified"
  | "mockup"
  | "outreach"
  | "negotiating"
  | "signed"
  | "building"
  | "live"
  | "maintenance"
  | "lost"
  | "dormant";

export const DEAL_STAGES: DealStage[] = [
  "prospect", "qualified", "mockup", "outreach", "negotiating",
  "signed", "building", "live", "maintenance",
];

export const DEAL_SIDE_STAGES: DealStage[] = ["lost", "dormant"];

export const DEAL_STAGE_LABELS: Record<DealStage, string> = {
  prospect: "Prospect",
  qualified: "Qualified",
  mockup: "Mockup",
  outreach: "Outreach",
  negotiating: "Negotiating",
  signed: "Signed",
  building: "Building",
  live: "Live",
  maintenance: "Maintenance",
  lost: "Lost",
  dormant: "Dormant",
};

/* ── Stage derivation ─────────────────────────────────────── */

/** Map a Lead.status into a Deal stage (lead-only path). */
export function leadStatusToStage(s: LeadStatus): DealStage {
  switch (s) {
    case "found":         return "prospect";
    case "qualified":     return "qualified";
    case "mockup_built":  return "mockup";
    case "contacted":     return "outreach";
    case "replied":       return "negotiating";
    case "offer_sent":    return "negotiating";
    case "won":           return "signed";
    case "lost":          return "lost";
  }
}

/** Map a CrmProject.status into a Deal stage (project-bound path). */
export function projectStatusToStage(s: ProjectStatus): DealStage {
  switch (s) {
    case "briefing":          return "signed";
    case "waiting_content":   return "signed";
    case "in_build":          return "building";
    case "in_review":         return "building";
    case "revision":          return "building";
    case "ready_to_go_live":  return "building";
    case "live":              return "live";
    case "maintenance":       return "maintenance";
  }
}

/* ── Deal projection types ────────────────────────────────── */

export interface DealRow {
  /** Stable ID. Format depends on origin: lead_xxx | brief_xxx | proj_xxx. */
  id: string;
  /** Origin collection that produced this row (for action routing). */
  origin: "lead" | "brief" | "project";
  /** Display name (denormalized). */
  client: string;
  stage: DealStage;
  /** Optional priority (1=hot..3=cold). Lead origin only. */
  priority?: 1 | 2 | 3;
  /** Latest activity timestamp from any underlying record. */
  updatedAt: string;
  /** Aggregate amount in CHF (sum of related Offer amounts). */
  amount?: number;
  /** Outstanding amount in CHF (sum of unpaid offers). */
  outstanding?: number;
  /** Domain (when known — project bound). */
  domain?: string;
  /** Linked source records (for follow-up reads). */
  links: {
    leadId?: string;
    briefId?: string;
    offerIds: string[];
    projectId?: string;
  };
}

export interface DealList {
  rows: DealRow[];
  byStage: Record<DealStage, DealRow[]>;
  totals: {
    count: number;
    pipeline: number;     // amount sum (excluding lost/dormant)
    outstanding: number;
  };
}

/* ── Projection logic ─────────────────────────────────────── */

export interface DealProjectionInput {
  leads: LeadIndexEntry[];
  briefs: BriefSummary[];
  offers: OfferIndexEntry[];
  projects: CrmProjectIndexEntry[];
  /** For amount/outstanding rollup and brief→lead linkage. */
  fullLeads?: Pick<Lead, "id" | "businessName" | "briefId">[];
  /** For project→lead linkage. */
  projectsLinks?: Array<{ id: string; leadId?: string; briefId?: string; offerId?: string }>;
}

/**
 * Build a Deal list by joining the 4 source collections.
 *
 * Precedence rule: project > lead > brief.
 * If a CrmProject exists for a lead, the deal row comes from the project
 * (carries domain, vercelUrl, more advanced stage). Otherwise lead-only.
 * Briefs without a corresponding lead become standalone "prospect" rows.
 */
export function projectDeals(input: DealProjectionInput): DealList {
  const { leads, briefs, offers, projects, fullLeads, projectsLinks } = input;

  // Build lookups.
  const leadById = new Map(leads.map(l => [l.id, l]));
  const projectByLeadId = new Map<string, CrmProjectIndexEntry>();
  const projectByBriefId = new Map<string, CrmProjectIndexEntry>();
  const briefIdByLeadId = new Map<string, string>();

  if (projectsLinks) {
    for (const p of projectsLinks) {
      if (p.leadId) projectByLeadId.set(p.leadId, projects.find(x => x.id === p.id) || projects[0]);
      if (p.briefId) projectByBriefId.set(p.briefId, projects.find(x => x.id === p.id) || projects[0]);
    }
  }
  if (fullLeads) {
    for (const l of fullLeads) if (l.briefId) briefIdByLeadId.set(l.id, l.briefId);
  }

  // Group offers by leadId / projectId for amount rollup.
  const offersByLead = new Map<string, OfferIndexEntry[]>();
  const offersByProject = new Map<string, OfferIndexEntry[]>();
  for (const o of offers) {
    // Index entries don't carry leadId/projectId in current schema; in v1 we
    // can't resolve per-deal amounts without a full Offer fetch. For now,
    // fall back to global totals only (amount/outstanding are best-effort).
    void offersByLead; void offersByProject;
  }

  const rows: DealRow[] = [];

  // 1. Project-bound deals (highest precedence).
  for (const p of projects) {
    rows.push({
      id: p.id,
      origin: "project",
      client: p.client,
      stage: projectStatusToStage(p.status),
      updatedAt: p.updatedAt,
      links: { projectId: p.id, offerIds: [] },
    });
  }

  // 2. Lead-only deals (skip leads already represented by a project).
  const leadIdsWithProject = new Set(
    (projectsLinks ?? []).filter(p => p.leadId).map(p => p.leadId as string),
  );
  for (const l of leads) {
    if (leadIdsWithProject.has(l.id)) continue;
    rows.push({
      id: l.id,
      origin: "lead",
      client: l.name,
      stage: leadStatusToStage(l.status),
      priority: l.priority,
      updatedAt: l.updatedAt,
      links: { leadId: l.id, briefId: briefIdByLeadId.get(l.id), offerIds: [] },
    });
  }

  // 3. Briefs without a corresponding lead.
  const briefIdsLinked = new Set(
    Array.from(briefIdByLeadId.values()).concat(
      (projectsLinks ?? []).filter(p => p.briefId).map(p => p.briefId as string),
    ),
  );
  for (const b of briefs) {
    if (briefIdsLinked.has(b.id)) continue;
    rows.push({
      id: b.id,
      origin: "brief",
      client: b.clientName,
      stage: b.status === "built" ? "signed" : b.status === "building" ? "building" : "prospect",
      updatedAt: b.createdAt,
      amount: b.totalPrice,
      links: { briefId: b.id, offerIds: [] },
    });
  }

  // Sort: latest first.
  rows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  // Group by stage.
  const byStage = DEAL_STAGES.concat(DEAL_SIDE_STAGES).reduce((acc, s) => {
    acc[s] = rows.filter(r => r.stage === s);
    return acc;
  }, {} as Record<DealStage, DealRow[]>);

  // Totals.
  const pipelineRows = rows.filter(r => !["lost", "dormant"].includes(r.stage));
  const totals = {
    count: rows.length,
    pipeline: pipelineRows.reduce((s, r) => s + (r.amount ?? 0), 0),
    outstanding: rows.reduce((s, r) => s + (r.outstanding ?? 0), 0),
  };

  return { rows, byStage, totals };
}
