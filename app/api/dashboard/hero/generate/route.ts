/**
 * Hero image generation via Higgsfield.
 *
 * Auth: dashboard cookie.
 * Body: { prompt: string, ratio?: "16:9" | "9:16" | "1:1" | "4:3", style?: string }
 *
 * Calls Higgsfield Cloud API. Higgsfield doesn't publish a fully stable
 * public REST contract, so the endpoint and field names are read from env
 * with sensible defaults. If the call returns 4xx/5xx, the response body
 * is forwarded to the client so the user can adjust env or payload.
 *
 * Env (production must have HIGGSFIELD_API_KEY at minimum):
 *   HIGGSFIELD_API_KEY        — Bearer token (required)
 *   HIGGSFIELD_API_SECRET     — paired secret (some accounts require X-Api-Secret header)
 *   HIGGSFIELD_BASE_URL       — default "https://cloud.higgsfield.ai"
 *   HIGGSFIELD_GENERATE_PATH  — default "/v1/generations"
 *   HIGGSFIELD_DEFAULT_MODEL  — default "soul" (Higgsfield's image model line)
 */

import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { activityAppend } from "@/app/jarvis/lib/inbox-store";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

interface GenerateBody {
  prompt: string;
  ratio?: "16:9" | "9:16" | "1:1" | "4:3";
  style?: string;
  /** Optional: persist the resulting image to our own Blob so we don't depend on Higgsfield URLs long-term. */
  persistToBlob?: boolean;
}

interface HiggsfieldResponse {
  id?: string;
  status?: string;
  url?: string;
  output?: { url?: string }[];
  result?: { url?: string };
  error?: string | { message?: string };
}

const DEFAULT_BASE = "https://cloud.higgsfield.ai";
const DEFAULT_PATH = "/v1/generations";
const DEFAULT_MODEL = "soul";

function extractImageUrl(payload: HiggsfieldResponse): string | null {
  if (payload.url) return payload.url;
  if (payload.output?.[0]?.url) return payload.output[0].url;
  if (payload.result?.url) return payload.result.url;
  return null;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.HIGGSFIELD_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "HIGGSFIELD_API_KEY not set" }, { status: 503 });
  }

  let body: GenerateBody;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt || typeof body.prompt !== "string") {
    return NextResponse.json({ error: "prompt is required" }, { status: 400 });
  }

  const baseUrl = process.env.HIGGSFIELD_BASE_URL || DEFAULT_BASE;
  const generatePath = process.env.HIGGSFIELD_GENERATE_PATH || DEFAULT_PATH;
  const model = process.env.HIGGSFIELD_DEFAULT_MODEL || DEFAULT_MODEL;

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
  if (process.env.HIGGSFIELD_API_SECRET) {
    headers["X-Api-Secret"] = process.env.HIGGSFIELD_API_SECRET;
  }

  const upstreamPayload = {
    model,
    task: "text-to-image",
    prompt: body.prompt,
    ratio: body.ratio ?? "16:9",
    style: body.style,
  };

  const startedAt = Date.now();
  let upstream: Response;
  try {
    upstream = await fetch(`${baseUrl}${generatePath}`, {
      method: "POST",
      headers,
      body: JSON.stringify(upstreamPayload),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Higgsfield request failed (network)",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  const latencyMs = Date.now() - startedAt;
  const text = await upstream.text();
  let parsed: HiggsfieldResponse;
  try {
    parsed = text ? (JSON.parse(text) as HiggsfieldResponse) : {};
  } catch {
    parsed = {};
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: `Higgsfield ${upstream.status}`,
        latencyMs,
        upstream: parsed,
        rawBody: parsed && Object.keys(parsed).length === 0 ? text.slice(0, 500) : undefined,
      },
      { status: upstream.status },
    );
  }

  const imageUrl = extractImageUrl(parsed);
  if (!imageUrl) {
    return NextResponse.json(
      {
        error: "Higgsfield response did not include an image URL",
        upstream: parsed,
        latencyMs,
      },
      { status: 502 },
    );
  }

  let finalUrl = imageUrl;
  let blobPath: string | undefined;

  if (body.persistToBlob) {
    try {
      const imgRes = await fetch(imageUrl);
      if (imgRes.ok) {
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        const ext = imageUrl.match(/\.(png|jpg|jpeg|webp)(\?|$)/i)?.[1] ?? "png";
        const fileName = `hero-${parsed.id ?? Date.now()}.${ext.toLowerCase()}`;
        const path = `crm/heroes/${fileName}`;
        const stored = await put(path, buffer, {
          access: "public",
          contentType: imgRes.headers.get("content-type") ?? `image/${ext}`,
          addRandomSuffix: false,
          allowOverwrite: true,
        });
        finalUrl = stored.url;
        blobPath = path;
      }
    } catch {
      // Persist is best-effort — if it fails, fall back to Higgsfield's URL.
    }
  }

  await activityAppend({
    source: "higgsfield",
    action: "hero.generate",
    label: `Hero image generated · ${body.ratio ?? "16:9"} · ${latencyMs}ms`,
    payload: {
      prompt: body.prompt.slice(0, 200),
      ratio: body.ratio ?? "16:9",
      style: body.style,
      generationId: parsed.id,
      url: finalUrl,
      blobPath,
      latencyMs,
    },
  });

  return NextResponse.json({
    url: finalUrl,
    generationId: parsed.id,
    persisted: !!blobPath,
    latencyMs,
  });
}
