/**
 * Outreach Sequence Runner — Vercel Cron.
 *
 * Runs daily at 09:00 Europe/Zurich (see vercel.json).
 *
 * Auth: requires `Authorization: Bearer ${CRON_SECRET}` header.
 *  - Vercel Cron sends this header automatically when CRON_SECRET is set
 *    in project env (https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs).
 *  - For manual testing: pass `?cron_token=<secret>` query string instead.
 *
 * Logic per run:
 *  1. List all outreach records.
 *  2. For each record where:
 *       - sentAt is set
 *       - replyStatus === "none"
 *       - sequenceClosedAt is unset
 *       - touchCount < 3
 *       - followUpAt <= now
 *     → fire the next touch via Resend, update touchCount + followUpAt.
 *  3. After Touch 3, set sequenceClosedAt — record will not be touched again.
 *  4. Append activity + inbox events for visibility.
 */

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { crmGet, crmList, crmUpdate } from "@/app/jarvis/lib/crm-store";
import { activityAppend, inboxAppend } from "@/app/jarvis/lib/inbox-store";
import { nextTouchFor } from "@/app/jarvis/lib/outreach-touches";
import { pollOutreachReply } from "@/app/jarvis/lib/outreach-replies";
import type { Lead, Outreach } from "@/app/jarvis/lib/crm-types";

const FROM_ADDRESS = process.env.RESEND_FROM_ADDRESS || "Colin <colin@clsolutions.dev>";

function isCronAuthenticated(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  const token = request.nextUrl.searchParams.get("cron_token");
  if (token && token === secret) return true;
  return false;
}

interface RunResult {
  processed: number;
  sent: number;
  closed: number;
  repliesDetected: number;
  errors: Array<{ outreachId: string; reason: string }>;
}

export async function GET(request: NextRequest) {
  if (!isCronAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
  }

  const now = Date.now();
  const result: RunResult = { processed: 0, sent: 0, closed: 0, repliesDetected: 0, errors: [] };

  let outreachIndex: Awaited<ReturnType<typeof crmList<"outreach">>>;
  try {
    outreachIndex = await crmList("outreach");
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to list outreach: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    );
  }

  // Phase 1: reply detection. For every open outreach (sentAt set, replyStatus
  // still "none", sequence not closed), IMAP-poll the INBOX for messages from
  // the lead's email since sentAt. If found, classify + persist replyStatus.
  // This runs BEFORE the touch-firing loop so a detected reply skips the bump.
  for (const entry of outreachIndex) {
    if (!entry.sentAt) continue;
    if (entry.replyStatus !== "none") continue;
    if (entry.sequenceClosedAt) continue;

    let outreach: Outreach | null = null;
    let lead: Lead | null = null;
    try {
      outreach = await crmGet("outreach", entry.id);
      if (!outreach) continue;
      lead = await crmGet("leads", outreach.leadId);
      if (!lead?.email) continue;

      const reply = await pollOutreachReply(outreach, lead);
      if (!reply.found) continue;

      result.repliesDetected++;
      const classification = reply.classification ?? "positive";
      const closes = reply.shouldCloseSequence ?? true;
      const detectedAt = new Date().toISOString();

      await crmUpdate("outreach", outreach.id, {
        replyStatus: classification,
        sequenceClosedAt: closes ? detectedAt : undefined,
        notes: [outreach.notes, `Reply detected ${detectedAt} (${classification}): "${reply.excerpt ?? ""}"`].filter(Boolean).join(" | "),
      });

      // If it's a real human reply (not auto-reply), promote the lead.
      if (closes && lead.status === "contacted") {
        await crmUpdate("leads", lead.id, { status: "replied" });
      }

      await activityAppend({
        source: "internal",
        action: "outreach.reply.detected",
        label: `Reply (${classification}) ← ${lead.businessName}`,
        payload: {
          outreachId: outreach.id,
          leadId: lead.id,
          classification,
          subject: reply.subject,
          date: reply.date,
        },
      });
      await inboxAppend({
        kind: "reply",
        severity: classification === "negative" ? "warning" : classification === "auto_reply" ? "info" : "success",
        source: "imap",
        title: `Reply (${classification}) ← ${lead.businessName}`,
        body: reply.excerpt ?? reply.subject ?? "(no preview)",
        ref: { kind: "lead", id: lead.id },
      });
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      result.errors.push({ outreachId: entry.id, reason: `reply-poll: ${reason}` });
    }
  }

  // Re-fetch the index after reply phase since some replyStatus values may
  // have changed — we want the touch loop to see fresh state.
  try {
    outreachIndex = await crmList("outreach");
  } catch {
    // If the re-fetch fails, fall through with the old list — touch loop will
    // skip records we just updated since their entries still have replyStatus="none"
    // in the cached index, but the actual record (which the loop refetches
    // via crmGet) will show the updated status.
  }

  const resend = new Resend(apiKey);

  // Phase 2: touch firing. Existing logic — fires Touch-2 / Touch-3 via Resend.
  for (const entry of outreachIndex) {
    if (!entry.sentAt) continue;
    if (entry.replyStatus !== "none") continue;
    if (entry.sequenceClosedAt) continue;
    if ((entry.touchCount ?? 1) >= 3) continue;
    if (!entry.followUpAt) continue;
    if (new Date(entry.followUpAt).getTime() > now) continue;

    result.processed++;

    let outreach: Outreach | null = null;
    let lead: Lead | null = null;
    try {
      outreach = await crmGet("outreach", entry.id);
      if (!outreach) throw new Error("Outreach record disappeared");
      lead = await crmGet("leads", outreach.leadId);
      if (!lead?.email) throw new Error("Lead missing email");

      const touch = nextTouchFor(outreach, lead);
      if (!touch) continue;

      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: [lead.email],
        subject: touch.subject,
        text: touch.body,
        replyTo: FROM_ADDRESS,
      });
      if (error) throw new Error(`Resend: ${error.message}`);

      const sentAt = new Date().toISOString();
      const isFinalTouch = touch.touchNumber === 3;

      await crmUpdate("outreach", outreach.id, {
        touchCount: touch.touchNumber,
        lastTouchAt: sentAt,
        followUpAt: touch.nextFollowUpAt,
        sequenceClosedAt: isFinalTouch ? sentAt : undefined,
      });

      await activityAppend({
        source: "resend",
        action: "outreach.sequence.sent",
        label: `Touch ${touch.touchNumber} → ${lead.businessName}`,
        payload: {
          outreachId: outreach.id,
          leadId: lead.id,
          touchNumber: touch.touchNumber,
          finalTouch: isFinalTouch,
        },
      });
      await inboxAppend({
        kind: "system",
        severity: isFinalTouch ? "warning" : "info",
        source: "internal",
        title: `Sequence Touch ${touch.touchNumber}${isFinalTouch ? " (close-out)" : ""} → ${lead.businessName}`,
        body: isFinalTouch
          ? "Final follow-up sent — sequence closed, no further touches."
          : `Gentle bump sent. Next close-out scheduled for ${touch.nextFollowUpAt?.slice(0, 10) ?? "—"}.`,
        ref: { kind: "lead", id: lead.id },
      });

      result.sent++;
      if (isFinalTouch) result.closed++;
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      result.errors.push({ outreachId: entry.id, reason });
      // Don't update sequence state on error — let the next run retry.
      try {
        await inboxAppend({
          kind: "system",
          severity: "error",
          source: "internal",
          title: `Sequence error → ${lead?.businessName ?? entry.id}`,
          body: reason,
          ref: lead ? { kind: "lead", id: lead.id } : undefined,
        });
      } catch {
        // If even inbox append fails we just lose this log line.
      }
    }
  }

  return NextResponse.json({ ok: true, ...result, scannedAt: new Date().toISOString() });
}
