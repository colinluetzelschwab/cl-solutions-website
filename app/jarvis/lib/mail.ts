/**
 * Hostpoint IMAP adapter — read-only inbox + sent folder access.
 * Server-side only (uses Node net + Buffer). Reuses one TLS connection
 * per request; for v1 we open + close per call (cheap, ~200ms).
 *
 * Env (loaded from Keychain via .envrc):
 *   IMAP_HOST     — imap.mail.hostpoint.ch
 *   IMAP_PORT     — 993 (TLS)
 *   IMAP_USER     — colin@clsolutions.dev
 *   IMAP_PASSWORD — Keychain: clsolutions-imap-password
 */

import { ImapFlow } from "imapflow";

export interface MailHeader {
  uid: number;
  seq: number;
  subject: string;
  from: { name?: string; address: string };
  to?: Array<{ name?: string; address: string }>;
  date: string;          // ISO
  preview: string;       // first 220 chars
  flags: string[];
  hasAttachments: boolean;
  inReplyTo?: string;
  messageId?: string;
}

export interface MailBody {
  uid: number;
  subject: string;
  from: { name?: string; address: string };
  to: Array<{ name?: string; address: string }>;
  cc?: Array<{ name?: string; address: string }>;
  date: string;
  text?: string;
  html?: string;
  inReplyTo?: string;
  messageId?: string;
}

export interface MailFolder {
  path: string;
  messages: number;
  unseen: number;
}

function isConfigured(): boolean {
  return !!(process.env.IMAP_HOST && process.env.IMAP_USER && process.env.IMAP_PASSWORD);
}

async function openClient(): Promise<ImapFlow> {
  if (!isConfigured()) throw new Error("IMAP not configured (IMAP_HOST/USER/PASSWORD missing)");
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

/* ── Public API ──────────────────────────────────────────── */

export async function mailIsConfigured(): Promise<boolean> {
  return isConfigured();
}

export async function mailListFolders(): Promise<MailFolder[]> {
  const client = await openClient();
  try {
    const list = await client.list();
    const folders: MailFolder[] = [];
    for (const f of list) {
      // Only show standard mail folders.
      if (f.flags.has("\\Noselect")) continue;
      const status = await client.status(f.path, { messages: true, unseen: true });
      folders.push({
        path: f.path,
        messages: status.messages ?? 0,
        unseen: status.unseen ?? 0,
      });
    }
    return folders;
  } finally {
    await client.logout().catch(() => {});
  }
}

interface ImapMsg {
  uid: number;
  seq: number;
  flags?: Set<string>;
  envelope?: {
    subject?: string;
    from?: Array<{ name?: string; address?: string }>;
    to?: Array<{ name?: string; address?: string }>;
    date?: Date;
    inReplyTo?: string;
    messageId?: string;
  };
  bodyStructure?: { childNodes?: unknown[]; type?: string; subtype?: string; disposition?: string };
  source?: Buffer;
}

export async function mailListMessages(folder = "INBOX", limit = 50): Promise<MailHeader[]> {
  const client = await openClient();
  try {
    const lock = await client.getMailboxLock(folder);
    try {
      const status = await client.status(folder, { messages: true });
      const total = status.messages ?? 0;
      if (total === 0) return [];
      const fromSeq = Math.max(1, total - limit + 1);
      const range = `${fromSeq}:${total}`;
      const messages: MailHeader[] = [];
      for await (const msg of client.fetch(range, { uid: true, envelope: true, flags: true, bodyStructure: true })) {
        const m = msg as unknown as ImapMsg;
        const env = m.envelope ?? {};
        const fromArr = env.from ?? [];
        const toArr = env.to ?? [];
        messages.push({
          uid: m.uid,
          seq: m.seq,
          subject: env.subject ?? "(no subject)",
          from: { name: fromArr[0]?.name, address: fromArr[0]?.address ?? "" },
          to: toArr.map((a) => ({ name: a.name, address: a.address ?? "" })),
          date: env.date ? new Date(env.date).toISOString() : new Date().toISOString(),
          preview: "",
          flags: m.flags ? Array.from(m.flags) : [],
          hasAttachments: hasAttachments(m.bodyStructure as { childNodes?: Array<{ disposition?: string }> } | undefined),
          inReplyTo: env.inReplyTo,
          messageId: env.messageId,
        });
      }
      // Newest first.
      messages.sort((a, b) => b.uid - a.uid);
      return messages;
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

export async function mailGet(folder: string, uid: number): Promise<MailBody | null> {
  const client = await openClient();
  try {
    const lock = await client.getMailboxLock(folder);
    try {
      const m = await client.fetchOne(uid, { uid: true, envelope: true, source: true, flags: true }, { uid: true });
      if (!m) return null;
      const msg = m as unknown as ImapMsg;
      const env = msg.envelope ?? {};
      const fromArr = env.from ?? [];
      const toArr = env.to ?? [];
      const source = msg.source as Buffer | undefined;
      const { text, html } = source ? parseSource(source) : { text: undefined, html: undefined };
      // Mark as read after fetching.
      await client.messageFlagsAdd({ uid }, ["\\Seen"], { uid: true }).catch(() => {});
      return {
        uid,
        subject: env.subject ?? "(no subject)",
        from: { name: fromArr[0]?.name, address: fromArr[0]?.address ?? "" },
        to: toArr.map((a) => ({ name: a.name, address: a.address ?? "" })),
        cc: undefined,
        date: env.date ? new Date(env.date).toISOString() : new Date().toISOString(),
        text,
        html,
        inReplyTo: env.inReplyTo,
        messageId: env.messageId,
      };
    } finally {
      lock.release();
    }
  } finally {
    await client.logout().catch(() => {});
  }
}

/* ── Helpers ─────────────────────────────────────────────── */

function hasAttachments(structure?: { childNodes?: Array<{ disposition?: string }> }): boolean {
  if (!structure?.childNodes) return false;
  return structure.childNodes.some((c) => c.disposition === "attachment");
}

/**
 * Naive RFC 2045/2822 parser — extracts the largest text/plain or
 * text/html part from a raw RFC 822 source buffer. For most email
 * clients this is "good enough" without pulling in mailparser as a
 * heavy dep. Falls back to the raw body if no MIME boundary found.
 */
function parseSource(source: Buffer): { text?: string; html?: string } {
  const raw = source.toString("utf-8");
  const headerEnd = raw.indexOf("\r\n\r\n");
  if (headerEnd === -1) return { text: raw };
  const headers = raw.slice(0, headerEnd);
  const body = raw.slice(headerEnd + 4);

  const ctMatch = headers.match(/Content-Type:\s*([^;\r\n]+)(?:;\s*boundary="?([^"\r\n]+)"?)?/i);
  const contentType = ctMatch?.[1]?.trim().toLowerCase();
  const boundary = ctMatch?.[2];

  if (!contentType?.startsWith("multipart") || !boundary) {
    if (contentType === "text/html") return { html: body };
    return { text: body };
  }

  const parts = body.split(`--${boundary}`);
  let text: string | undefined;
  let html: string | undefined;
  for (const part of parts) {
    const partHeaderEnd = part.indexOf("\r\n\r\n");
    if (partHeaderEnd === -1) continue;
    const partHeaders = part.slice(0, partHeaderEnd);
    const partBody = part.slice(partHeaderEnd + 4);
    if (/Content-Type:\s*text\/plain/i.test(partHeaders) && !text) text = partBody.trim();
    if (/Content-Type:\s*text\/html/i.test(partHeaders) && !html) html = partBody.trim();
  }

  // Strip quoted-printable and base64 if encoded.
  if (text && /Content-Transfer-Encoding:\s*quoted-printable/i.test(body)) {
    text = decodeQuotedPrintable(text);
  }
  if (html && /Content-Transfer-Encoding:\s*quoted-printable/i.test(body)) {
    html = decodeQuotedPrintable(html);
  }
  return { text, html };
}

function decodeQuotedPrintable(input: string): string {
  return input
    .replace(/=\r?\n/g, "")
    .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}
