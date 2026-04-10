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

export type Tab = "briefs" | "live" | "systems" | "settings";
