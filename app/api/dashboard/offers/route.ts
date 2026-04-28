import { NextRequest, NextResponse } from "next/server";
import { crmList, crmCreate, nextOfferNumber } from "@/app/jarvis/lib/crm-store";
import type { Offer, PackageId } from "@/app/jarvis/lib/crm-types";

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get("dashboard_auth")?.value === "true";
}

const VALID_PKG: PackageId[] = ["starter", "business", "pro", "custom"];

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const offers = await crmList("offers");
    offers.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    return NextResponse.json({ offers });
  } catch (error) {
    console.error("Offer list error:", error);
    return NextResponse.json({ error: "Failed to list offers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    const client = String(body.client ?? "").trim();
    const amountRaw = Number(body.amount);
    if (!client) return NextResponse.json({ error: "client required" }, { status: 400 });
    if (!Number.isFinite(amountRaw) || amountRaw < 0) {
      return NextResponse.json({ error: "amount must be a non-negative number" }, { status: 400 });
    }

    const packageId: PackageId = VALID_PKG.includes(body.packageId) ? body.packageId : "custom";
    // 30-day default validity
    const validUntil = body.validUntil ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const offerNumber = await nextOfferNumber();

    const partial: Omit<Offer, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
      offerNumber,
      leadId: body.leadId || undefined,
      projectId: body.projectId || undefined,
      client,
      packageId,
      amount: amountRaw,
      validUntil,
      contractSigned: !!body.contractSigned,
      invoiceSent: !!body.invoiceSent,
      invoiceSentAt: body.invoiceSentAt || undefined,
      paid: !!body.paid,
      paidAt: body.paidAt || undefined,
      outstanding: typeof body.outstanding === "number" ? body.outstanding : amountRaw,
    };

    const offer = await crmCreate("offers", partial);
    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error("Offer create error:", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
