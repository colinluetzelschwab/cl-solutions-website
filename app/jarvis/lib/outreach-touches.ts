/**
 * Outreach Sequence — Touch 2 / Touch 3 copy + cadence.
 *
 * Cadence (calibrated against the Sebona pattern in _agency/):
 *  - Touch 1 (initial) — sent manually via /api/dashboard/outreach/[id]/send
 *  - Touch 2 (gentle bump) — +9d after Touch 1
 *  - Touch 3 (close-out) — +3d after Touch 2 (= +12d after Touch 1)
 *  - After Touch 3 → sequence closed, no more sends ever.
 *  - Any reply (positive | negative | auto_reply) closes the sequence immediately.
 *
 * Templates are deterministic (not Anthropic-generated) — follow-up copy is
 * formulaic by design and cheaper / safer than running Haiku for every nudge.
 */
import type { Lead, Outreach } from "./crm-types";

export const TOUCH_2_DELAY_DAYS = 9;
export const TOUCH_3_DELAY_DAYS = 3;

export interface TouchPayload {
  touchNumber: 2 | 3;
  subject: string;
  body: string;
  /** ISO of the next due send. Undefined for Touch 3 (sequence closes after). */
  nextFollowUpAt?: string;
}

function greetingFor(lead: Lead): string {
  const name = lead.businessName?.trim();
  if (!name) return "Hallo zusammen";
  // For business names use a neutral greeting; first-name extraction is risky
  // because the field is `businessName` not a person name.
  return "Hallo zusammen";
}

function originalSubject(outreach: Outreach): string {
  const subj = outreach.subject?.trim() || "Anfrage";
  return subj.toLowerCase().startsWith("re:") ? subj : `Re: ${subj}`;
}

/**
 * Build Touch 2 (gentle bump). Short, single paragraph, no new pitch.
 * Offers an explicit out so it doesn't feel pushy.
 */
function buildTouch2(lead: Lead, outreach: Outreach): TouchPayload {
  const greeting = greetingFor(lead);
  const mockupLine = outreach.mockupUrl
    ? `Falls Sie den Entwurf nochmal anschauen möchten — er liegt unter ${outreach.mockupUrl}.`
    : "";

  const body = [
    greeting,
    "",
    "kurzer Hinweis: meine Mail von letzter Woche ist vermutlich im Tagesgeschäft untergegangen.",
    mockupLine,
    "Falls für Sie aktuell nicht passend, geben Sie mir gerne ein kurzes Nein zurück, dann lasse ich Sie in Ruhe.",
    "",
    "Beste Grüsse",
    "Colin",
  ]
    .filter(Boolean)
    .join("\n");

  const nextFollowUpAt = new Date(
    Date.now() + TOUCH_3_DELAY_DAYS * 86400 * 1000,
  ).toISOString();

  return {
    touchNumber: 2,
    subject: originalSubject(outreach),
    body,
    nextFollowUpAt,
  };
}

/**
 * Build Touch 3 (close-out). One line, no rebuttal, soft door-close.
 * After this, sequence is done — no further touches.
 */
function buildTouch3(lead: Lead, outreach: Outreach): TouchPayload {
  const greeting = greetingFor(lead);

  const body = [
    greeting,
    "",
    "ich nehme an, der Zeitpunkt ist gerade nicht passend — kein Problem.",
    "Falls sich das in den nächsten Monaten ändert, melden Sie sich gerne direkt unter colin@clsolutions.dev.",
    "Bis dahin lasse ich Ihren Posteingang in Ruhe.",
    "",
    "Beste Grüsse",
    "Colin",
  ].join("\n");

  return {
    touchNumber: 3,
    subject: originalSubject(outreach),
    body,
    // No next followUpAt — sequence closes after Touch 3.
  };
}

/**
 * Decide the next touch to send for a given outreach record. Returns null when
 * the sequence is already closed, has a reply, or hasn't received Touch 1 yet.
 */
export function nextTouchFor(outreach: Outreach, lead: Lead): TouchPayload | null {
  if (outreach.sequenceClosedAt) return null;
  if (!outreach.sentAt) return null;
  if (outreach.replyStatus !== "none") return null;

  const current = outreach.touchCount ?? 1;
  if (current === 1) return buildTouch2(lead, outreach);
  if (current === 2) return buildTouch3(lead, outreach);
  return null;
}
