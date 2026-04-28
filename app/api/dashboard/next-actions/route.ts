import { NextRequest, NextResponse } from "next/server";
import { crmList, crmGet } from "@/app/jarvis/lib/crm-store";
import type { NextAction } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

function daysSince(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntil(iso: string): number {
  return Math.floor((new Date(iso).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/**
 * GET → derived NextAction[] sorted by priority desc, capped at 30.
 * Rules:
 *   - follow_up: outreach.sentAt && replyStatus !== "positive" && followUpAt <= now
 *   - mockup_needed: lead.status === "qualified" && no Mockup linked to lead
 *   - offer_waiting: !contractSigned && validUntil > now
 *   - invoice_unpaid: invoiceSent && !paid
 *   - project_blocked: project.status === "waiting_content"
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Pull index files (lightweight). Detail records fetched only where needed.
    const [leadIdx, outreachIdx, offerIdx, projectIdx, mockupIdx] = await Promise.all([
      crmList("leads"),
      crmList("outreach"),
      crmList("offers"),
      crmList("crm-projects"),
      crmList("mockups"),
    ]);

    const leadById = new Map(leadIdx.map(l => [l.id, l]));
    const mockupLeadIds = new Set(mockupIdx.map(m => m.leadId));

    const out: NextAction[] = [];

    // ── follow_up ─────────────────────────────────────────────
    // Index entries already carry sentAt, followUpAt, replyStatus.
    for (const o of outreachIdx) {
      if (!o.sentAt || o.replyStatus === "positive") continue;
      if (!o.followUpAt) continue;
      if (new Date(o.followUpAt).getTime() > Date.now()) continue;
      const lead = leadById.get(o.leadId);
      out.push({
        id: `act_followup_${o.id}`,
        kind: "follow_up",
        refId: o.id,
        refKind: "outreach",
        title: `Follow up: ${lead?.name ?? "(lead missing)"}`,
        subtitle: `${daysSince(o.sentAt)}d since send`,
        dueAt: o.followUpAt,
        priority: 50 + daysSince(o.followUpAt) * 5,
      });
    }

    // ── mockup_needed ─────────────────────────────────────────
    for (const l of leadIdx) {
      if (l.status !== "qualified") continue;
      if (mockupLeadIds.has(l.id)) continue;
      out.push({
        id: `act_mockup_${l.id}`,
        kind: "mockup_needed",
        refId: l.id,
        refKind: "lead",
        title: `Build mockup for ${l.name}`,
        priority: 40 + (4 - l.priority) * 10,
      });
    }

    // ── offer_waiting + invoice_unpaid (need full offer records) ─
    const offerRecords = await Promise.all(offerIdx.map(e => crmGet("offers", e.id)));
    for (const o of offerRecords) {
      if (!o) continue;
      const expired = new Date(o.validUntil).getTime() <= Date.now();
      if (!o.contractSigned && !expired) {
        const dUntil = daysUntil(o.validUntil);
        out.push({
          id: `act_offer_${o.id}`,
          kind: "offer_waiting",
          refId: o.id,
          refKind: "offer",
          title: `Offer ${o.offerNumber} pending: ${o.client}`,
          subtitle: `expires in ${dUntil}d`,
          dueAt: o.validUntil,
          priority: 60 + (dUntil < 3 ? 30 : 0),
        });
      }
      if (o.invoiceSent && !o.paid) {
        const since = o.invoiceSentAt ? daysSince(o.invoiceSentAt) : 0;
        out.push({
          id: `act_unpaid_${o.id}`,
          kind: "invoice_unpaid",
          refId: o.id,
          refKind: "offer",
          title: `Unpaid: ${o.client} CHF ${o.amount.toLocaleString("de-CH")}`,
          subtitle: `${since}d outstanding`,
          priority: 80 + since * 2,
        });
      }
    }

    // ── project_blocked ───────────────────────────────────────
    for (const p of projectIdx) {
      if (p.status !== "waiting_content") continue;
      out.push({
        id: `act_blocked_${p.id}`,
        kind: "project_blocked",
        refId: p.id,
        refKind: "project",
        title: `${p.client} waiting for content`,
        subtitle: `${daysSince(p.updatedAt)}d stuck`,
        priority: 30 + daysSince(p.updatedAt) * 3,
      });
    }

    out.sort((a, b) => b.priority - a.priority);
    return NextResponse.json({ actions: out.slice(0, 30) });
  } catch (error) {
    console.error("Next-actions error:", error);
    return NextResponse.json({ error: "Failed to derive actions" }, { status: 500 });
  }
}
