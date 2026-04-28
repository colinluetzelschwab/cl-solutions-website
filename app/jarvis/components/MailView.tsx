"use client";

/**
 * Mail view — IMAP-backed inbox/sent reader inside the Inbox surface.
 *
 * Read-only via Hostpoint IMAP. Reply uses the existing Resend pipeline
 * (TODO: surface a [Reply] button that opens an outreach drawer).
 */

import { useEffect, useState } from "react";
import { HudBadge, HudEmpty, HudSkeleton } from "./HudElements";
import { relTime } from "../lib/constants";

const T = {
  surface1: "var(--jarvis-surface-1)",
  surface2: "var(--jarvis-surface-2)",
  border: "var(--jarvis-border-subtle)",
  text: "var(--jarvis-text-primary)",
  textSecondary: "var(--jarvis-text-secondary)",
  textMuted: "var(--jarvis-text-muted)",
  textFaint: "var(--jarvis-text-faint)",
  accent: "var(--jarvis-accent)",
  accentBg: "var(--jarvis-accent-bg)",
  success: "var(--jarvis-success)",
  warning: "var(--jarvis-warning)",
};

interface MailHeader {
  uid: number;
  subject: string;
  from: { name?: string; address: string };
  to?: Array<{ name?: string; address: string }>;
  date: string;
  flags: string[];
  hasAttachments: boolean;
}

interface MailBody {
  uid: number;
  subject: string;
  from: { name?: string; address: string };
  to: Array<{ name?: string; address: string }>;
  date: string;
  text?: string;
  html?: string;
}

interface MailFolder {
  path: string;
  messages: number;
  unseen: number;
}

const FOLDER_PRESETS = [
  { id: "INBOX", label: "Inbox" },
  { id: "Sent", label: "Sent" },
  { id: "INBOX.Sent", label: "Sent (alt)" },
  { id: "Drafts", label: "Drafts" },
];

export default function MailView() {
  const [folder, setFolder] = useState("INBOX");
  const [folders, setFolders] = useState<MailFolder[]>([]);
  const [messages, setMessages] = useState<MailHeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [openUid, setOpenUid] = useState<number | null>(null);
  const [body, setBody] = useState<MailBody | null>(null);
  const [bodyLoading, setBodyLoading] = useState(false);
  const [search, setSearch] = useState("");

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = `/api/dashboard/mail?folder=${encodeURIComponent(folder)}&limit=80&folders=1`;
      const res = await fetch(url, { cache: "no-store" });
      const data = await res.json();
      if (data.configured === false) {
        setConfigured(false);
      } else if (data.error) {
        setConfigured(true);
        setError(data.error);
      } else {
        setConfigured(true);
        setMessages(data.messages ?? []);
        if (data.folders) setFolders(data.folders);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folder]);

  const openMessage = async (uid: number) => {
    setOpenUid(uid);
    setBody(null);
    setBodyLoading(true);
    try {
      const res = await fetch(`/api/dashboard/mail/${uid}?folder=${encodeURIComponent(folder)}`, { cache: "no-store" });
      const data = await res.json();
      if (data.message) setBody(data.message);
      // Mark locally as read.
      setMessages(arr => arr.map(m => m.uid === uid ? { ...m, flags: m.flags.includes("\\Seen") ? m.flags : [...m.flags, "\\Seen"] } : m));
    } catch { /* */ }
    setBodyLoading(false);
  };

  if (configured === false) {
    return (
      <div className="rounded-xl p-6" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
        <p className="text-[14px] mb-2" style={{ color: T.text }}>Mail not configured.</p>
        <p className="text-[12px]" style={{ color: T.textSecondary }}>
          Set <code className="jarvis-mono">IMAP_HOST</code> · <code className="jarvis-mono">IMAP_USER</code> · <code className="jarvis-mono">IMAP_PASSWORD</code> in <code className="jarvis-mono">.envrc</code> (Keychain-backed) and run <code className="jarvis-mono">direnv reload</code>.
        </p>
      </div>
    );
  }

  const filtered = search.trim()
    ? messages.filter(m => {
        const q = search.toLowerCase();
        return m.subject.toLowerCase().includes(q) ||
               m.from.address.toLowerCase().includes(q) ||
               (m.from.name ?? "").toLowerCase().includes(q);
      })
    : messages;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {FOLDER_PRESETS.map(f => {
          const folderInfo = folders.find(x => x.path === f.id);
          if (!folderInfo && f.id !== folder) return null;
          return (
            <button
              key={f.id}
              onClick={() => setFolder(f.id)}
              className="px-3 py-1.5 text-[12px] rounded-md whitespace-nowrap transition-colors"
              style={{
                background: folder === f.id ? T.accentBg : T.surface1,
                border: `1px solid ${folder === f.id ? T.accent : T.border}`,
                color: folder === f.id ? T.text : T.textMuted,
              }}
            >
              {f.label}{folderInfo ? ` · ${folderInfo.messages}` : ""}
              {folderInfo && folderInfo.unseen > 0 && <span className="ml-1.5 px-1.5 py-0.5 rounded-md text-[10px]" style={{ background: T.accent, color: "#fff" }}>{folderInfo.unseen}</span>}
            </button>
          );
        })}
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="ml-auto px-3 py-1.5 text-[12px] rounded-md outline-none"
          style={{ background: T.surface1, border: `1px solid ${T.border}`, color: T.text, width: 180 }}
        />
        <button
          onClick={refresh}
          className="px-3 py-1.5 text-[12px] rounded-md"
          style={{ background: T.surface1, border: `1px solid ${T.border}`, color: T.textMuted }}
        >
          ↻
        </button>
      </div>

      {error && (
        <div className="rounded-md px-3 py-2 text-[12px]" style={{ background: T.surface1, border: `1px solid var(--jarvis-error)`, color: "var(--jarvis-error)" }}>
          {error}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[1fr_540px] gap-4">
        {/* Message list */}
        <div className={openUid ? "hidden lg:block" : ""}>
          {loading ? (
            <HudSkeleton rows={6} />
          ) : filtered.length === 0 ? (
            <HudEmpty message={search ? "No matches." : "Empty folder."} />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
              {filtered.map(m => {
                const unread = !m.flags.includes("\\Seen");
                const active = openUid === m.uid;
                return (
                  <button
                    key={m.uid}
                    onClick={() => openMessage(m.uid)}
                    className="w-full text-left px-4 py-3 transition-colors"
                    style={{
                      background: active ? T.accentBg : "transparent",
                      borderBottom: `1px solid ${T.border}`,
                      borderLeft: unread ? `3px solid ${T.accent}` : "3px solid transparent",
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = T.surface1; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] truncate" style={{ color: T.text, fontWeight: unread ? 600 : 400 }}>
                        {m.from.name ?? m.from.address}
                      </span>
                      <span className="text-[11px] jarvis-mono shrink-0" style={{ color: T.textFaint }}>{relTime(m.date)}</span>
                    </div>
                    <p className="text-[13px] truncate mt-0.5" style={{ color: unread ? T.text : T.textSecondary, fontWeight: unread ? 500 : 400 }}>
                      {m.subject}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {m.hasAttachments && <span className="text-[10px]" style={{ color: T.textFaint }}>📎</span>}
                      {m.flags.includes("\\Answered") && <span className="text-[10px] jarvis-mono" style={{ color: T.textFaint }}>↻ replied</span>}
                      {m.flags.includes("\\Flagged") && <span className="text-[10px]" style={{ color: T.warning }}>★</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail */}
        {openUid && (
          <div className="lg:sticky lg:top-0 lg:self-start">
            <div className="rounded-xl overflow-hidden" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
              <div className="px-5 py-4 flex items-start justify-between gap-3" style={{ borderBottom: `1px solid ${T.border}` }}>
                <div className="min-w-0">
                  {bodyLoading ? (
                    <p className="text-[13px]" style={{ color: T.textMuted }}>Loading…</p>
                  ) : body ? (
                    <>
                      <p className="text-[15px] font-semibold" style={{ color: T.text, letterSpacing: "-0.01em" }}>{body.subject}</p>
                      <p className="text-[12px] mt-1" style={{ color: T.textMuted }}>
                        From: {body.from.name ? `${body.from.name} <${body.from.address}>` : body.from.address}
                      </p>
                      <p className="text-[11px] jarvis-mono" style={{ color: T.textFaint }}>{new Date(body.date).toLocaleString("de-CH")}</p>
                    </>
                  ) : null}
                </div>
                <button onClick={() => { setOpenUid(null); setBody(null); }} className="text-[18px] shrink-0" style={{ color: T.textMuted }}>×</button>
              </div>
              <div className="p-5 max-h-[560px] overflow-y-auto">
                {bodyLoading ? (
                  <HudSkeleton rows={4} />
                ) : body?.text ? (
                  <pre className="text-[13px] leading-relaxed whitespace-pre-wrap break-words font-sans" style={{ color: T.textSecondary }}>{body.text}</pre>
                ) : body?.html ? (
                  <div
                    className="text-[13px] leading-relaxed"
                    style={{ color: T.textSecondary }}
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(body.html) }}
                  />
                ) : (
                  <p className="text-[12px]" style={{ color: T.textMuted }}>(empty body)</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Minimal HTML sanitizer — strips <script>, <iframe>, on* attributes,
 * and javascript: URLs. Not bullet-proof; for trusted-ish IMAP source.
 * Production v2: swap for DOMPurify if needed.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
}
