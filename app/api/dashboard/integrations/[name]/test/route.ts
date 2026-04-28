import { NextRequest, NextResponse } from "next/server";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * GET /api/dashboard/integrations/{name}/test
 *
 * Tests an integration's credentials + reachability without persisting any
 * state. Each integration probes a low-cost read-only endpoint.
 *
 * Returns:
 *   { ok: true,  status: "connected" | "missing-token" | "error", detail?, latency }
 *
 * Used by the Connections panel + ⌘K test commands.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { name } = await params;
  const t0 = Date.now();
  try {
    const result = await testIntegration(name);
    return NextResponse.json({ ...result, latency: Date.now() - t0 });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      detail: error instanceof Error ? error.message : String(error),
      latency: Date.now() - t0,
    }, { status: 200 }); // 200 — the test ran, just failed
  }
}

type TestResult = { status: "connected" | "missing-token" | "error"; detail?: string };

async function testIntegration(name: string): Promise<TestResult> {
  switch (name) {
    case "vercel":     return testVercel();
    case "github":     return testGithub();
    case "stripe":     return testStripe();
    case "resend":     return testResend();
    case "anthropic":  return testAnthropic();
    case "higgsfield": return testHiggsfield();
    case "checkvibe":  return testCheckvibe();
    case "vps":        return testVps();
    default:
      return { status: "error", detail: `Unknown integration: ${name}` };
  }
}

async function testVercel(): Promise<TestResult> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) return { status: "missing-token", detail: "VERCEL_API_TOKEN not set in env" };
  try {
    const res = await fetch("https://api.vercel.com/v2/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { status: "error", detail: `${res.status} ${res.statusText}` };
    const data = await res.json();
    return { status: "connected", detail: `User: ${data.user?.username ?? data.user?.email ?? "ok"}` };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

async function testGithub(): Promise<TestResult> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return { status: "missing-token", detail: "GITHUB_TOKEN not set in env" };
  try {
    const res = await fetch("https://api.github.com/user", {
      headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return { status: "error", detail: `${res.status} ${res.statusText}` };
    const data = await res.json();
    return { status: "connected", detail: `User: ${data.login}` };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

async function testStripe(): Promise<TestResult> {
  const key = process.env.STRIPE_API_KEY;
  if (!key) return { status: "missing-token", detail: "STRIPE_API_KEY not set in env" };
  try {
    // /v1/balance is the cheapest authenticated probe.
    const res = await fetch("https://api.stripe.com/v1/balance", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { status: "error", detail: `${res.status} ${res.statusText}` };
    return { status: "connected", detail: `Live mode: ${key.startsWith("sk_live_") ? "yes" : "no"}` };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

async function testResend(): Promise<TestResult> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { status: "missing-token", detail: "RESEND_API_KEY not set in env" };
  try {
    // /domains list is read-only and cheap.
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { status: "error", detail: `${res.status} ${res.statusText}` };
    const data = await res.json();
    const verified = (data.data ?? []).filter((d: { status?: string }) => d.status === "verified").length;
    return { status: "connected", detail: `Verified domains: ${verified}` };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

async function testAnthropic(): Promise<TestResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { status: "missing-token", detail: "ANTHROPIC_API_KEY not set in env" };
  try {
    // Cheapest probe: 1-token Haiku call.
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1,
        messages: [{ role: "user", content: "1" }],
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return { status: "error", detail: `${res.status} ${text.slice(0, 200)}` };
    }
    return { status: "connected", detail: "Haiku 4.5 responded" };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

async function testHiggsfield(): Promise<TestResult> {
  const key = process.env.HIGGSFIELD_API_KEY;
  const secret = process.env.HIGGSFIELD_API_SECRET;
  if (!key || !secret) return { status: "missing-token", detail: "HIGGSFIELD_API_KEY/SECRET not set" };
  // Higgsfield doesn't have a free /ping endpoint; verify keys are present.
  return { status: "connected", detail: "Keys present (no probe endpoint)" };
}

async function testCheckvibe(): Promise<TestResult> {
  const key = process.env.CHECKVIBE_API_KEY;
  if (!key) return { status: "missing-token", detail: "CHECKVIBE_API_KEY not set in env" };
  try {
    const res = await fetch("https://checkvibe.dev/api/projects", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return { status: "error", detail: `${res.status} ${res.statusText}` };
    const data = await res.json().catch(() => ({}));
    const count = Array.isArray(data?.projects) ? data.projects.length : Array.isArray(data) ? data.length : "?";
    return { status: "connected", detail: `Projects: ${count}` };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

async function testVps(): Promise<TestResult> {
  // Reuse the existing health probe.
  try {
    const base = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
    const res = await fetch(`${base}/api/dashboard/vps`, { cache: "no-store" });
    if (!res.ok) return { status: "error", detail: `${res.status} ${res.statusText}` };
    const data = await res.json();
    return data.status === "online"
      ? { status: "connected", detail: `Uptime: ${Math.round(data.uptime ?? 0)}s` }
      : { status: "error", detail: data.error ?? "VPS offline" };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}
