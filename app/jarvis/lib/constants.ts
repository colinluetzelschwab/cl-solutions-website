import type { Surface, Tab } from "./types";

export const C = {
  primary: "#00E5FF",
  success: "#00FF7F",
  warning: "#FFAA00",
  error: "#FF4466",
  violet: "#7C3AED",
  bg: "#050508",
  surface: "rgba(255,255,255,0.03)",
  surfaceHover: "rgba(255,255,255,0.06)",
  border: "rgba(255,255,255,0.08)",
  dim: "rgba(255,255,255,0.06)",
} as const;

export const PHASES = [
  { id: "init", label: "SYSTEM INIT", short: "INIT" },
  { id: "research", label: "BRANCH RECON", short: "RECON" },
  { id: "generate", label: "SCAFFOLD", short: "SCFLD" },
  { id: "content", label: "CONTENT BUILD", short: "CNTNT" },
  { id: "images", label: "ASSET FETCH", short: "ASSET" },
  { id: "build", label: "COMPILE + QA", short: "BUILD" },
  { id: "deploy", label: "DEPLOY", short: "DPLOY" },
] as const;

export const PACKAGE_COLORS: Record<string, string> = {
  starter: C.violet,
  business: C.primary,
  pro: C.warning,
};

export const PACKAGE_LABELS: Record<string, string> = {
  starter: "STARTER",
  business: "BUSINESS",
  pro: "PRO",
};

/* ── JARVIS 2.0: 7-surface IA ─────────────────────────────── */

export const SURFACES: { id: Surface; label: string; icon: string; sublabel?: string }[] = [
  { id: "today",  label: "Today",   icon: "◐", sublabel: "What needs me now" },
  { id: "deals",  label: "Deals",   icon: "▤", sublabel: "Lead → live → maintenance" },
  { id: "inbox",  label: "Inbox",   icon: "✉", sublabel: "Replies · payments · alerts" },
  { id: "agents", label: "Agents",  icon: "◇", sublabel: "Multi-step AI workflows" },
  { id: "ops",    label: "Ops",     icon: "◉", sublabel: "Builds + infra (live)" },
  { id: "money",  label: "Money",   icon: "₣", sublabel: "Revenue · costs · MRR" },
  { id: "config", label: "Config",  icon: "⚙", sublabel: "Connections + secrets" },
];

export const SURFACE_GROUPS: { label: string; surfaces: Surface[] }[] = [
  { label: "Work", surfaces: ["today", "deals", "inbox", "agents"] },
  { label: "Ops",  surfaces: ["ops", "money"] },
  { label: "",     surfaces: ["config"] },
];

/** Mobile bottom-bar shows top 5 surfaces; rest live in a "More" sheet. */
export const MOBILE_PRIMARY_SURFACES: Surface[] = ["today", "deals", "inbox", "money", "ops"];
export const MOBILE_OVERFLOW_SURFACES: Surface[] = ["agents", "config"];

/** Legacy: kept for any code path still importing this. Empty in 2.0. */
export const TABS: { id: Tab; label: string; icon: string }[] = [];
export const TAB_GROUPS: { label: string; tabs: Tab[] }[] = [];

export const LINKS = [
  { label: "Vercel", url: "https://vercel.com/colinluetzelschwabs-projects" },
  { label: "GitHub", url: "https://github.com/colinluetzelschwab" },
  { label: "Resend", url: "https://resend.com" },
  { label: "Hetzner", url: "https://console.hetzner.cloud" },
  { label: "CL Solutions", url: "https://clsolutions.dev" },
];

export function statusColor(s: string): string {
  switch (s.toUpperCase()) {
    case "READY": case "WON": case "LIVE": case "PAID": case "POSITIVE":
      return C.success;
    case "BUILDING": case "QUEUED": case "INITIALIZING":
    case "MOCKUP_BUILT": case "CONTACTED": case "REPLIED":
    case "OFFER_SENT": case "IN_BUILD": case "IN_REVIEW":
    case "REVISION": case "READY_TO_GO_LIVE":
      return C.warning;
    case "ERROR": case "CANCELED": case "LOST": case "FAILED": case "NEGATIVE":
      return C.error;
    case "FOUND": case "QUALIFIED": case "BRIEFING":
    case "WAITING_CONTENT": case "MAINTENANCE":
      return C.primary;
    default: return "rgba(255,255,255,0.2)";
  }
}

export function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function relTime(d: string): string {
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(ms / 3600000);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(ms / 86400000);
  return `${day}d`;
}

/* ── Integration registry (drives Connections panel) ──────── */

export type IntegrationId =
  | "vercel"
  | "github"
  | "stripe"
  | "resend"
  | "anthropic"
  | "higgsfield"
  | "checkvibe"
  | "vps";

export interface IntegrationDef {
  id: IntegrationId;
  label: string;
  description: string;
  envVar: string;
  testEndpoint: string;
  externalUrl?: string;
}

export const INTEGRATIONS: IntegrationDef[] = [
  { id: "vercel",     label: "Vercel",      description: "Live deployments, redeploy, rollback", envVar: "VERCEL_API_TOKEN",    testEndpoint: "/api/dashboard/integrations/vercel/test",     externalUrl: "https://vercel.com/account/tokens" },
  { id: "github",     label: "GitHub",      description: "Auto-create repos, pull PR + CI status", envVar: "GITHUB_TOKEN",       testEndpoint: "/api/dashboard/integrations/github/test",     externalUrl: "https://github.com/settings/tokens" },
  { id: "stripe",     label: "Stripe",      description: "Auto-invoice on signed offers, webhook payment confirm", envVar: "STRIPE_API_KEY", testEndpoint: "/api/dashboard/integrations/stripe/test", externalUrl: "https://dashboard.stripe.com/apikeys" },
  { id: "resend",     label: "Resend",      description: "Send outreach + receive replies (inbound)", envVar: "RESEND_API_KEY",   testEndpoint: "/api/dashboard/integrations/resend/test",     externalUrl: "https://resend.com/api-keys" },
  { id: "anthropic",  label: "Anthropic",   description: "Claude API for personalised drafts + ⌘K NL", envVar: "ANTHROPIC_API_KEY", testEndpoint: "/api/dashboard/integrations/anthropic/test",  externalUrl: "https://console.anthropic.com/settings/keys" },
  { id: "higgsfield", label: "Higgsfield",  description: "Hero imagery + cinematic video generation", envVar: "HIGGSFIELD_API_KEY", testEndpoint: "/api/dashboard/integrations/higgsfield/test", externalUrl: "https://cloud.higgsfield.ai" },
  { id: "checkvibe",  label: "CheckVibe",   description: "Per-deal security scans (XSS / auth / headers / secrets)", envVar: "CHECKVIBE_API_KEY", testEndpoint: "/api/dashboard/integrations/checkvibe/test", externalUrl: "https://checkvibe.dev" },
  { id: "vps",        label: "VPS (Hetzner)", description: "Build pipeline host (Claude Code in tmux)", envVar: "VPS_BUILD_TOKEN", testEndpoint: "/api/dashboard/integrations/vps/test",        externalUrl: "https://console.hetzner.cloud" },
];
