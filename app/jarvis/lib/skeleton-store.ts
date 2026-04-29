/**
 * Skeleton store — Brief→Skeleton agent output.
 *
 * Storage: crm/skeletons/{briefId}.json in Vercel Blob.
 * One skeleton per brief — re-running the agent overwrites.
 *
 * The skeleton is a structured plan describing what to build for a client
 * project: page list, sections per page, palette, fonts, copy outline,
 * technical considerations. Used as input to Claude Code (or a human) to
 * bootstrap the actual Next.js project.
 */
import { put, list } from "@vercel/blob";

export interface SkeletonSection {
  /** Section kind, e.g. "hero", "services", "team", "testimonials", "contact". */
  kind: string;
  /** 1-3 sentence outline of intent and copy direction. Not finished copy. */
  copyOutline: string;
}

export interface SkeletonPage {
  slug: string;
  label: string;
  purpose: string;
  sections: SkeletonSection[];
}

export interface SkeletonDesignDirection {
  palette: { primary: string; secondary?: string; accent?: string };
  fontFamily: string;
  moodKeywords: string[];
}

export interface Skeleton {
  briefId: string;
  leadId?: string;
  generatedAt: string;
  /** Tech stack pinned by agency conventions; agent doesn't deviate. */
  recommendedStack: {
    framework: "next-14";
    styling: "tailwind-v4";
    cms: "none";
    deployment: "vercel";
  };
  pages: SkeletonPage[];
  designDirection: SkeletonDesignDirection;
  contentNotes: string[];
  technicalConsiderations: string[];
}

const SKELETON_PREFIX = "crm/skeletons/";

export async function putSkeleton(skeleton: Skeleton): Promise<string> {
  const path = `${SKELETON_PREFIX}${skeleton.briefId}.json`;
  const blob = await put(path, JSON.stringify(skeleton, null, 2), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function listSkeletons(): Promise<string[]> {
  const { blobs } = await list({ prefix: SKELETON_PREFIX });
  return blobs.map((b) => b.pathname);
}
