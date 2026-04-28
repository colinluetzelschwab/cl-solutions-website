import { NextRequest, NextResponse } from "next/server";
import { crmList, crmCreate } from "@/app/jarvis/lib/crm-store";
import type { CostEntry, CostCategory } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

const VALID_CATEGORIES: CostCategory[] = [
  "vercel", "claude_openai", "sanity", "resend", "domains", "hetzner", "tools", "other",
];

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const month = request.nextUrl.searchParams.get("month");
    const all = await crmList("costs");
    const filtered = month ? all.filter(c => c.month === month) : all;
    filtered.sort((a, b) => {
      // Sort by month descending, then updatedAt descending
      if (a.month !== b.month) return b.month.localeCompare(a.month);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return NextResponse.json({ costs: filtered });
  } catch (error) {
    console.error("Cost list error:", error);
    return NextResponse.json({ error: "Failed to list costs" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const amount = Number(body.amount);
    const month = String(body.month ?? "").trim();
    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json({ error: "amount must be non-negative" }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "month must be YYYY-MM" }, { status: 400 });
    }
    const category: CostCategory = VALID_CATEGORIES.includes(body.category) ? body.category : "other";

    const partial: Omit<CostEntry, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      category,
      amount,
      month,
      note: body.note || undefined,
    };

    const cost = await crmCreate("costs", partial);
    return NextResponse.json({ cost }, { status: 201 });
  } catch (error) {
    console.error("Cost create error:", error);
    return NextResponse.json({ error: "Failed to create cost" }, { status: 500 });
  }
}
