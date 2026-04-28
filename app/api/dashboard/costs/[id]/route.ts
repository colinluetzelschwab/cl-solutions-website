import { NextRequest, NextResponse } from "next/server";
import { crmUpdate, crmDelete } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/costs/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const patch = await request.json();
    delete patch.id;
    delete patch.createdAt;
    delete patch.createdBy;
    const updated = await crmUpdate("costs", id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ cost: updated });
  } catch (error) {
    console.error("Cost patch error:", error);
    return NextResponse.json({ error: "Failed to update cost" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/costs/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const ok = await crmDelete("costs", id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cost delete error:", error);
    return NextResponse.json({ error: "Failed to delete cost" }, { status: 500 });
  }
}
