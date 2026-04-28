import { NextRequest, NextResponse } from "next/server";
import { crmList, crmGet, crmCreate } from "@/app/jarvis/lib/crm-store";
import type { Outreach, ReplyStatus } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

const VALID_REPLY: ReplyStatus[] = ["none", "positive", "negative", "auto_reply"];

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const leadId = request.nextUrl.searchParams.get("leadId");
    const idx = await crmList("outreach");
    const filtered = leadId ? idx.filter(e => e.leadId === leadId) : idx;
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    // Fetch full records for the filtered set (the index entries don't carry bodyDraft).
    const records = await Promise.all(filtered.map(e => crmGet("outreach", e.id)));
    const outreach = records.filter((r): r is Outreach => r !== null);
    return NextResponse.json({ outreach });
  } catch (error) {
    console.error("Outreach list error:", error);
    return NextResponse.json({ error: "Failed to list outreach" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const leadId = String(body.leadId ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    if (!leadId || !subject) {
      return NextResponse.json({ error: "leadId and subject required" }, { status: 400 });
    }

    // Validate the lead exists (and surface a clear error if not).
    const lead = await crmGet("leads", leadId);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const replyStatus: ReplyStatus = VALID_REPLY.includes(body.replyStatus) ? body.replyStatus : "none";

    const partial: Omit<Outreach, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      leadId,
      subject,
      bodyDraft: String(body.bodyDraft ?? ""),
      sentAt: body.sentAt || undefined,
      followUpAt: body.followUpAt || undefined,
      replyStatus,
      mockupUrl: body.mockupUrl || undefined,
      notes: body.notes || undefined,
    };

    const outreach = await crmCreate("outreach", partial);
    return NextResponse.json({ outreach }, { status: 201 });
  } catch (error) {
    console.error("Outreach create error:", error);
    return NextResponse.json({ error: "Failed to create outreach" }, { status: 500 });
  }
}
