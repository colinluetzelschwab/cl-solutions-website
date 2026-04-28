import { NextRequest, NextResponse } from "next/server";
import { crmList, crmCreate } from "@/app/jarvis/lib/crm-store";
import type { CrmProject, ProjectStatus } from "@/app/jarvis/lib/crm-types";
import { PROJECT_STATUSES } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const projects = await crmList("crm-projects");
    projects.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return NextResponse.json({ projects });
  } catch (error) {
    console.error("CrmProject list error:", error);
    return NextResponse.json({ error: "Failed to list projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const client = String(body.client ?? "").trim();
    if (!client) return NextResponse.json({ error: "client required" }, { status: 400 });

    const status: ProjectStatus = PROJECT_STATUSES.includes(body.status) ? body.status : "briefing";

    const partial: Omit<CrmProject, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      client,
      leadId: body.leadId || undefined,
      briefId: body.briefId || undefined,
      offerId: body.offerId || undefined,
      packageId: body.packageId || "custom",
      startDate: body.startDate ?? new Date().toISOString(),
      deliveryDate: body.deliveryDate || undefined,
      status,
      domain: body.domain || undefined,
      repo: body.repo || undefined,
      vercelUrl: body.vercelUrl || undefined,
      hostingPlan: body.hostingPlan || undefined,
      openTasks: Array.isArray(body.openTasks) ? body.openTasks : [],
    };

    const project = await crmCreate("crm-projects", { ...partial, createdBy: body.createdBy ?? "colin" });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("CrmProject create error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
