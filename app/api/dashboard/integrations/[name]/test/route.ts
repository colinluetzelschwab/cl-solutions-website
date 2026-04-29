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
    case "fal":        return testFal();
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
  if (!key.startsWith("re_")) return { status: "error", detail: "Key does not look like a Resend key (expected re_…)" };
  try {
    // Try /domains first (full-scope keys). If 401, the key is likely a
    // restricted send-only key — verify by hitting POST /emails with an
    // intentionally bad body. Auth-valid keys return 422 (validation);
    // bad keys return 401.
    const dom = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${key}` },
    });
    if (dom.ok) {
      const data = await dom.json();
      const verified = (data.data ?? []).filter((d: { status?: string }) => d.status === "verified").length;
      return { status: "connected", detail: `Full-scope key · verified domains: ${verified}` };
    }
    if (dom.status === 401 || dom.status === 403) {
      // Probe send-scope with a deliberately malformed payload (no `to`).
      const probe = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (probe.status === 422 || probe.status === 400) {
        return { status: "connected", detail: "Restricted send-only key (auth ok, no domain read scope)" };
      }
      if (probe.status === 401 || probe.status === 403) {
        return { status: "error", detail: "Key rejected (bad or revoked)" };
      }
      return { status: "connected", detail: `Auth ok (probe returned ${probe.status})` };
    }
    return { status: "error", detail: `${dom.status} ${dom.statusText}` };
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

async function testFal(): Promise<TestResult> {
  const key = process.env.FAL_KEY;
  if (!key) return { status: "missing-token", detail: "FAL_KEY not set in env" };
  // fal.ai doesn't expose a public auth-only endpoint; do a 0-image cost-free
  // check by hitting the model schema endpoint, which validates the API key
  // without consuming credits.
  try {
    const model = process.env.FAL_DEFAULT_MODEL || "fal-ai/flux-2-pro";
    const res = await fetch(`https://fal.run/${model}/openapi.json`, {
      headers: { Authorization: `Key ${key}` },
    });
    if (res.status === 401 || res.status === 403) {
      return { status: "error", detail: `${res.status} — invalid FAL_KEY` };
    }
    if (!res.ok) {
      // Some routes return 405 / 404 for openapi probe but auth is fine — accept as connected.
      return { status: "connected", detail: `Auth ok (probe returned ${res.status})` };
    }
    return { status: "connected", detail: "FAL_KEY validated" };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
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
  // Probe the VPS health endpoint directly. Going through our internal
  // /api/dashboard/vps route would 401 because that route requires a
  // dashboard_auth cookie which server-to-server fetches can't carry.
  const vpsUrl = process.env.VPS_BUILD_URL || "http://46.225.88.110:3333";
  const token = process.env.VPS_BUILD_TOKEN;
  if (!token) return { status: "missing-token", detail: "VPS_BUILD_TOKEN not set in env" };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(`${vpsUrl}/health`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);
    if (!res.ok) return { status: "error", detail: `${res.status} ${res.statusText}` };
    const data = await res.json().catch(() => ({}));
    const uptime = typeof data.uptime === "number" ? data.uptime : 0;
    return { status: "connected", detail: `Uptime: ${Math.floor(uptime / 3600)}h${Math.floor((uptime % 3600) / 60)}m` };
  } catch (e) {
    return { status: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}
