/**
 * Reply detection for outbound outreach. Polls Hostpoint INBOX via IMAP,
 * searches for messages from a lead's email since the outreach was sent,
 * and classifies the reply by simple keyword heuristic.
 *
 * Used by /api/cron/outreach-sequence to update Outreach.replyStatus
 * BEFORE firing Touch-2/3 — so a reply received during the cadence
 * window stops the sequence cleanly.
 *
 * Auto-replies (out-of-office, vacation) are detected separately and do
 * NOT close the sequence — the cron continues firing touches once the
 * vacation window passes. Negative + positive signals do close it.
 */

import { ImapFlow } from "imapflow";
import type { Lead, Outreach, ReplyStatus } from "./crm-types";

export interface ReplyDetectionResult {
  found: boolean;
  classification?: ReplyStatus;
  date?: string;
  subject?: string;
  excerpt?: string;
  /** Whether the cadence sequence should be marked closed.
   * False for auto-replies (cadence continues), true for negative + positive. */
  shouldCloseSequence?: boolean;
}

interface ImapEnv {
  subject?: string;
  date?: Date;
  from?: Array<{ address?: string }>;
}

interface ImapMsg {
  uid: number;
  envelope?: ImapEnv;
  source?: Buffer;
}

function isImapConfigured(): boolean {
  return !!(
    process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASSWORD
  );
}

async function openClient(): Promise<ImapFlow> {
  if (!isImapConfigured()) {
    throw new Error("IMAP not configured (IMAP_HOST/USER/PASSWORD missing)");
  }
  const client = new ImapFlow({
    host: process.env.IMAP_HOST!,
    port: Number(process.env.IMAP_PORT ?? 993),
    secure: true,
    auth: {
      user: process.env.IMAP_USER!,
      pass: process.env.IMAP_PASSWORD!,
    },
    logger: false,
  });
  await client.connect();
  return client;
}

/* ── Classification ──────────────────────────────────────── */

const AUTO_REPLY_PATTERNS =
  /out of office|automatic reply|automatische antwort|auto-?reply|abwesenheit|abwesend|ferien|urlaub|vacation|out of the office|currently away|nicht im büro|bin verreist/i;

const NEGATIVE_PATTERNS =
  /kein interesse|kein bedarf|nein danke|nicht interessiert|passt (?:für uns )?nicht|brauchen wir nicht|aktuell zufrieden|möchten wir nicht|haben bereits|sind bereits versorgt|wir verzichten|abmelden|bitte (?:nicht|keine) weiteren? (?:mails?|nachrichten?)|nicht weiterverfolgen/i;

const POSITIVE_PATTERNS =
  /interessant|gerne treffen|treffen vereinbaren|termin|rückruf|anrufen|gespräch|kennenlernen|mehr erfahren|mehr informationen|wann passt|preise?|offerte|angebot|verfügbar|sehr gut|klingt gut|machen wir|legen wir los|besprechen/i;

function classifyReply(
  text: string | undefined,
  subject: string | undefined,
): { status: ReplyStatus; closes: boolean } {
  const haystack = `${subject ?? ""} ${text ?? ""}`.toLowerCase();

  // Auto-reply first — these often contain words that look "interesting"
  // but are templated server responses, not actual human engagement.
  if (AUTO_REPLY_PATTERNS.test(haystack)) {
    return { status: "auto_reply", closes: false };
  }

  if (NEGATIVE_PATTERNS.test(haystack)) {
    return { status: "negative", closes: true };
  }

  if (POSITIVE_PATTERNS.test(haystack)) {
    return { status: "positive", closes: true };
  }

  // Unclassified human reply — surface as "positive" so Colin reviews and
  // closes the cadence (we never want to keep bumping someone who replied).
  return { status: "positive", closes: true };
}

/* ── Body extraction (lightweight) ───────────────────────── */

function extractTextFromSource(source: Buffer): string {
  // Naive RFC 2822 split — same approach as mail.ts. Good enough for
  // classification, doesn't need to be perfect.
  const raw = source.toString("utf-8");
  const headerEnd = raw.indexOf("\r\n\r\n");
  if (headerEnd === -1) return raw;
  const body = raw.slice(headerEnd + 4);

  const headers = raw.slice(0, headerEnd);
  const ctMatch = headers.match(
    /Content-Type:\s*([^;\r\n]+)(?:;\s*boundary="?([^"\r\n]+)"?)?/i,
  );
  const contentType = ctMatch?.[1]?.trim().toLowerCase();
  const boundary = ctMatch?.[2];

  if (!contentType?.startsWith("multipart") || !boundary) {
    return body;
  }

  const parts = body.split(`--${boundary}`);
  for (const part of parts) {
    const partHeaderEnd = part.indexOf("\r\n\r\n");
    if (partHeaderEnd === -1) continue;
    const partHeaders = part.slice(0, partHeaderEnd);
    if (/Content-Type:\s*text\/plain/i.test(partHeaders)) {
      return part.slice(partHeaderEnd + 4).trim();
    }
  }
  // Fallback to first part body
  return body;
}

/* ── Public API ──────────────────────────────────────────── */

/**
 * Search the INBOX for any reply from `lead.email` since `outreach.sentAt`.
 * Returns the latest matching message classified by heuristic.
 */
export async function pollOutreachReply(
  outreach: Outreach,
  lead: Lead,
): Promise<ReplyDetectionResult> {
  if (!outreach.sentAt || !lead.email) return { found: false };
  if (!isImapConfigured()) return { found: false };

  const client = await openClient();
  try {
    const lock = await client.getMailboxLock("INBOX");
    try {
      const sinceDate = new Date(outreach.sentAt);
      // ImapFlow search: { from, since }
      const uids = await client.search(
        { from: lead.email, since: sinceDate },
        { uid: true },
      );
      const uidArr = Array.isArray(uids) ? uids : [];
      if (uidArr.length === 0) return { found: false };

      // Most recent matching UID = highest UID for this folder.
      const latestUid = Math.max(...uidArr);

      let envelope: ImapEnv | undefined;
      let source: Buffer | undefined;
      for await (const raw of client.fetch(
        [latestUid],
        { uid: true, envelope: true, source: true },
        { uid: true },
      )) {
        const m = raw as unknown as ImapMsg;
        envelope = m.envelope;
        source = m.source;
        break;
      }

      const subject = envelope?.subject;
      const dateIso = envelope?.date
        ? new Date(envelope.date).toISOString()
        : undefined;
      const bodyText = source ? extractTextFromSource(source) : undefined;

      const { status, closes } = classifyReply(bodyText, subject);

      return {
        found: true,
        classification: status,
        date: dateIso,
        subject,
        excerpt: bodyText?.replace(/\s+/g, " ").trim().slice(0, 220),
        shouldCloseSequence: closes,
      };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}
