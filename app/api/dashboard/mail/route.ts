import { NextRequest, NextResponse } from "next/server";
import { mailIsConfigured, mailListFolders, mailListMessages } from "@/app/jarvis/lib/mail";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET /api/dashboard/mail?folder=INBOX&limit=50
 * → { configured: bool, folders?: [...], messages?: [...] }
 *
 * Lists recent messages from the chosen folder. Defaults to INBOX.
 * If IMAP is not configured, returns { configured: false } so the UI
 * can show a setup prompt instead of erroring.
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!(await mailIsConfigured())) {
    return NextResponse.json({ configured: false });
  }
  const url = new URL(request.url);
  const folder = url.searchParams.get("folder") ?? "INBOX";
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);
  const includeFolders = url.searchParams.get("folders") === "1";

  try {
    const [messages, folders] = await Promise.all([
      mailListMessages(folder, limit),
      includeFolders ? mailListFolders() : Promise.resolve(undefined),
    ]);
    return NextResponse.json({ configured: true, folder, messages, folders });
  } catch (e) {
    return NextResponse.json({
      configured: true,
      error: e instanceof Error ? e.message : "Mail list failed",
    }, { status: 502 });
  }
}
