import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { crmList, crmUpdate } from "@/app/jarvis/lib/crm-store";
import { inboxAppend, activityAppend } from "@/app/jarvis/lib/inbox-store";

/**
 * Stripe webhook receiver.
 *
 * Listens for invoice.paid / payment_failed / subscription.deleted etc.
 * and updates the matching Offer record. Appends Inbox events for triage.
 *
 * NOTE: Stripe must be configured to POST here:
 *   https://<prod-host>/api/webhooks/stripe
 * Signing secret stored in STRIPE_WEBHOOK_SECRET (Keychain).
 *
 * Without a configured webhook + signing secret, this endpoint is idle
 * but valid (returns 200 to any test calls signed correctly, 400 otherwise).
 */
export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature");
  const apiKey = process.env.STRIPE_API_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!apiKey || !whSecret) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const stripe = new Stripe(apiKey);
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (e) {
    return NextResponse.json({ error: `Signature verification failed: ${e instanceof Error ? e.message : ""}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "invoice.paid":
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaid(invoice);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await handleSubscriptionEnd(sub);
        break;
      }
      default:
        // Acknowledged but no-op.
        break;
    }
    await activityAppend({ source: "stripe", action: event.type, label: `Stripe: ${event.type}` });
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Match by stripeInvoiceId on Offer records (will be set when we create
  // the invoice during offer-signing; v1 falls back to client-name match).
  const offers = await crmList("offers");
  const target = offers.find(o => !o.paid && o.client && (invoice.customer_name?.includes(o.client) || invoice.customer_email?.includes(o.client.toLowerCase())));
  if (target) {
    await crmUpdate("offers", target.id, {
      paid: true,
      paidAt: new Date().toISOString(),
      outstanding: 0,
    });
  }
  await inboxAppend({
    kind: "payment",
    severity: "success",
    source: "stripe",
    title: target ? `Paid: CHF ${(invoice.amount_paid / 100).toFixed(2)} from ${target.client}` : `Stripe payment: CHF ${(invoice.amount_paid / 100).toFixed(2)}`,
    body: `Invoice ${invoice.number ?? invoice.id}`,
    ref: target ? { kind: "offer", id: target.id } : undefined,
    payload: { invoiceId: invoice.id, amount: invoice.amount_paid, currency: invoice.currency },
  });
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  await inboxAppend({
    kind: "payment",
    severity: "error",
    source: "stripe",
    title: `Payment failed: ${invoice.customer_name ?? invoice.customer_email ?? "unknown"}`,
    body: `Invoice ${invoice.number ?? invoice.id}`,
    payload: { invoiceId: invoice.id, amount: invoice.amount_due, currency: invoice.currency },
  });
}

async function handleSubscriptionEnd(sub: Stripe.Subscription) {
  await inboxAppend({
    kind: "payment",
    severity: "warning",
    source: "stripe",
    title: `MRR churn: subscription ended`,
    body: `Customer: ${typeof sub.customer === "string" ? sub.customer : sub.customer.id}`,
    payload: { subscriptionId: sub.id, customerId: typeof sub.customer === "string" ? sub.customer : sub.customer.id },
  });
}
