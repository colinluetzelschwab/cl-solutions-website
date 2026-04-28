/**
 * AGENTS surface — multi-step AI workflow definitions + run history.
 * Distinct from ⌘K commands (single actions). An agent run produces N
 * outputs (Deals, drafts, scans) over multiple sub-steps.
 */

export type AgentId =
  | "lead-scrape"
  | "batch-outreach"
  | "mockup-blast"
  | "weekly-snapshot"
  | "stale-reaper"
  | "invoice-chase"
  | "retainer-pitch"
  | "repo-cleanup";

export interface AgentDef {
  id: AgentId;
  label: string;
  description: string;
  /** What the agent produces (used for empty-state UI). */
  outputLabel: string;
  /** Estimated duration in seconds (rough; for progress UI). */
  estimatedDuration: number;
  /** Configurable input fields. */
  fields?: Array<{
    key: string;
    label: string;
    kind: "text" | "number" | "select";
    placeholder?: string;
    options?: string[];
    default?: string | number;
  }>;
}

export type AgentRunStatus = "queued" | "running" | "complete" | "failed" | "aborted";

export interface AgentRun {
  id: string;                     // "run_<nanoid>"
  agentId: AgentId;
  status: AgentRunStatus;
  startedAt: string;
  finishedAt?: string;
  /** Caller-supplied input config. */
  input: Record<string, string | number>;
  /** Number of meaningful outputs produced (drafts, deals, scans). */
  outputCount: number;
  /** Brief result summary (1-line). */
  resultSummary?: string;
  errorMessage?: string;
}

export const AGENTS: AgentDef[] = [
  {
    id: "lead-scrape",
    label: "Lead-scrape Zürich",
    description: "Crawl branchenbuch + google.ch for new SMB prospects with weak websites",
    outputLabel: "leads added",
    estimatedDuration: 90,
    fields: [
      { key: "city",     label: "City",     kind: "text", default: "Zürich", placeholder: "Zürich" },
      { key: "industry", label: "Industry", kind: "text", placeholder: "physiotherapy / restaurant / dentist" },
      { key: "target",   label: "Target count", kind: "number", default: 15 },
    ],
  },
  {
    id: "batch-outreach",
    label: "Batch outreach drafts",
    description: "For every Deal in `qualified` with no outreach yet — generate personalised draft (review queue, no auto-send)",
    outputLabel: "drafts generated",
    estimatedDuration: 60,
    fields: [
      { key: "tone", label: "Tone", kind: "select", options: ["formal-de", "informal-de", "english"], default: "formal-de" },
    ],
  },
  {
    id: "mockup-blast",
    label: "Mockup blast (hot leads)",
    description: "For each lead with priority=hot — generate Higgsfield hero + bare Next.js mockup, deploy to temp Vercel project",
    outputLabel: "mockups deployed",
    estimatedDuration: 240,
  },
  {
    id: "weekly-snapshot",
    label: "Weekly competitive snapshot",
    description: "For each `live` Deal — Lighthouse + CheckVibe + competitor comparison, generates 1-page report",
    outputLabel: "snapshots created",
    estimatedDuration: 180,
  },
  {
    id: "stale-reaper",
    label: "Stale-lead reaper",
    description: "Find Deals with no activity > 90d, no replies, stage ≤ outreach → mark dormant + send final email",
    outputLabel: "leads reaped",
    estimatedDuration: 30,
    fields: [
      { key: "ageDays", label: "Age threshold (days)", kind: "number", default: 90 },
    ],
  },
  {
    id: "invoice-chase",
    label: "Invoice chase",
    description: "Send Resend reminder for unpaid invoices past validUntil, with Stripe payment link",
    outputLabel: "reminders sent",
    estimatedDuration: 30,
  },
  {
    id: "retainer-pitch",
    label: "Maintenance retainer pitch",
    description: "For each Deal at `live` > 30d with no maintenance offer — generate + send retainer pitch (CHF 149/mo)",
    outputLabel: "retainer offers sent",
    estimatedDuration: 60,
  },
  {
    id: "repo-cleanup",
    label: "Cleanup test repos",
    description: "Find GitHub repos with `test-` prefix or untouched > 14d → delete with confirm",
    outputLabel: "repos deleted",
    estimatedDuration: 30,
    fields: [
      { key: "ageDays", label: "Age threshold (days)", kind: "number", default: 14 },
    ],
  },
];
