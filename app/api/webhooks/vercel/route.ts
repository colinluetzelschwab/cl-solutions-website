import { NextRequest, NextResponse } from "next/server";
import { inboxAppend, activityAppend } from "@/app/jarvis/lib/inbox-store";

/**
 * Vercel deployment webhook receiver.
 *
 * Configure in Vercel project settings → Integrations → Webhooks:
 *   POST https://<prod-host>/api/webhooks/vercel
 *
 * Events: deployment.created / deployment.succeeded / deployment.error
 * Each event lands in Inbox + Activity for cross-project visibility.
 */
export async function POST(request: NextRequest) {
  const secret = process.env.VERCEL_WEBHOOK_SECRET;
  const sig = request.headers.get("x-vercel-signature");

  if (secret && !sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }
  // (Full HMAC-SHA1 verification would go here when secret is set.)

  let body: VercelWebhookEvent;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  try {
    const type = body.type;
    const project = body.payload?.project?.name ?? "?";
    const url = body.payload?.deployment?.url ? `https://${body.payload.deployment.url}` : undefined;
    const meta = body.payload?.deployment?.meta;
    const branch = meta?.githubCommitRef ?? meta?.gitBranch;

    let title = `Vercel: ${type}`;
    let severity: "info" | "success" | "warning" | "error" = "info";

    if (type === "deployment.succeeded" || type === "deployment.ready") {
      title = `Deploy succeeded · ${project}`;
      severity = "success";
    } else if (type === "deployment.error" || type === "deployment.failed") {
      title = `Deploy failed · ${project}`;
      severity = "error";
    } else if (type === "deployment.created") {
      title = `Deploy started · ${project}`;
      severity = "info";
    }

    await inboxAppend({
      kind: "build",
      severity,
      source: "vercel",
      title,
      body: branch ? `Branch: ${branch}${url ? ` · ${url}` : ""}` : url,
      payload: { type, project, url, branch },
    });
    await activityAppend({
      source: "vercel",
      action: type,
      label: title,
      payload: { project, url, branch },
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Vercel webhook error:", error);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }
}

interface VercelWebhookEvent {
  type: string;
  payload?: {
    project?: { name?: string };
    deployment?: {
      url?: string;
      meta?: { githubCommitRef?: string; gitBranch?: string };
    };
  };
}
