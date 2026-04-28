"use client";

/**
 * INBOX surface — single triage feed for incoming events.
 *
 * Sources: Resend (replies), Stripe (payments), Vercel (builds),
 * CheckVibe (alerts), VPS / internal (system).
 *
 * In v1 the Inbox is populated by webhook receivers — events surface
 * automatically as integrations fire. Until then the empty state
 * explains how to register webhooks.
 */

import { useMemo, useState } from "react";
import { useInbox } from "../lib/hooks";
import type { InboxEvent, InboxEventKind, InboxEventSeverity } from "../lib/inbox-types";
import { PageHeader, HudBadge, HudEmpty, HudSkeleton } from "./HudElements";
import { relTime } from "../lib/constants";
import MailView from "./MailView";

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
  error: "var(--jarvis-error)",
  info: "var(--jarvis-info)",
};

const SEVERITY_COLOR: Record<InboxEventSeverity, string> = {
  success: T.success,
  warning: T.warning,
  error: T.error,
  info: T.info,
};

const KIND_LABEL: Record<InboxEventKind, string> = {
  reply: "Reply",
  payment: "Payment",
  build: "Build",
  alert: "Alert",
  system: "System",
};

type Filter = "all" | "unread" | InboxEventKind;
type Mode = "events" | "mail";

export default function InboxTab() {
  const { events, unread, loading, markRead, markAllRead } = useInbox();
  const [mode, setMode] = useState<Mode>("events");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    if (filter === "unread") return events.filter(e => !e.readAt);
    return events.filter(e => e.kind === filter);
  }, [events, filter]);

  const counts = useMemo(() => {
    const c = { all: events.length, unread, reply: 0, payment: 0, build: 0, alert: 0, system: 0 } as Record<Filter, number>;
    for (const e of events) c[e.kind]++;
    return c;
  }, [events, unread]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inbox"
        subtitle={mode === "events" ? "Replies · payments · builds · alerts — all in one feed." : "colin@clsolutions.dev — Hostpoint IMAP."}
        action={
          mode === "events" && unread > 0 ? (
            <button
              onClick={markAllRead}
              className="px-3 py-1.5 text-[12px] rounded-md"
              style={{ background: T.surface1, border: `1px solid ${T.border}`, color: T.textMuted }}
            >
              Mark all read
            </button>
          ) : null
        }
      />

      {/* Mode toggle: Events ↔ Mail */}
      <div className="flex items-center gap-1 p-1 rounded-md w-fit" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
        {(["events", "mail"] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className="px-3 py-1.5 text-[12px] rounded-md font-medium transition-colors"
            style={{
              background: mode === m ? T.accentBg : "transparent",
              color: mode === m ? T.text : T.textMuted,
            }}
          >
            {m === "events" ? `Events${unread > 0 ? ` · ${unread}` : ""}` : "Mail"}
          </button>
        ))}
      </div>

      {mode === "mail" ? (
        <MailView />
      ) : (
        <EventsView
          loading={loading}
          filtered={filtered}
          counts={counts}
          filter={filter}
          setFilter={setFilter}
          markRead={markRead}
        />
      )}
    </div>
  );
}

function EventsView({ loading, filtered, counts, filter, setFilter, markRead }: {
  loading: boolean;
  filtered: InboxEvent[];
  counts: Record<Filter, number>;
  filter: Filter;
  setFilter: (f: Filter) => void;
  markRead: (id: string) => void;
}) {
  return (
    <>
      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {([
          ["all", `All · ${counts.all}`],
          ["unread", `Unread · ${counts.unread}`],
          ["reply", `Replies · ${counts.reply}`],
          ["payment", `Payments · ${counts.payment}`],
          ["build", `Builds · ${counts.build}`],
          ["alert", `Alerts · ${counts.alert}`],
          ["system", `System · ${counts.system}`],
        ] as Array<[Filter, string]>).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className="px-3 py-1.5 text-[12px] rounded-md whitespace-nowrap transition-colors"
            style={{
              background: filter === id ? T.accentBg : T.surface1,
              border: `1px solid ${filter === id ? T.accent : T.border}`,
              color: filter === id ? T.text : T.textMuted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <HudSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <HudEmpty
          message="Inbox is empty."
          hint="Events appear here as Resend / Stripe / Vercel webhooks fire. Register webhooks in CONFIG → Connections."
        />
      ) : (
        <div className="space-y-2">
          {filtered.map(e => (
            <EventCard key={e.id} event={e} onRead={() => !e.readAt && markRead(e.id)} />
          ))}
        </div>
      )}
    </>
  );
}

function EventCard({ event, onRead }: { event: InboxEvent; onRead: () => void }) {
  const color = SEVERITY_COLOR[event.severity];
  const isUnread = !event.readAt;

  return (
    <div
      onClick={onRead}
      className="rounded-xl p-4 cursor-pointer transition-colors"
      style={{
        background: isUnread ? T.surface2 : T.surface1,
        border: `1px solid ${isUnread ? T.accent : T.border}`,
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <HudBadge label={KIND_LABEL[event.kind]} color={color} />
            <span className="text-[11px] jarvis-mono" style={{ color: T.textFaint }}>{event.source}</span>
            {isUnread && <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />}
          </div>
          <p className="text-[14px] font-medium" style={{ color: T.text }}>{event.title}</p>
          {event.body && (
            <p className="mt-1 text-[12px] whitespace-pre-line" style={{ color: T.textSecondary }}>{event.body}</p>
          )}
        </div>
        <span className="text-[11px] jarvis-mono shrink-0" style={{ color: T.textFaint }}>{relTime(event.createdAt)}</span>
      </div>

      {event.actions && event.actions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {event.actions.map(a => (
            <button
              key={a.id}
              onClick={(ev) => { ev.stopPropagation(); /* action runner v2 */ }}
              className="px-3 py-1 text-[11px] rounded-md"
              style={{ background: T.surface1, border: `1px solid ${T.border}`, color: T.textMuted }}
            >
              {a.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
