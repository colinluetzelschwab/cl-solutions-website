import { NextRequest, NextResponse } from "next/server";
import { crmGet, crmUpdate, crmDelete } from "@/app/jarvis/lib/crm-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/mockups/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const mockup = await crmGet("mockups", id);
    if (!mockup) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ mockup });
  } catch (error) {
    console.error("Mockup get error:", error);
    return NextResponse.json({ error: "Failed to get mockup" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/mockups/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const patch = await request.json();
    delete patch.id;
    delete patch.createdAt;
    delete patch.createdBy;
    const updated = await crmUpdate("mockups", id, patch);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ mockup: updated });
  } catch (error) {
    console.error("Mockup patch error:", error);
    return NextResponse.json({ error: "Failed to update mockup" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  ctx: RouteContext<"/api/dashboard/mockups/[id]">,
) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await ctx.params;
    const ok = await crmDelete("mockups", id);
    if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mockup delete error:", error);
    return NextResponse.json({ error: "Failed to delete mockup" }, { status: 500 });
  }
}
