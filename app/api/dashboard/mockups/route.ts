import { NextRequest, NextResponse } from "next/server";
import { crmList, crmGet, crmCreate } from "@/app/jarvis/lib/crm-store";
import type { Mockup, MockupStatus } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

const VALID_STATUS: MockupStatus[] = ["queued", "building", "ready", "failed"];

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const leadId = request.nextUrl.searchParams.get("leadId");
    const idx = await crmList("mockups");
    const filtered = leadId ? idx.filter(e => e.leadId === leadId) : idx;
    filtered.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    const records = await Promise.all(filtered.map(e => crmGet("mockups", e.id)));
    const mockups = records.filter((r): r is Mockup => r !== null);
    return NextResponse.json({ mockups });
  } catch (error) {
    console.error("Mockup list error:", error);
    return NextResponse.json({ error: "Failed to list mockups" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const leadId = String(body.leadId ?? "").trim();
    const url = String(body.url ?? "").trim();
    if (!leadId || !url) {
      return NextResponse.json({ error: "leadId and url required" }, { status: 400 });
    }

    const lead = await crmGet("leads", leadId);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

    const status: MockupStatus = VALID_STATUS.includes(body.status) ? body.status : "ready";

    const partial: Omit<Mockup, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      leadId,
      url,
      repo: body.repo || undefined,
      status,
      qualityRating: body.qualityRating || undefined,
      sent: !!body.sent,
      buildSlug: body.buildSlug || undefined,
    };

    const mockup = await crmCreate("mockups", { ...partial, createdBy: body.buildSlug ? "system" : "colin" });
    return NextResponse.json({ mockup }, { status: 201 });
  } catch (error) {
    console.error("Mockup create error:", error);
    return NextResponse.json({ error: "Failed to create mockup" }, { status: 500 });
  }
}
