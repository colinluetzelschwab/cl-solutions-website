import { NextRequest, NextResponse } from "next/server";
import { crmGet, crmUpdate, crmDelete } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/offers/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const offer = await crmGet("offers", id);
    if (!offer) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ offer });
  } catch (error) {
    console.error("Offer get error:", error);
    return NextResponse.json({ error: "Failed to get offer" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/offers/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const patch = await request.json();
    delete patch.id;
    delete patch.createdAt;
    delete patch.createdBy;
    delete patch.offerNumber; // immutable

    // Auto-stamp transition timestamps
    if (patch.invoiceSent && !patch.invoiceSentAt) patch.invoiceSentAt = new Date().toISOString();
    if (patch.paid && !patch.paidAt) {
      patch.paidAt = new Date().toISOString();
      patch.outstanding = 0;
    }

    const updated = await crmUpdate("offers", id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ offer: updated });
  } catch (error) {
    console.error("Offer patch error:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/offers/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const ok = await crmDelete("offers", id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer delete error:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
