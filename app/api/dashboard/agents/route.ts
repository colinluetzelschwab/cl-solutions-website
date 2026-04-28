import { NextRequest, NextResponse } from "next/server";
import { AGENTS } from "@/app/jarvis/lib/agent-types";
import { agentRunsList } from "@/app/jarvis/lib/inbox-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET /api/dashboard/agents
 * Returns the agent catalogue + recent run history (last 50).
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const runs = await agentRunsList();
    return NextResponse.json({ agents: AGENTS, runs: runs.slice(0, 50) });
  } catch (error) {
    console.error("Agents list error:", error);
    return NextResponse.json({ error: "Failed to list agents" }, { status: 500 });
  }
}
