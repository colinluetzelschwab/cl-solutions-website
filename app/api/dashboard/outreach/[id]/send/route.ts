import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { crmGet, crmUpdate } from "@/app/jarvis/lib/crm-store";
import { activityAppend, inboxAppend } from "@/app/jarvis/lib/inbox-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || "Colin <colin@clsolutions.dev>";

/**
 * POST /api/dashboard/outreach/{id}/send
 *
 * Sends the saved bodyDraft via Resend, sets sentAt, logs activity,
 * appends an Inbox marker (so reply-tracking has context).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
  }

  try {
    const outreach = await crmGet("outreach", id);
    if (!outreach) return NextResponse.json({ error: "Outreach not found" }, { status: 404 });
    if (outreach.sentAt) return NextResponse.json({ error: "Already sent" }, { status: 409 });

    const lead = await crmGet("leads", outreach.leadId);
    if (!lead?.email) {
      return NextResponse.json({ error: "Lead has no email address" }, { status: 400 });
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [lead.email],
      subject: outreach.subject,
      text: outreach.bodyDraft,
      replyTo: FROM_ADDRESS,
    });

    if (error) {
      return NextResponse.json({ error: `Resend: ${error.message}` }, { status: 502 });
    }

    const sentAt = new Date().toISOString();
    const messageId = data?.id;
    const followUpAt = new Date(Date.now() + 9 * 86400 * 1000).toISOString();

    const updated = await crmUpdate("outreach", id, { sentAt, followUpAt });

    // Promote lead status to "contacted" if still earlier in the funnel
    if (["found", "qualified", "mockup_built"].includes(lead.status)) {
      await crmUpdate("leads", lead.id, { status: "contacted" });
    }

    await activityAppend({
      source: "resend",
      action: "outreach.sent",
      label: `Sent outreach to ${lead.businessName} (${lead.email})`,
      payload: { outreachId: id, leadId: lead.id, messageId },
    });
    await inboxAppend({
      kind: "system",
      severity: "success",
      source: "internal",
      title: `Outreach sent → ${lead.businessName}`,
      body: `Subject: ${outreach.subject}`,
      ref: { kind: "lead", id: lead.id },
    });

    return NextResponse.json({ outreach: updated, messageId });
  } catch (error) {
    console.error("Outreach send error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Send failed" }, { status: 500 });
  }
}
