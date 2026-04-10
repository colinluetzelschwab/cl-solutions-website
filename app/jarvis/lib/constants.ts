import type { Tab } from "./types";

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

export const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "briefs", label: "BRIEFS", icon: "▧" },
  { id: "live", label: "LIVE", icon: "◉" },
  { id: "systems", label: "SYSTEMS", icon: "◈" },
  { id: "settings", label: "CONFIG", icon: "⚙" },
];

export const LINKS = [
  { label: "Vercel", url: "https://vercel.com/colinluetzelschwabs-projects" },
  { label: "GitHub", url: "https://github.com/colinluetzelschwab" },
  { label: "Resend", url: "https://resend.com" },
  { label: "Hetzner", url: "https://console.hetzner.cloud" },
  { label: "CL Solutions", url: "https://clsolutions.dev" },
];

export function statusColor(s: string): string {
  switch (s.toUpperCase()) {
    case "READY": return C.success;
    case "BUILDING": case "QUEUED": case "INITIALIZING": return C.warning;
    case "ERROR": case "CANCELED": return C.error;
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
