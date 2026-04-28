import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { crmGet } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * POST { leadId, tone? } → { subject, body, model }
 *
 * Uses Anthropic Haiku 4.5 with prompt caching to generate a personalised
 * Swiss-German cold-outreach draft. Falls back to a deterministic template
 * if ANTHROPIC_API_KEY is not set, so JARVIS still works without the key.
 *
 * Tone options: "formal-de" (default, Sie), "informal-de" (du), "english"
 */

const SYSTEM_PROMPT = `Du bist Colin Lützelschwab, Inhaber von CL Solutions — einer kleinen
Schweizer Web-Agentur, die fixed-scope/fixed-price Websites in 3-5 Tagen
liefert. Pakete: Starter CHF 1500 (5 pages), Business CHF 3500 (10 pages
+ CMS), Pro CHF 7500 (20 pages, multi-language).

Schreibe eine kurze, ehrliche Erstansprache an einen potenziellen Kunden.
Stil: matter-of-fact, freundlich, nicht salesig, nicht aufdringlich.
Keine Buzzwords, kein "wir helfen Ihnen", keine 3-Bullet-Points-Listen.

Format der Antwort: NUR ein JSON-Objekt mit { "subject": "...", "body": "..." }.
Body ist plain text, mehrere Absätze ok, getrennt durch zwei Newlines.
Body endet mit "Schöne Grüsse,\\nColin · CL Solutions\\nhttps://clsolutions.dev"
(oder Englisch-Äquivalent bei tone=english).`;

function fallbackDraft(args: { name: string; industry?: string; location?: string; websiteUrl?: string }) {
  const { name, industry = "Ihrer Branche", location, websiteUrl } = args;
  const where = location ? ` in ${location}` : "";
  const sitePart = websiteUrl ? `Ich habe gerade ${websiteUrl.replace(/^https?:\/\//, "")} gesehen — ` : "";

  const subject = `Kurze Idee für ${name}`;
  const body = [
    `Hallo ${name}-Team,`,
    "",
    `${sitePart}und mir ist aufgefallen, dass die Seite ein paar einfache Hebel hat,`,
    `mit denen ${industry.toLowerCase()}-Betriebe${where} typischerweise mehr Anfragen über die Website kriegen.`,
    "",
    `Ich baue gerade eine kleine Vorschau, wie das bei euch aussehen könnte —`,
    `Mobile-first, eine schnelle Buchungs-/Kontakt-Strecke, klares Angebot.`,
    `Wenn das interessant klingt, schicke ich dir den Link in 1-2 Tagen.`,
    "",
    `Schöne Grüsse,`,
    `Colin · CL Solutions`,
    `https://clsolutions.dev`,
  ].join("\n");

  return { subject, body };
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { leadId, tone = "formal-de" } = await request.json();
    if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

    const lead = await crmGet("leads", leadId);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      const draft = fallbackDraft({
        name: lead.businessName,
        industry: lead.industry,
        location: lead.location,
        websiteUrl: lead.websiteUrl,
      });
      return NextResponse.json({ ...draft, model: "fallback-template" });
    }

    const client = new Anthropic({ apiKey });
    const userPrompt = `Schreibe eine Erstansprache.

Lead:
- Firma: ${lead.businessName}
${lead.industry ? `- Branche: ${lead.industry}` : ""}
${lead.location ? `- Ort: ${lead.location}` : ""}
${lead.websiteUrl ? `- Website: ${lead.websiteUrl}` : ""}
${lead.googleRating ? `- Google rating: ${lead.googleRating}/5` : ""}
${lead.websiteQualityScore ? `- Website quality score: ${lead.websiteQualityScore}/10` : ""}

Tone: ${tone}

Antwort als reines JSON, kein Markdown.`;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: [
        { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      ],
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find(b => b.type === "text");
    const raw = textBlock && "text" in textBlock ? textBlock.text : "";
    const json = raw.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
    let parsed: { subject?: string; body?: string };
    try {
      parsed = JSON.parse(json);
    } catch {
      // Claude didn't return valid JSON — fall back to template.
      const draft = fallbackDraft({
        name: lead.businessName,
        industry: lead.industry,
        location: lead.location,
        websiteUrl: lead.websiteUrl,
      });
      return NextResponse.json({ ...draft, model: "fallback-after-parse-error" });
    }

    return NextResponse.json({
      subject: parsed.subject || `Kurze Idee für ${lead.businessName}`,
      body: parsed.body || fallbackDraft({ name: lead.businessName }).body,
      model: "claude-haiku-4-5-20251001",
    });
  } catch (error) {
    console.error("Outreach draft error:", error);
    return NextResponse.json({ error: "Failed to build draft" }, { status: 500 });
  }
}
