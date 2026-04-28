import { NextRequest, NextResponse } from "next/server";
import { crmGet, crmUpdate, crmDelete } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/outreach/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const outreach = await crmGet("outreach", id);
    if (!outreach) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ outreach });
  } catch (error) {
    console.error("Outreach get error:", error);
    return NextResponse.json({ error: "Failed to get outreach" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/outreach/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const patch = await request.json();
    delete patch.id;
    delete patch.createdAt;
    delete patch.createdBy;
    const updated = await crmUpdate("outreach", id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ outreach: updated });
  } catch (error) {
    console.error("Outreach patch error:", error);
    return NextResponse.json({ error: "Failed to update outreach" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/outreach/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const ok = await crmDelete("outreach", id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Outreach delete error:", error);
    return NextResponse.json({ error: "Failed to delete outreach" }, { status: 500 });
  }
}
