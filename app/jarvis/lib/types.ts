export interface BriefSummary {
  id: string;
  clientName: string;
  email: string;
  packageId: string;
  totalPrice: number;
  createdAt: string;
  couponUsed: boolean;
  blobUrl: string;
  status: "new" | "building" | "built" | "failed";
  // Design fields for expanded view
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  pages?: string[];
  features?: string[];
  designPreferences?: string[];
  fontPreference?: string;
  language?: string;
  darkMode?: boolean;
  notes?: string;
  businessType?: string;
  hostingPlan?: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  framework: string | null;
  status: string;
  url: string | null;
  lastDeployedAt: string | null;
  repo: string | null;
}

export interface ActiveBuild {
  slug: string;
  clientName: string;
  briefId: string;
  startedAt: string;
}

export interface BuildHistoryEntry {
  slug: string;
  clientName: string;
  briefId: string;
  startedAt: string;
  completedAt: string | null;
  status: "complete" | "failed" | "running";
  duration: number | null;
  deployUrl: string | null;
}

export interface VpsHealth {
  status: "online" | "offline" | "degraded";
  uptime: number;
  error?: string;
}

/**
 * JARVIS 2.0 surfaces. Replaces the flat Tab union.
 * 7 surfaces grouped into WORK / OPS / CFG.
 *
 * Legacy aliases (briefs, live, systems, pipeline, settings, actions) are
 * kept temporarily so deep links + localStorage tab persistence don't
 * break. They map onto the new surfaces in JarvisApp.
 */
export type Surface =
  // WORK group
  | "today"
  | "deals"
  | "inbox"
  | "agents"
  // OPS group
  | "ops"
  | "money"
  // ⚙
  | "config";

/** Legacy alias kept for back-compat (localStorage, deep links). */
export type LegacyTab =
  | "briefs"
  | "live"
  | "systems"
  | "settings"
  | "pipeline"
  | "actions";

export type Tab = Surface | LegacyTab;

/** Map any legacy tab id → its new surface. */
export const LEGACY_TO_SURFACE: Record<LegacyTab, Surface> = {
  briefs: "deals",
  pipeline: "deals",
  live: "ops",
  systems: "ops",
  actions: "today",
  settings: "config",
};
