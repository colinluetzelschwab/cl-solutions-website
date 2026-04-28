import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/app/jarvis/lib/agent-types";
import type { AgentId, AgentRun } from "@/app/jarvis/lib/agent-types";
import { agentRunsAppend, agentRunsUpdate, inboxAppend, activityAppend } from "@/app/jarvis/lib/inbox-store";
import { crmList, crmCreate } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

const ID_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function makeRunId(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += ID_ALPHABET[bytes[i] % ID_ALPHABET.length];
  return `run_${s}`;
}

/**
 * POST /api/dashboard/agents/{id}/run
 *
 * Triggers an agent. v1: synchronous (waits for completion). v2 might queue.
 * Each agent has a stub implementation here — they orchestrate Claude API
 * calls and CRM mutations.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const agentId = id as AgentId;
  const def = AGENTS.find(a => a.id === agentId);
  if (!def) return NextResponse.json({ error: "Unknown agent" }, { status: 404 });

  const input = await request.json().catch(() => ({}));
  const run: AgentRun = {
    id: makeRunId(),
    agentId,
    status: "running",
    startedAt: new Date().toISOString(),
    input,
    outputCount: 0,
  };
  await agentRunsAppend(run);
  await activityAppend({ source: "agent", action: `agent.run.start`, label: `Started agent: ${def.label}` });

  try {
    const result = await runAgent(agentId, input);
    await agentRunsUpdate(run.id, {
      status: "complete",
      finishedAt: new Date().toISOString(),
      outputCount: result.outputCount,
      resultSummary: result.summary,
    });
    await activityAppend({ source: "agent", action: `agent.run.complete`, label: `Agent ${def.label}: ${result.summary}` });
    await inboxAppend({
      kind: "system",
      severity: "success",
      source: "agent",
      title: `Agent finished: ${def.label}`,
      body: result.summary,
    });
    return NextResponse.json({ run: { ...run, ...result, status: "complete" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await agentRunsUpdate(run.id, {
      status: "failed",
      finishedAt: new Date().toISOString(),
      errorMessage: message,
    });
    await inboxAppend({
      kind: "system",
      severity: "error",
      source: "agent",
      title: `Agent failed: ${def.label}`,
      body: message,
    });
    return NextResponse.json({ run, error: message }, { status: 500 });
  }
}

interface AgentResult { outputCount: number; summary: string }

async function runAgent(id: AgentId, input: Record<string, string | number>): Promise<AgentResult> {
  switch (id) {
    case "lead-scrape":     return runLeadScrape(input);
    case "batch-outreach":  return runBatchOutreach();
    case "mockup-blast":    return runMockupBlast();
    case "weekly-snapshot": return runWeeklySnapshot();
    case "stale-reaper":    return runStaleReaper(input);
    case "invoice-chase":   return runInvoiceChase();
    case "retainer-pitch":  return runRetainerPitch();
    case "repo-cleanup":    return runRepoCleanup(input);
  }
}

/* ── Agent implementations (v1 stubs that do real work where possible) ── */

async function runLeadScrape(input: Record<string, string | number>): Promise<AgentResult> {
  // v1: requires real scraper — for now create N placeholder leads and let Colin enrich.
  // When Anthropic key is set, we could prompt Claude with city+industry to suggest plausible
  // SMB names. For determinism, v1 just creates marker leads.
  const target = Math.min(Number(input.target ?? 5), 20);
  const city = String(input.city ?? "Zürich");
  const industry = String(input.industry ?? "");

  let created = 0;
  for (let i = 0; i < target; i++) {
    await crmCreate("leads", {
      businessName: `[Scrape] ${city} prospect ${i + 1}`,
      industry: industry || undefined,
      location: city,
      priority: 3,
      status: "found",
      source: "scraper",
      notes: `Auto-created by lead-scrape agent (target=${target}). Enrich with website, email, phone.`,
      createdBy: "system",
    });
    created++;
  }
  return { outputCount: created, summary: `Created ${created} placeholder leads in ${city}${industry ? ` · ${industry}` : ""}` };
}

async function runBatchOutreach(): Promise<AgentResult> {
  // For each Lead in `qualified` with no outreach yet, generate a draft via /outreach/draft.
  // v1: returns count without firing the draft endpoint (would need internal fetch loop).
  const leads = await crmList("leads");
  const qualified = leads.filter(l => l.status === "qualified");
  return { outputCount: qualified.length, summary: `Found ${qualified.length} qualified Deals needing outreach (drafts will populate as you click [Draft])` };
}

async function runMockupBlast(): Promise<AgentResult> {
  const leads = await crmList("leads");
  const hot = leads.filter(l => l.priority === 1);
  return { outputCount: hot.length, summary: `Found ${hot.length} hot leads — mockup-blast wiring requires Higgsfield + temp-Vercel pipeline (deferred)` };
}

async function runWeeklySnapshot(): Promise<AgentResult> {
  const projects = await crmList("crm-projects");
  const live = projects.filter(p => p.status === "live");
  return { outputCount: live.length, summary: `${live.length} live sites — weekly snapshot pipeline requires CheckVibe + Lighthouse runner (deferred)` };
}

async function runStaleReaper(input: Record<string, string | number>): Promise<AgentResult> {
  const ageDays = Number(input.ageDays ?? 90);
  const cutoff = Date.now() - ageDays * 86400 * 1000;
  const leads = await crmList("leads");
  const stale = leads.filter(l => {
    const t = new Date(l.updatedAt).getTime();
    return t < cutoff && !["won", "lost"].includes(l.status);
  });
  return { outputCount: stale.length, summary: `Found ${stale.length} leads idle > ${ageDays}d (review-only in v1; auto-mark dormant deferred)` };
}

async function runInvoiceChase(): Promise<AgentResult> {
  const offers = await crmList("offers");
  const overdue = offers.filter(o => o.invoiceSent && !o.paid && new Date(o.validUntil) < new Date());
  return { outputCount: overdue.length, summary: `${overdue.length} overdue invoices identified (Resend send wiring required)` };
}

async function runRetainerPitch(): Promise<AgentResult> {
  const projects = await crmList("crm-projects");
  const candidates = projects.filter(p => p.status === "live");
  return { outputCount: candidates.length, summary: `${candidates.length} live projects eligible for retainer (needs Anthropic + Resend pipeline)` };
}

async function runRepoCleanup(input: Record<string, string | number>): Promise<AgentResult> {
  const ageDays = Number(input.ageDays ?? 14);
  return { outputCount: 0, summary: `Repo cleanup requires GITHUB_TOKEN — listing only (age cutoff ${ageDays}d)` };
}
