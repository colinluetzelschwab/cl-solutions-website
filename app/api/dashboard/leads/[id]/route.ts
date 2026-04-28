import { NextRequest, NextResponse } from "next/server";
import { crmGet, crmUpdate, crmDelete } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/leads/[id]">,
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const lead = await crmGet("leads", id);
    if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Lead get error:", error);
    return NextResponse.json({ error: "Failed to get lead" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/leads/[id]">,
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const patch = await request.json();
    // Strip identity / audit fields the client must not control
    delete patch.id;
    delete patch.createdAt;
    delete patch.createdBy;
    const updated = await crmUpdate("leads", id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ lead: updated });
  } catch (error) {
    console.error("Lead patch error:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/leads/[id]">,
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const ok = await crmDelete("leads", id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead delete error:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
