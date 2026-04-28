import { NextRequest, NextResponse } from "next/server";
import { inboxList, inboxAppend, inboxMarkRead, inboxMarkHandled, inboxMarkAllRead } from "@/app/jarvis/lib/inbox-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET  /api/dashboard/inbox          → InboxEvent[] (newest first, capped 500)
 * POST /api/dashboard/inbox          → append a new event (internal use)
 * PATCH /api/dashboard/inbox?id=X    → mark read (default) | mark handled | mark all read
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const events = await inboxList();
    const unread = events.filter(e => !e.readAt).length;
    return NextResponse.json({ events, unread });
  } catch (error) {
    console.error("Inbox list error:", error);
    return NextResponse.json({ error: "Failed to list inbox" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.kind || !body.source || !body.title) {
      return NextResponse.json({ error: "kind/source/title required" }, { status: 400 });
    }
    const event = await inboxAppend(body);
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Inbox append error:", error);
    return NextResponse.json({ error: "Failed to append event" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const body = await request.json().catch(() => ({}));
    const op = body.op ?? "read";

    if (op === "all-read") {
      const count = await inboxMarkAllRead();
      return NextResponse.json({ ok: true, marked: count });
    }
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const ok = op === "handled"
      ? await inboxMarkHandled(id)
      : await inboxMarkRead(id);
    if (!ok) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Inbox patch error:", error);
    return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
  }
}
