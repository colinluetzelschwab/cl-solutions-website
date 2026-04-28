"use client";

import { relTime } from "../lib/constants";
import type { NextAction, NextActionKind } from "../lib/crm-types";
import { useNextActions } from "../lib/crm-hooks";
import { HudCard, HudEmpty, HudSkeleton, HudBadge, PageHeader } from "./HudElements";

const KIND_COLOR: Record<NextActionKind, string> = {
  follow_up: "var(--jarvis-warning)",
  mockup_needed: "var(--jarvis-info)",
  offer_waiting: "var(--jarvis-warning)",
  invoice_unpaid: "var(--jarvis-error)",
  project_blocked: "var(--jarvis-error)",
};

const KIND_LABEL: Record<NextActionKind, string> = {
  follow_up: "Follow up",
  mockup_needed: "Mockup",
  offer_waiting: "Offer",
  invoice_unpaid: "Unpaid",
  project_blocked: "Blocked",
};

const KIND_BUTTON: Record<NextActionKind, string> = {
  follow_up: "Open outreach",
  mockup_needed: "Open lead",
  offer_waiting: "View offer",
  invoice_unpaid: "Mark paid",
  project_blocked: "Open project",
};

export default function ActionsTab({
  onNavigate,
  hideHeader,
}: {
  onNavigate?: (target: { tab: "pipeline" | "money"; refId?: string }) => void;
  hideHeader?: boolean;
}) {
  const { actions, loading, refresh } = useNextActions();

  const goToTarget = (action: NextAction) => {
    if (!onNavigate) return;
    if (action.refKind === "lead" || action.refKind === "outreach" || action.refKind === "mockup") {
      onNavigate({ tab: "pipeline", refId: action.refId });
    } else {
      onNavigate({ tab: "money", refId: action.refId });
    }
  };

  // Bucket by kind for desktop summary.
  const counts = actions.reduce<Record<NextActionKind, number>>((acc, a) => {
    acc[a.kind] = (acc[a.kind] ?? 0) + 1;
    return acc;
  }, {} as Record<NextActionKind, number>);

  const total = actions.length;
  const urgent = actions.filter(a => a.priority >= 80).length;

  return (
    <div>
      {!hideHeader && (
        <PageHeader
          title="Today"
          subtitle={
            total === 0
              ? "Inbox zero. Pipeline is calm."
              : `${total} ${total === 1 ? "thing" : "things"} on your plate · ${urgent} urgent`
          }
          action={
            <button
              onClick={refresh}
              className="text-[12px] font-medium px-3 py-2 rounded-lg"
              style={{ color: "var(--jarvis-text-muted)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--jarvis-text-primary)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--jarvis-text-muted)"}
            >
              Refresh
            </button>
          }
        />
      )}

      {/* Desktop summary strip — minimal, sentence case, big italic numbers */}
      {actions.length > 0 && (
        <div className="hidden md:grid md:grid-cols-5 gap-3 mb-8">
          {(Object.keys(KIND_LABEL) as NextActionKind[]).map(k => (
            <div
              key={k}
              className="p-4 rounded-xl"
              style={{ background: "var(--jarvis-surface-1)", border: `1px solid var(--jarvis-border-subtle)` }}
            >
              <p className="text-[11px] font-medium" style={{ color: "var(--jarvis-text-muted)" }}>{KIND_LABEL[k]}</p>
              <p
                className="text-[32px] mt-2 tabular-nums font-semibold"
                style={{
                  color: counts[k] ? KIND_COLOR[k] : "var(--jarvis-text-faint)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                {counts[k] ?? 0}
              </p>
            </div>
          ))}
        </div>
      )}

      {loading ? <HudSkeleton /> : actions.length === 0 ? (
        <HudEmpty message="All caught up — nothing urgent." />
      ) : (
        <ul className="space-y-2">
          {actions.map(a => {
            const overdue = a.dueAt && new Date(a.dueAt).getTime() < Date.now();
            const urgent = a.priority >= 80;
            return (
              <li key={a.id}>
                <HudCard>
                  <div className="flex items-center gap-5">
                    {/* Priority dot — lines up with row, no harsh bar */}
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ background: urgent ? "var(--jarvis-error)" : a.priority >= 60 ? "var(--jarvis-warning)" : "var(--jarvis-info)" }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <HudBadge label={KIND_LABEL[a.kind]} color={KIND_COLOR[a.kind]} dot />
                        {a.dueAt && (
                          <span className="text-[11px] tabular-nums" style={{ color: overdue ? "var(--jarvis-error)" : "var(--jarvis-text-muted)" }}>
                            {overdue ? "overdue · " : "due "}{relTime(a.dueAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-[15px] font-medium" style={{ color: "var(--jarvis-text-primary)" }}>
                        {a.title}
                      </p>
                      {a.subtitle && (
                        <p className="text-[12px] mt-0.5" style={{ color: "var(--jarvis-text-muted)" }}>
                          {a.subtitle}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => goToTarget(a)}
                      className="text-[12px] font-medium px-3.5 py-2 rounded-lg shrink-0 transition-all"
                      style={{ background: "var(--jarvis-surface-2)", color: "var(--jarvis-text-primary)" }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--jarvis-surface-3)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--jarvis-surface-2)"}
                    >
                      {KIND_BUTTON[a.kind]} →
                    </button>
                  </div>
                </HudCard>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
