import { NextRequest, NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET /api/dashboard/integrations/github/status?repo=name
 *
 * Returns the open PR count + most recent commit + CI status for the
 * authenticated user's repo. Used per-Deal in the Build facet.
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return NextResponse.json({ status: "missing-token" });
  }
  const url = new URL(request.url);
  const repo = url.searchParams.get("repo");
  const owner = url.searchParams.get("owner") ?? "colinluetzelschwab";
  if (!repo) return NextResponse.json({ error: "repo required" }, { status: 400 });

  try {
    const gh = new Octokit({ auth: token });
    const [{ data: prs }, { data: commits }] = await Promise.all([
      gh.pulls.list({ owner, repo, state: "open", per_page: 100 }),
      gh.repos.listCommits({ owner, repo, per_page: 1 }),
    ]);

    const lastCommit = commits[0];
    let ciStatus: "success" | "failure" | "pending" | "unknown" = "unknown";
    if (lastCommit) {
      try {
        const { data: status } = await gh.repos.getCombinedStatusForRef({ owner, repo, ref: lastCommit.sha });
        ciStatus = status.state === "success" ? "success" : status.state === "failure" ? "failure" : status.state === "pending" ? "pending" : "unknown";
      } catch { /* no checks configured */ }
    }

    return NextResponse.json({
      status: "ok",
      openPrs: prs.length,
      lastCommit: lastCommit ? {
        sha: lastCommit.sha.slice(0, 7),
        message: lastCommit.commit.message.split("\n")[0],
        author: lastCommit.commit.author?.name ?? "?",
        date: lastCommit.commit.author?.date,
      } : null,
      ciStatus,
    });
  } catch (e) {
    return NextResponse.json({ status: "error", detail: e instanceof Error ? e.message : String(e) });
  }
}
