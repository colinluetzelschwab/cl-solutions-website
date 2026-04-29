/**
 * CRM data model — Vercel Blob–backed, single-user.
 * FK convention: prefixed string IDs (lead_, out_, mock_, off_, proj_, cost_).
 */

export interface AuditFields {
  createdAt: string;             // ISO timestamp
  updatedAt: string;
  createdBy: "colin" | "system"; // "system" = auto-derived (briefs/build pipeline)
}

/* ── Leads ───────────────────────────────────────────────── */

export type LeadStatus =
  | "found"
  | "qualified"
  | "mockup_built"
  | "contacted"
  | "replied"
  | "offer_sent"
  | "won"
  | "lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "found", "qualified", "mockup_built", "contacted",
  "replied", "offer_sent", "won", "lost",
];

export type LeadSource = "manual" | "brief" | "scraper" | "referral";

export interface Lead extends AuditFields {
  id: string;                    // "lead_<nanoid>"
  businessName: string;
  websiteUrl?: string;
  industry?: string;
  location?: string;             // "Zurich, CH"
  email?: string;
  phone?: string;
  googleRating?: number;         // 0..5
  websiteQualityScore?: number;  // 0..10
  priority: 1 | 2 | 3;           // 1 = hot
  status: LeadStatus;
  notes?: string;
  source: LeadSource;
  briefId?: string;              // FK when source === "brief"
}

/* ── Outreach ────────────────────────────────────────────── */

export type ReplyStatus = "none" | "positive" | "negative" | "auto_reply";

export interface Outreach extends AuditFields {
  id: string;                    // "out_<nanoid>"
  leadId: string;
  subject: string;
  bodyDraft: string;             // never auto-sent in MVP
  sentAt?: string;
  followUpAt?: string;
  replyStatus: ReplyStatus;
  mockupUrl?: string;
  notes?: string;
  /** Number of touches sent: 1 = initial, 2 = bump, 3 = close-out. Undefined when sentAt is also undefined. */
  touchCount?: 1 | 2 | 3;
  /** Last touch send timestamp (ISO). Used by Sequence Runner to enforce cadence. */
  lastTouchAt?: string;
  /** When the sequence was closed out (touch 3 sent OR positive/negative reply received). */
  sequenceClosedAt?: string;
}

/* ── Mockups ─────────────────────────────────────────────── */

export type MockupStatus = "queued" | "building" | "ready" | "failed";

export interface Mockup extends AuditFields {
  id: string;                    // "mock_<nanoid>"
  leadId: string;
  url: string;
  repo?: string;
  status: MockupStatus;
  qualityRating?: 1 | 2 | 3 | 4 | 5;
  sent: boolean;
  buildSlug?: string;            // FK → BuildHistoryEntry.slug
}

/* ── Offers ──────────────────────────────────────────────── */

export type PackageId = "starter" | "business" | "pro" | "custom";

export interface Offer extends AuditFields {
  id: string;                    // "off_<nanoid>"
  offerNumber: string;           // "OF-2026-001" (global counter in crm/_meta.json)
  leadId?: string;
  projectId?: string;
  client: string;                // denormalized businessName
  packageId: PackageId;
  amount: number;                // CHF
  validUntil: string;            // ISO date
  contractSigned: boolean;
  invoiceSent: boolean;
  invoiceSentAt?: string;
  paid: boolean;
  paidAt?: string;
  outstanding: number;           // amount - paid portion (manual)
}

/* ── Projects (CRM, NOT Vercel deploys) ──────────────────── */

export type ProjectStatus =
  | "briefing"
  | "waiting_content"
  | "in_build"
  | "in_review"
  | "revision"
  | "ready_to_go_live"
  | "live"
  | "maintenance";

export const PROJECT_STATUSES: ProjectStatus[] = [
  "briefing", "waiting_content", "in_build", "in_review",
  "revision", "ready_to_go_live", "live", "maintenance",
];

export interface CrmProjectTask {
  id: string;
  text: string;
  done: boolean;
}

export interface CrmProject extends AuditFields {
  id: string;                    // "proj_<nanoid>"
  client: string;
  leadId?: string;
  briefId?: string;
  offerId?: string;
  packageId: string;
  startDate: string;
  deliveryDate?: string;
  status: ProjectStatus;
  domain?: string;
  repo?: string;
  vercelUrl?: string;
  hostingPlan?: string;
  openTasks: CrmProjectTask[];
}

/* ── Costs ───────────────────────────────────────────────── */

export type CostCategory =
  | "vercel"
  | "claude_openai"
  | "sanity"
  | "resend"
  | "domains"
  | "hetzner"
  | "tools"
  | "other";

export interface CostEntry extends AuditFields {
  id: string;                    // "cost_<nanoid>"
  category: CostCategory;
  amount: number;                // CHF
  month: string;                 // "2026-04"
  note?: string;
}

/* ── Finance summary (derived) ───────────────────────────── */

export interface FinanceSummary {
  revenueMonth: number;
  revenueYtd: number;
  outstanding: number;
  mrr: number;
  costsMonth: number;
  profitEstimate: number;
  month: string;                 // "2026-04"
}

/* ── Next Actions (derived per-request) ──────────────────── */

export type NextActionKind =
  | "follow_up"
  | "mockup_needed"
  | "offer_waiting"
  | "invoice_unpaid"
  | "project_blocked";

export type NextActionRefKind =
  | "lead"
  | "outreach"
  | "mockup"
  | "offer"
  | "project";

export interface NextAction {
  id: string;                    // synthetic, derived per-request
  kind: NextActionKind;
  refId: string;
  refKind: NextActionRefKind;
  title: string;
  subtitle?: string;
  dueAt?: string;
  priority: number;              // higher = more urgent
}

/* ── Index entries (for _index.json files) ───────────────── */

export interface LeadIndexEntry {
  id: string;
  name: string;
  status: LeadStatus;
  priority: 1 | 2 | 3;
  updatedAt: string;
}

export interface OutreachIndexEntry {
  id: string;
  leadId: string;
  subject: string;
  sentAt?: string;
  followUpAt?: string;
  replyStatus: ReplyStatus;
  touchCount?: 1 | 2 | 3;
  sequenceClosedAt?: string;
  updatedAt: string;
}

export interface MockupIndexEntry {
  id: string;
  leadId: string;
  status: MockupStatus;
  sent: boolean;
  updatedAt: string;
}

export interface OfferIndexEntry {
  id: string;
  offerNumber: string;
  client: string;
  amount: number;
  contractSigned: boolean;
  invoiceSent: boolean;
  paid: boolean;
  validUntil: string;
  updatedAt: string;
}

export interface CrmProjectIndexEntry {
  id: string;
  client: string;
  status: ProjectStatus;
  updatedAt: string;
}

export interface CostIndexEntry {
  id: string;
  category: CostCategory;
  amount: number;
  month: string;
  updatedAt: string;
}

/* ── Global meta (crm/_meta.json) ────────────────────────── */

export interface CrmMeta {
  offerCounter: number;          // increments each new offer
  offerYear: number;             // resets counter when year changes
}
