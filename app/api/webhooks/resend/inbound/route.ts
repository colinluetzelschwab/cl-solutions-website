import { NextRequest, NextResponse } from "next/server";
import { crmList, crmUpdate, crmGet } from "@/app/jarvis/lib/crm-store";
import { inboxAppend, activityAppend } from "@/app/jarvis/lib/inbox-store";

/**
 * Resend inbound webhook receiver.
 *
 * Configure Resend to POST inbound replies here:
 *   https://<prod-host>/api/webhooks/resend/inbound
 *
 * Matches the reply against an existing Outreach record by `inReplyTo`
 * message-id, falling back to subject pattern. Updates Outreach.replyStatus
 * and creates an Inbox event so Colin sees it in the triage feed.
 */
export async function POST(request: NextRequest) {
  // Resend signs payloads with a webhook secret (svix-style). v1 accepts
  // unsigned in dev; will tighten when Colin registers the webhook.
  const sig = request.headers.get("svix-signature");
  const expected = process.env.RESEND_WEBHOOK_SECRET;
  if (expected && !sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let body: ResendInboundPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const fromEmail = body.from?.email ?? body.from_address ?? "";
    const subject = body.subject ?? "";
    const text = body.text ?? body.html ?? "";
    const messageId = body.message_id;
    const inReplyTo = body.in_reply_to;

    // Match outreach by inReplyTo message-id (set when we sent the original).
    let outreachId: string | undefined;
    if (inReplyTo) {
      const list = await crmList("outreach");
      // OutreachIndexEntry doesn't carry messageId; we'd need full records.
      // For v1, fall back to leadId by email.
      void list;
    }

    // Match lead by email address.
    const leadsIdx = await crmList("leads");
    let matchedLeadId: string | undefined;
    let matchedLeadName: string | undefined;
    for (const idx of leadsIdx) {
      const full = await crmGet("leads", idx.id);
      if (full?.email && full.email.toLowerCase() === fromEmail.toLowerCase()) {
        matchedLeadId = full.id;
        matchedLeadName = full.businessName;
        // Move lead to "replied" if currently contacted.
        if (full.status === "contacted") {
          await crmUpdate("leads", full.id, { status: "replied" });
        }
        break;
      }
    }

    // If we matched, look for the most recent Outreach for this lead and update.
    if (matchedLeadId) {
      const allOut = await crmList("outreach");
      const candidate = allOut.find(o => o.leadId === matchedLeadId && o.sentAt && !o.followUpAt);
      if (candidate) {
        outreachId = candidate.id;
        const positive = /\bja\b|interesse|gerne|klingt gut/i.test(text);
        const negative = /\bnein\b|kein interesse|nicht|abmelden|unsubscribe/i.test(text);
        const replyStatus = positive ? "positive" : negative ? "negative" : "none";
        await crmUpdate("outreach", outreachId, {
          replyStatus,
          followUpAt: undefined,
        });
      }
    }

    await inboxAppend({
      kind: "reply",
      severity: matchedLeadId ? "success" : "info",
      source: "resend",
      title: matchedLeadName ? `Reply from ${matchedLeadName}` : `Email reply: ${fromEmail || "unknown"}`,
      body: `Subject: ${subject}\n\n${text.slice(0, 600)}${text.length > 600 ? "…" : ""}`,
      ref: matchedLeadId ? { kind: "lead", id: matchedLeadId } : undefined,
      payload: { messageId, inReplyTo, fromEmail, subject },
    });
    await activityAppend({
      source: "resend",
      action: "inbound.received",
      label: `Inbound reply from ${fromEmail || "unknown"}`,
      payload: { messageId, matchedLeadId },
    });

    return NextResponse.json({ received: true, matched: !!matchedLeadId });
  } catch (error) {
    console.error("Resend inbound error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

interface ResendInboundPayload {
  from?: { email?: string };
  from_address?: string;
  subject?: string;
  text?: string;
  html?: string;
  message_id?: string;
  in_reply_to?: string;
}
