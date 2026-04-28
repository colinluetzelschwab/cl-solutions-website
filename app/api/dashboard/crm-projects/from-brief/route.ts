import { NextRequest, NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { crmCreate } from "@/app/jarvis/lib/crm-store";
import type { CrmProject } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * POST { briefId } → CrmProject
 * Reads the brief blob, prefills a project with client name, package,
 * hosting plan, leadId back-link, and seeds open tasks based on the
 * brief's pages/features. Idempotent at the brief level only by client
 * (i.e. you can promote the same brief twice — caller decides).
 */
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { briefId } = await request.json();
    if (!briefId) return NextResponse.json({ error: "briefId required" }, { status: 400 });

    // Locate the brief blob.
    const briefPath = `briefs/${briefId}.json`;
    const { blobs } = await list({ prefix: briefPath, limit: 1 });
    const briefBlob = blobs.find(b => b.pathname === briefPath);
    if (!briefBlob) return NextResponse.json({ error: "Brief not found" }, { status: 404 });

    const briefRes = await fetch(briefBlob.url, { cache: "no-store" });
    if (!briefRes.ok) return NextResponse.json({ error: "Failed to read brief" }, { status: 500 });
    const brief = await briefRes.json();

    // Seed open tasks from selected pages + features.
    const pageTasks = (brief.pagesFeatures?.pages ?? []).map((p: string, i: number) => ({
      id: `task_page_${i}`,
      text: `Build page: ${p}`,
      done: false,
    }));
    const featureTasks = (brief.pagesFeatures?.features ?? []).map((f: string, i: number) => ({
      id: `task_feat_${i}`,
      text: `Implement: ${f}`,
      done: false,
    }));

    const partial: Omit<CrmProject, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      client: brief.businessInfo?.name ?? "Unknown",
      leadId: brief.leadId || undefined,
      briefId,
      packageId: brief.package?.selectedPackage ?? "custom",
      startDate: new Date().toISOString(),
      status: "briefing",
      hostingPlan: brief.package?.hostingPlan || undefined,
      openTasks: [...pageTasks, ...featureTasks],
    };

    const project = await crmCreate("crm-projects", { ...partial, createdBy: "system" });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("CrmProject from-brief error:", error);
    return NextResponse.json({ error: "Failed to promote brief" }, { status: 500 });
  }
}
