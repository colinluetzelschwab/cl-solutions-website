import { NextRequest, NextResponse } from "next/server";
import { list as blobList } from "@vercel/blob";
import { crmList, crmGet } from "@/app/jarvis/lib/crm-store";
import { projectDeals } from "@/app/jarvis/lib/deals";
import type { BriefSummary } from "@/app/jarvis/lib/types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

/**
 * Read all brief blobs from `briefs/*.json`.
 * (Copied from briefs/route.ts pattern; kept inline to avoid import surface.)
 */
async function listBriefs(): Promise<BriefSummary[]> {
  try {
    const { blobs } = await blobList({ prefix: "briefs/" });
    const summaries: BriefSummary[] = [];
    for (const blob of blobs) {
      if (!blob.pathname.endsWith(".json")) continue;
      if (blob.pathname.endsWith(".status.json")) continue;
      try {
        const res = await fetch(`${blob.url}?t=${Date.now()}`, { cache: "no-store" });
        if (!res.ok) continue;
        const data = await res.json();
        summaries.push({
          id: data.id ?? blob.pathname.replace(/^briefs\//, "").replace(/\.json$/, ""),
          clientName: data.businessInfo?.businessName ?? "—",
          email: data.businessInfo?.email ?? "",
          packageId: data.package?.id ?? "starter",
          totalPrice: data.package?.totalPrice ?? 0,
          createdAt: data.createdAt ?? blob.uploadedAt.toString(),
          couponUsed: !!data.coupon?.code,
          blobUrl: blob.url,
          status: data.status ?? "new",
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

    const list = projectDeals({
      leads: leadsIdx,
      briefs,
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
