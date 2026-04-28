import { NextRequest, NextResponse } from "next/server";
import { mailGet } from "@/app/jarvis/lib/mail";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET /api/dashboard/mail/{uid}?folder=INBOX
 * Fetches the full body of a single message + marks it as read.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ uid: string }> },
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { uid } = await params;
  const uidNum = Number(uid);
  if (!Number.isFinite(uidNum) || uidNum <= 0) {
    return NextResponse.json({ error: "Invalid UID" }, { status: 400 });
  }
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "INBOX";
  try {
    const msg = await mailGet(folder, uidNum);
    if (!msg) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ message: msg });
  } catch (e) {
    return NextResponse.json({
      error: e instanceof Error ? e.message : "Mail fetch failed",
    }, { status: 502 });
  }
}
