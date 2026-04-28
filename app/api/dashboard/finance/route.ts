import { NextRequest, NextResponse } from "next/server";
import { crmList, crmGet } from "@/app/jarvis/lib/crm-store";
import type { FinanceSummary } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET → FinanceSummary
 * Aggregation rules (MVP):
 * - revenueMonth: sum of paid offer amounts where paidAt is in current month
 * - revenueYtd: sum of paid offer amounts where paidAt is in current year
 * - outstanding: sum of (offer.outstanding) for offers where invoiceSent && !paid
 * - mrr: sum of monthly hosting plan revenue across active CRM projects
 *        (placeholder — assumes 0 until hosting fees are tracked separately)
 * - costsMonth: sum of cost entries for current month
 * - profitEstimate: revenueMonth - costsMonth
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const now = new Date();
    const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
    const year = now.getUTCFullYear();

    // We need full offer records (the index doesn't carry paidAt). Fetch them.
    const offerIdx = await crmList("offers");
    const offers = (await Promise.all(offerIdx.map(e => crmGet("offers", e.id)))).filter(Boolean);

    let revenueMonth = 0;
    let revenueYtd = 0;
    let outstanding = 0;
    for (const o of offers) {
      if (!o) continue;
      if (o.paid && o.paidAt) {
        const paid = new Date(o.paidAt);
        if (paid.getUTCFullYear() === year) {
          revenueYtd += o.amount;
          if (`${paid.getUTCFullYear()}-${String(paid.getUTCMonth() + 1).padStart(2, "0")}` === month) {
            revenueMonth += o.amount;
          }
        }
      } else if (o.invoiceSent && !o.paid) {
        outstanding += o.outstanding ?? o.amount;
      }
    }

    // Costs for current month
    const costIdx = await crmList("costs");
    const costsMonth = costIdx
      .filter(c => c.month === month)
      .reduce((sum, c) => sum + c.amount, 0);

    const summary: FinanceSummary = {
      revenueMonth,
      revenueYtd,
      outstanding,
      mrr: 0, // placeholder — real MRR needs per-plan hosting fees, deferred
      costsMonth,
      profitEstimate: revenueMonth - costsMonth,
      month,
    };

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Finance summary error:", error);
    return NextResponse.json({ error: "Failed to compute summary" }, { status: 500 });
  }
}
