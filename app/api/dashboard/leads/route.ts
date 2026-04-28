import { NextRequest, NextResponse } from "next/server";
import { crmList, crmCreate } from "@/app/jarvis/lib/crm-store";
import type { Lead, LeadStatus, LeadSource } from "@/app/jarvis/lib/crm-types";
import { LEAD_STATUSES } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

const VALID_SOURCES: LeadSource[] = ["manual", "brief", "scraper", "referral"];

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await crmList("leads");
    leads.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Leads list error:", error);
    return NextResponse.json({ error: "Failed to list leads" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const businessName = String(body.businessName ?? "").trim();
    if (!businessName) {
      return NextResponse.json({ error: "businessName required" }, { status: 400 });
    }

    const status: LeadStatus = LEAD_STATUSES.includes(body.status) ? body.status : "found";
    const source: LeadSource = VALID_SOURCES.includes(body.source) ? body.source : "manual";
    const priority = (body.priority === 1 || body.priority === 2 || body.priority === 3) ? body.priority : 3;

    const partial: Omit<Lead, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      businessName,
      websiteUrl: body.websiteUrl || undefined,
      industry: body.industry || undefined,
      location: body.location || undefined,
      email: body.email || undefined,
      phone: body.phone || undefined,
      googleRating: typeof body.googleRating === "number" ? body.googleRating : undefined,
      websiteQualityScore: typeof body.websiteQualityScore === "number" ? body.websiteQualityScore : undefined,
      priority,
      status,
      notes: body.notes || undefined,
      source,
      briefId: body.briefId || undefined,
    };

    const lead = await crmCreate("leads", { ...partial, createdBy: source === "manual" ? "colin" : "system" });
    return NextResponse.json({ lead }, { status: 201 });
  } catch (error) {
    console.error("Lead create error:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
