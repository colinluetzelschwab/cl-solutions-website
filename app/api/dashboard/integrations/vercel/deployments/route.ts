import { NextRequest, NextResponse } from "next/server";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET /api/dashboard/integrations/vercel/deployments
 *
 * Pulls the last 20 deployments across the Vercel account (any project).
 * Used by the OPS surface for live deploy status.
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) {
    return NextResponse.json({ deployments: [], status: "missing-token" });
  }
  try {
    const res = await fetch("https://api.vercel.com/v6/deployments?limit=20", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ deployments: [], status: "error", detail: `${res.status} ${res.statusText}` });
    }
    const data = await res.json();
    type Deployment = { uid?: string; url?: string; name?: string; state?: string; readyState?: string; created?: number; meta?: { githubCommitRef?: string; gitBranch?: string } };
    const deployments = (data.deployments ?? []).map((d: Deployment) => ({
      id: d.uid,
      project: d.name,
      url: d.url ? `https://${d.url}` : null,
      state: d.state ?? d.readyState,
      createdAt: d.created ? new Date(d.created).toISOString() : undefined,
      branch: d.meta?.githubCommitRef ?? d.meta?.gitBranch ?? null,
    }));
    return NextResponse.json({ deployments, status: "ok" });
  } catch (e) {
    return NextResponse.json({ deployments: [], status: "error", detail: e instanceof Error ? e.message : String(e) });
  }
}
