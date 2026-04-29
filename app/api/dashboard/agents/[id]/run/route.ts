import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { list } from "@vercel/blob";
import { AGENTS } from "@/app/jarvis/lib/agent-types";
import type { AgentId, AgentRun } from "@/app/jarvis/lib/agent-types";
import { agentRunsAppend, agentRunsUpdate, inboxAppend, activityAppend } from "@/app/jarvis/lib/inbox-store";
import { crmList, crmCreate } from "@/app/jarvis/lib/crm-store";
import { putSkeleton, type Skeleton } from "@/app/jarvis/lib/skeleton-store";

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
    case "lead-scrape":       return runLeadScrape(input);
    case "batch-outreach":    return runBatchOutreach();
    case "mockup-blast":      return runMockupBlast();
    case "weekly-snapshot":   return runWeeklySnapshot();
    case "stale-reaper":      return runStaleReaper(input);
    case "invoice-chase":     return runInvoiceChase();
    case "retainer-pitch":    return runRetainerPitch();
    case "repo-cleanup":      return runRepoCleanup(input);
    case "brief-to-skeleton": return runBriefToSkeleton(input);
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

/* ── Brief → Skeleton ─────────────────────────────────────────────
 * Fetch a brief from blob storage, ask Haiku to produce a structured
 * Skeleton plan (pages, sections, palette, fonts, copy outline), then
 * persist to crm/skeletons/{briefId}.json. Output is consumed by
 * Claude Code (or a human) to bootstrap the actual project build.
 * ────────────────────────────────────────────────────────────────── */

const SKELETON_SYSTEM_PROMPT = `Du bist Solution Architect bei CL Solutions, einer Schweizer Web-Agentur. Du erhältst einen Brief von einem potenziellen Kunden und produzierst einen strukturierten Skeleton-Plan, den ein Entwickler oder ein KI-Coder direkt in einen Next.js-Projektaufbau übersetzen kann.

Stack ist nicht verhandelbar:
- Next.js 14 App Router
- Tailwind CSS v4 mit @theme directive
- TypeScript strict
- Vercel Deployment
- Geist via next/font/google
- shadcn/ui für Basis-Komponenten

Der Skeleton MUSS valides JSON sein, das exakt diesem Schema folgt:

{
  "briefId": string,
  "leadId": string | null,
  "generatedAt": ISO-8601 string,
  "recommendedStack": {
    "framework": "next-14",
    "styling": "tailwind-v4",
    "cms": "none",
    "deployment": "vercel"
  },
  "pages": [
    {
      "slug": string (z.B. "/", "/services", "/contact"),
      "label": string (Label im Nav, z.B. "Home", "Leistungen"),
      "purpose": string (1 Satz, was die Seite leisten soll),
      "sections": [
        { "kind": string (hero|services|about|team|pricing|testimonials|gallery|cta|contact|faq|footer|...),
          "copyOutline": string (1-3 Sätze Inhaltsidee — keine fertige Copy) }
      ]
    }
  ],
  "designDirection": {
    "palette": { "primary": hex, "secondary"?: hex, "accent"?: hex },
    "fontFamily": string (Geist als default; Spezialwunsch nur bei klarer Brief-Angabe),
    "moodKeywords": string[] (3-6 Adjektive: "minimal", "warm", "präzise", "editorial", ...)
  },
  "contentNotes": string[] (Hinweise zu Texten, Bildbedarf, Logo-Status),
  "technicalConsiderations": string[] (z.B. "Mehrsprachig DE/FR via next-intl", "Lighthouse mobile 85+", "Kontaktformular via Resend")
}

Regeln:
- Antworte NUR mit dem JSON-Objekt, kein Markdown-Codeblock, kein Begleittext.
- Schweizer Hochdeutsch (kein "ß").
- Wenn der Brief mehrsprachig fordert, vermerke das in technicalConsiderations.
- Wenn Logo "request to generate" markiert ist, vermerke das in contentNotes.
- Wenn Farben fehlen, schlage eine Palette vor, die zur Branche passt.`;

interface BriefRecord {
  id: string;
  businessInfo?: { name?: string; email?: string; businessType?: string };
  package?: { selectedPackage?: string };
  design?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    fontPreference?: string;
    language?: string;
    designPreferences?: string[];
    references?: string;
    darkMode?: boolean;
  };
  pagesFeatures?: { pages?: string[]; features?: string[]; otherPages?: string; otherFeatures?: string };
  uploads?: { logo?: string; photos?: string[]; document?: string; requestLogoGeneration?: boolean };
  notes?: string;
}

async function fetchBriefById(briefId: string): Promise<BriefRecord | null> {
  const { blobs } = await list({ prefix: `briefs/${briefId}` });
  const target = blobs.find((b) => b.pathname === `briefs/${briefId}.json`);
  if (!target) return null;
  const res = await fetch(target.url);
  if (!res.ok) return null;
  return (await res.json()) as BriefRecord;
}

function findLeadIdByBriefId(briefId: string): Promise<string | undefined> {
  return crmList("leads").then((leads) => leads.find((l) => (l as { briefId?: string }).briefId === briefId)?.id);
}

async function runBriefToSkeleton(input: Record<string, string | number>): Promise<AgentResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const briefId = String(input.briefId ?? "").trim();
  if (!briefId) throw new Error("briefId is required");

  const brief = await fetchBriefById(briefId);
  if (!brief) throw new Error(`Brief ${briefId} not found in blob storage`);

  const leadId = await findLeadIdByBriefId(briefId);

  const userPrompt = [
    `Brief ID: ${briefId}`,
    leadId ? `Linked Lead ID: ${leadId}` : "No lead linked yet.",
    "",
    "Brief payload (vom öffentlichen Formular):",
    "```json",
    JSON.stringify(brief, null, 2),
    "```",
    "",
    "Erzeuge den Skeleton-Plan als JSON nach Schema. Antworte NUR mit dem JSON-Objekt.",
  ].join("\n");

  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 3500,
    system: [{ type: "text", text: SKELETON_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userPrompt }],
  });

  const block = response.content.find((c) => c.type === "text");
  if (!block || block.type !== "text") throw new Error("Anthropic returned no text content");

  let skeleton: Skeleton;
  try {
    const parsed = JSON.parse(block.text) as Partial<Skeleton>;
    skeleton = {
      briefId,
      leadId: leadId ?? parsed.leadId,
      generatedAt: new Date().toISOString(),
      recommendedStack: {
        framework: "next-14",
        styling: "tailwind-v4",
        cms: "none",
        deployment: "vercel",
      },
      pages: parsed.pages ?? [],
      designDirection: parsed.designDirection ?? {
        palette: { primary: brief.design?.primaryColor ?? "#0a0a0a" },
        fontFamily: "Geist",
        moodKeywords: [],
      },
      contentNotes: parsed.contentNotes ?? [],
      technicalConsiderations: parsed.technicalConsiderations ?? [],
    };
  } catch (parseError) {
    throw new Error(
      `Failed to parse skeleton JSON from Anthropic: ${parseError instanceof Error ? parseError.message : String(parseError)}. Raw text: ${block.text.slice(0, 200)}…`,
    );
  }

  const url = await putSkeleton(skeleton);
  const businessName = brief.businessInfo?.name ?? briefId;

  return {
    outputCount: 1,
    summary: `Skeleton for ${businessName} → ${skeleton.pages.length} pages, ${skeleton.designDirection.moodKeywords.length} mood keywords. Saved to ${url}`,
  };
}
