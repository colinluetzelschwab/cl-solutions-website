/**
 * Inbox event log — append-only chronological feed of incoming events
 * across Resend (replies), Stripe (payments), Vercel (builds),
 * CheckVibe (alerts), and internal system events.
 *
 * Storage: crm/inbox/_log.json (append-only array, capped at last 500).
 * Read state: each event has a readAt timestamp set when user opens or
 * actions it. Unread count drives the sidebar dot.
 */

export type InboxEventKind =
  | "reply"      // Resend inbound webhook → lead replied
  | "payment"    // Stripe webhook → invoice.paid / payment_failed
  | "build"      // Vercel webhook → deployment.succeeded / failed
  | "alert"      // CheckVibe / uptime / system warnings
  | "system"    // internal app events (build hung, disk full, etc.)
  ;

export type InboxEventSeverity = "info" | "success" | "warning" | "error";

/** Optional ref to a Deal (or its underlying lead/offer/project). */
export interface InboxEventRef {
  kind: "lead" | "offer" | "project" | "build" | "deployment";
  id: string;
}

export interface InboxEvent {
  id: string;                     // "evt_<nanoid>"
  kind: InboxEventKind;
  severity: InboxEventSeverity;
  source: string;                 // "resend" | "stripe" | "vercel" | "checkvibe" | "vps" | "internal"
  title: string;                  // 1-line summary
  body?: string;                  // optional multi-line detail
  ref?: InboxEventRef;
  /** Domain-specific payload (Stripe invoice, Resend message, etc.). */
  payload?: Record<string, unknown>;
  createdAt: string;              // ISO
  readAt?: string;                // set when user views the event
  handledAt?: string;             // set when user clicks an inline action
  /** Optional inline-action descriptor for UI rendering. */
  actions?: Array<{
    id: string;
    label: string;
    href?: string;                // navigate
    endpoint?: string;            // POST/PATCH endpoint to fire
    method?: "POST" | "PATCH" | "DELETE";
    body?: Record<string, unknown>;
    confirm?: string;             // confirmation text
  }>;
}

export interface InboxEventCreate {
  kind: InboxEventKind;
  severity?: InboxEventSeverity;
  source: string;
  title: string;
  body?: string;
  ref?: InboxEventRef;
  payload?: Record<string, unknown>;
  actions?: InboxEvent["actions"];
}

/* ── Activity log (internal audit, separate stream from Inbox) ── */

export interface ActivityItem {
  id: string;
  source: string;     // "vercel" | "stripe" | "resend" | "vps" | "agent" | "user"
  action: string;     // "deploy.success" | "lead.create" | "agent.run.start"
  label: string;      // 1-line human readable
  payload?: Record<string, unknown>;
  createdAt: string;
}
