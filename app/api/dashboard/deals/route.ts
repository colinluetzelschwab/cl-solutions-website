import { NextRequest, NextResponse } from "next/server";
import { list as blobList } from "@vercel/blob";
import { crmList, crmGet } from "@/app/jarvis/lib/crm-store";
import { projectDeals } from "@/app/jarvis/lib/deals";
import type { BriefSummary } from "@/app/jarvis/lib/types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * Read all brief blobs from `briefs/*.json`. Merges `briefs/{id}.status.json`
 * sidecars so we know which briefs already shipped (`built`) vs are still
 * actionable (`new` / `in_progress`). Mirrors the logic in
 * `app/api/dashboard/briefs/route.ts:GET` so brief-origin deals get the same
 * status the briefs surface uses.
 */
async function listBriefs(): Promise<BriefSummary[]> {
  try {
    const { blobs } = await blobList({ prefix: "briefs/" });

    // Build the sidecar status map first so the brief loop can attach status.
    const statusMap = new Map<string, string>();
    for (const blob of blobs) {
      if (!blob.pathname.endsWith(".status.json")) continue;
      try {
        const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) continue;
        const sidecar = await res.json();
        if (sidecar?.briefId && sidecar?.status) {
          statusMap.set(String(sidecar.briefId), String(sidecar.status));
        }
      } catch { /* skip malformed sidecar */ }
    }

    const summaries: BriefSummary[] = [];
    for (const blob of blobs) {
      if (!blob.pathname.endsWith(".json")) continue;
      if (blob.pathname.endsWith(".status.json")) continue;
      try {
        const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        const briefId = data.id ?? blob.pathname.replace(/^briefs\//, "").replace(/\.json$/, "");
        summaries.push({
          id: briefId,
          // Public form writes `businessInfo.name` (NOT `businessName`).
          clientName: data.businessInfo?.name ?? "—",
          email: data.businessInfo?.email ?? "",
          packageId: data.package?.selectedPackage ?? data.package?.id ?? "starter",
          totalPrice: data.totalPrice ?? data.package?.totalPrice ?? 0,
          createdAt: data.createdAt ?? blob.uploadedAt.toString(),
          couponUsed: !!data.package?.couponValid || !!data.coupon?.code,
          blobUrl: blob.url,
          status: statusMap.get(briefId) ?? data.status ?? "new",
        });
      } catch { /* skip malformed */ }
    }
    return summaries;
  } catch {
    return [];
  }
}

/**
 * GET /api/dashboard/deals
 *
 * Returns a unified Deal projection from Lead + Brief + Offer + CrmProject
 * collections. Pure read-only — no writes to a `deals/` collection.
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Pull index entries for all 4 collections (cheap).
    const [leadsIdx, offersIdx, projectsIdx, briefs] = await Promise.all([
      crmList("leads"),
      crmList("offers"),
      crmList("crm-projects"),
      listBriefs(),
    ]);

    // For projection precedence + brief→lead linkage we need a small slice of full leads + projects.
    // (Index entries don't include FKs; full records do.)
    const fullLeads = await Promise.all(
      leadsIdx.map(async l => {
        const full = await crmGet("leads", l.id);
        return full ? { id: full.id, businessName: full.businessName, briefId: full.briefId } : null;
      }),
    );
    const projectsLinks = await Promise.all(
      projectsIdx.map(async p => {
        const full = await crmGet("crm-projects", p.id);
        return full ? { id: full.id, leadId: full.leadId, briefId: full.briefId, offerId: full.offerId } : null;
      }),
    );

    // Exclude briefs whose project already shipped — the deals surface is for
    // active pipeline, not done-and-delivered work. Built briefs without a
    // matching CrmProject record were cluttering the view as empty rows.
    // Keep `new` / `in_progress` (or any unknown status) so genuinely new
    // briefs still surface as prospects.
    const TERMINAL_BRIEF_STATUSES = new Set(["built", "live", "delivered"]);
    const activeBriefs = briefs.filter(b => !TERMINAL_BRIEF_STATUSES.has(b.status ?? "new"));

    const list = projectDeals({
      leads: leadsIdx,
      briefs: activeBriefs,
      offers: offersIdx,
      projects: projectsIdx,
      fullLeads: fullLeads.filter(Boolean) as Array<{ id: string; businessName: string; briefId?: string }>,
      projectsLinks: projectsLinks.filter(Boolean) as Array<{ id: string; leadId?: string; briefId?: string; offerId?: string }>,
    });

    return NextResponse.json(list);
  } catch (error) {
    console.error("Deals projection error:", error);
    return NextResponse.json({ error: "Failed to build deals projection" }, { status: 500 });
  }
}
