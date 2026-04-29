/**
 * ⌘K command registry — single-action invocations across surfaces.
 * Each command is { id, label, run }. Commands surface contextually
 * based on the current surface and current selection.
 *
 * Commands run via /api/dashboard/* routes; UI handles confirms/result
 * toasts. NL resolution (typed phrase → command) is a v2 nice-to-have.
 */

import type { Surface } from "./types";

export interface JarvisCommand {
  id: string;
  /** Canonical label shown in the palette. */
  label: string;
  /** Optional short description shown beneath label. */
  hint?: string;
  /** Keywords that match this command in fuzzy search. */
  keywords?: string[];
  /** Section heading in the palette. */
  group: "Action" | "Navigate" | "Create" | "Run agent" | "System";
  /** Surfaces where this command is relevant. Empty = always. */
  surfaces?: Surface[];
  /** Endpoint to fire (POST/PATCH/DELETE). Optional for navigate-only. */
  endpoint?: string;
  method?: "POST" | "PATCH" | "DELETE" | "GET";
  /** Static body, or a function called at run time. */
  body?: Record<string, unknown>;
  /** Confirm prompt before firing. */
  confirm?: string;
  /** For navigate-only commands. */
  navigate?: Surface | { surface: Surface; query?: Record<string, string> };
  /** External URL to open. */
  href?: string;
}

export const COMMANDS: JarvisCommand[] = [
  // Navigate
  { id: "nav-today",  label: "Go to Today",  group: "Navigate", navigate: "today",  keywords: ["home", "actions", "queue"] },
  { id: "nav-deals",  label: "Go to Deals",  group: "Navigate", navigate: "deals",  keywords: ["pipeline", "leads", "offers", "projects"] },
  { id: "nav-inbox",  label: "Go to Inbox",  group: "Navigate", navigate: "inbox",  keywords: ["replies", "events"] },
  { id: "nav-agents", label: "Go to Agents", group: "Navigate", navigate: "agents", keywords: ["workflows", "ai"] },
  { id: "nav-ops",    label: "Go to Ops",    group: "Navigate", navigate: "ops",    keywords: ["builds", "infra", "vps", "vercel"] },
  { id: "nav-money",  label: "Go to Money",  group: "Navigate", navigate: "money",  keywords: ["finance", "revenue", "costs", "mrr"] },
  { id: "nav-config", label: "Go to Config", group: "Navigate", navigate: "config", keywords: ["settings", "connections", "secrets"] },

  // Create
  { id: "create-lead",  label: "Create lead", group: "Create", endpoint: "/api/dashboard/leads", method: "POST", body: { source: "manual", priority: 2, status: "found", businessName: "New lead" }, keywords: ["new", "lead", "prospect"] },
  { id: "create-offer", label: "Create offer (blank)", group: "Create", endpoint: "/api/dashboard/offers", method: "POST", body: { client: "", packageId: "business", amount: 3500, validUntil: new Date(Date.now() + 14 * 86400 * 1000).toISOString() }, keywords: ["new", "offer", "invoice"] },
  { id: "create-cost",  label: "Add cost (this month)", group: "Create", endpoint: "/api/dashboard/costs", method: "POST", body: { category: "tools", amount: 0, month: new Date().toISOString().slice(0, 7) }, keywords: ["expense", "cost"] },

  // System
  { id: "test-vercel",     label: "Test Vercel connection",     group: "System", endpoint: "/api/dashboard/integrations/vercel/test",     method: "GET" },
  { id: "test-github",     label: "Test GitHub connection",     group: "System", endpoint: "/api/dashboard/integrations/github/test",     method: "GET" },
  { id: "test-stripe",     label: "Test Stripe connection",     group: "System", endpoint: "/api/dashboard/integrations/stripe/test",     method: "GET" },
  { id: "test-resend",     label: "Test Resend connection",     group: "System", endpoint: "/api/dashboard/integrations/resend/test",     method: "GET" },
  { id: "test-anthropic",  label: "Test Anthropic connection",  group: "System", endpoint: "/api/dashboard/integrations/anthropic/test",  method: "GET" },
  { id: "test-checkvibe",  label: "Test CheckVibe connection",  group: "System", endpoint: "/api/dashboard/integrations/checkvibe/test",  method: "GET" },
  { id: "test-vps",        label: "Test VPS connection",        group: "System", endpoint: "/api/dashboard/integrations/vps/test",        method: "GET" },
  { id: "test-fal",        label: "Test fal.ai connection",     group: "System", endpoint: "/api/dashboard/integrations/fal/test",        method: "GET" },

  // Run agent (one-tap)
  { id: "run-lead-scrape",     label: "Run agent: lead-scrape Zürich",   group: "Run agent", endpoint: "/api/dashboard/agents/lead-scrape/run", method: "POST", body: { city: "Zürich", target: 15 } },
  { id: "run-batch-outreach",  label: "Run agent: batch outreach drafts", group: "Run agent", endpoint: "/api/dashboard/agents/batch-outreach/run", method: "POST", body: { tone: "formal-de" }, confirm: "Generate drafts for every qualified Deal without outreach?" },
  { id: "run-invoice-chase",   label: "Run agent: invoice chase",        group: "Run agent", endpoint: "/api/dashboard/agents/invoice-chase/run", method: "POST", body: {}, confirm: "Send reminder emails for all overdue invoices?" },
  { id: "run-stale-reaper",    label: "Run agent: stale-lead reaper",    group: "Run agent", endpoint: "/api/dashboard/agents/stale-reaper/run", method: "POST", body: { ageDays: 90 }, confirm: "Mark all leads idle > 90d as dormant?" },
];
