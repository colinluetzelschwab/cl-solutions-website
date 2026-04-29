/**
 * Hero image generation via fal.ai.
 *
 * Auth: dashboard cookie.
 * Body: { prompt: string, ratio?: "16:9" | "9:16" | "1:1" | "4:3", style?: string, persistToBlob?: boolean }
 *
 * Calls fal.ai's synchronous REST endpoint (`https://fal.run/{model}`) with
 * `Authorization: Key {FAL_KEY}`. Default model is FLUX.2 Pro — best
 * quality/latency for hero imagery as of 2026. Override per-request via
 * `model` body field, or globally via `FAL_DEFAULT_MODEL` env.
 *
 * fal.ai response shape is consistent: `{ images: [{ url, width, height, content_type }], seed, timings, ... }`.
 *
 * Env (production must have FAL_KEY at minimum):
 *   FAL_KEY              — fal.ai API key (required, see https://fal.ai/dashboard/keys)
 *   FAL_DEFAULT_MODEL    — default "fal-ai/flux-2-pro"
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
  /** Optional override for fal model slug (e.g. "fal-ai/flux-2-pro", "fal-ai/recraft-v3"). */
  model?: string;
  /** Persist the generated image into our own Vercel Blob so we don't depend on fal URLs long-term. */
  persistToBlob?: boolean;
}

interface FalImage {
  url: string;
  width?: number;
  height?: number;
  content_type?: string;
}

interface FalResponse {
  images?: FalImage[];
  seed?: number;
  timings?: { inference?: number };
  has_nsfw_concepts?: boolean[];
  prompt?: string;
  detail?: string | { msg?: string };
}

const DEFAULT_MODEL = "fal-ai/flux-2-pro";

function ratioToImageSize(ratio: GenerateBody["ratio"]): string {
  switch (ratio) {
    case "9:16": return "portrait_16_9";
    case "1:1":  return "square_hd";
    case "4:3":  return "landscape_4_3";
    case "16:9":
    default:     return "landscape_16_9";
  }
}

function buildPrompt(prompt: string, style?: string): string {
  const trimmedStyle = style?.trim();
  if (!trimmedStyle) return prompt;
  // FLUX doesn't have a separate `style` field — append as a suffix in the prompt.
  return `${prompt}. Style: ${trimmedStyle}`;
}

function extractImageUrl(payload: FalResponse): string | null {
  return payload.images?.[0]?.url ?? null;
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.FAL_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "FAL_KEY not set" }, { status: 503 });
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

  const model = body.model || process.env.FAL_DEFAULT_MODEL || DEFAULT_MODEL;
  const imageSize = ratioToImageSize(body.ratio);
  const fullPrompt = buildPrompt(body.prompt, body.style);

  const upstreamPayload = {
    prompt: fullPrompt,
    image_size: imageSize,
    num_images: 1,
    enable_safety_checker: true,
  };

  const startedAt = Date.now();
  let upstream: Response;
  try {
    upstream = await fetch(`https://fal.run/${model}`, {
      method: "POST",
      headers: {
        Authorization: `Key ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(upstreamPayload),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "fal.ai request failed (network)",
        detail: error instanceof Error ? error.message : String(error),
      },
      { status: 502 },
    );
  }

  const latencyMs = Date.now() - startedAt;
  const text = await upstream.text();
  let parsed: FalResponse;
  try {
    parsed = text ? (JSON.parse(text) as FalResponse) : {};
  } catch {
    parsed = {};
  }

  if (!upstream.ok) {
    return NextResponse.json(
      {
        error: `fal.ai ${upstream.status}`,
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
        error: "fal.ai response did not include an image URL",
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
        const fileName = `hero-${parsed.seed ?? Date.now()}.${ext.toLowerCase()}`;
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
      // Persist is best-effort — if it fails, fall back to fal's URL.
    }
  }

  await activityAppend({
    source: "fal",
    action: "hero.generate",
    label: `Hero image generated · ${model} · ${body.ratio ?? "16:9"} · ${latencyMs}ms`,
    payload: {
      prompt: fullPrompt.slice(0, 200),
      model,
      ratio: body.ratio ?? "16:9",
      style: body.style,
      seed: parsed.seed,
      url: finalUrl,
      blobPath,
      latencyMs,
    },
  });

  return NextResponse.json({
    url: finalUrl,
    seed: parsed.seed,
    model,
    persisted: !!blobPath,
    latencyMs,
  });
}
