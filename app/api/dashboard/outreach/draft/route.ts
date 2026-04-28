import { NextRequest, NextResponse } from "next/server";
import { crmGet } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * POST { leadId } → { subject, body }
 * Templated MVP — Anthropic-personalized drafts are deferred to Phase 2.
 *
 * The template uses the lead's businessName, industry, location and
 * websiteUrl. Voice is Colin's: matter-of-fact, German-speaking
 * Switzerland, friendly but not salesy.
 */
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { leadId } = await request.json();
    if (!leadId) return NextResponse.json({ error: "leadId required" }, { status: 400 });

    const lead = await crmGet("leads", leadId);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const name = lead.businessName;
    const industry = lead.industry?.toLowerCase() || "Ihrer Branche";
    const where = lead.location ? ` in ${lead.location}` : "";
    const sitePart = lead.websiteUrl
      ? `Ich habe gerade ${lead.websiteUrl.replace(/^https?:\/\//, "")} gesehen — `
      : "";

    const subject = `Kurze Idee für ${name}`;

    const body = [
      `Hallo ${name}-Team,`,
      "",
      `${sitePart}und mir ist aufgefallen, dass die Seite ein paar einfache Hebel hat,`,
      `mit denen ${industry}-Betriebe${where} typischerweise mehr Anfragen über die Website kriegen.`,
      "",
      `Ich baue gerade eine kleine Vorschau, wie das bei euch aussehen könnte —`,
      `Mobile-first, eine schnelle Buchungs-/Kontakt-Strecke, klares Angebot.`,
      `Wenn das interessant klingt, schicke ich dir den Link in 1-2 Tagen.`,
      "",
      `Schöne Grüsse,`,
      `Colin · CL Solutions`,
      `https://clsolutions.dev`,
    ].join("\n");

    return NextResponse.json({ subject, body });
  } catch (error) {
    console.error("Outreach draft error:", error);
    return NextResponse.json({ error: "Failed to build draft" }, { status: 500 });
  }
}
