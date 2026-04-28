import { NextRequest, NextResponse } from "next/server";
import { activityList, activityAppend } from "@/app/jarvis/lib/inbox-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET  /api/dashboard/activity?limit=100  → ActivityItem[] (newest first)
 * POST /api/dashboard/activity            → append (internal use)
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 100), 500);
    const items = await activityList(limit);
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Activity list error:", error);
    return NextResponse.json({ error: "Failed to list activity" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.source || !body.action || !body.label) {
      return NextResponse.json({ error: "source/action/label required" }, { status: 400 });
    }
    const item = await activityAppend(body);
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    console.error("Activity append error:", error);
    return NextResponse.json({ error: "Failed to append activity" }, { status: 500 });
  }
}
