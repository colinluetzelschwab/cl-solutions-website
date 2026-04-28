import { NextRequest, NextResponse } from "next/server";
import { crmGet, crmUpdate, crmDelete } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/crm-projects/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const project = await crmGet("crm-projects", id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project });
  } catch (error) {
    console.error("CrmProject get error:", error);
    return NextResponse.json({ error: "Failed to get project" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/crm-projects/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const patch = await request.json();
    delete patch.id;
    delete patch.createdAt;
    delete patch.createdBy;
    const updated = await crmUpdate("crm-projects", id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ project: updated });
  } catch (error) {
    console.error("CrmProject patch error:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/crm-projects/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const ok = await crmDelete("crm-projects", id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("CrmProject delete error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
