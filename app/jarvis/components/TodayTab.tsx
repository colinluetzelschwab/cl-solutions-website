"use client";

/**
 * TODAY surface — the default landing.
 *
 * Wave A version: keeps the existing ActionsTab queue but adds a KPI strip
 * on top (Revenue · Outstanding · Pipeline · Deals open). Wave C will
 * rebuild the queue into inline-workspace cards (draft → send in place).
 */

import { useEffect, useState } from "react";
import { useDeals } from "../lib/hooks";
import { PageHeader, HudBox, HudSkeleton } from "./HudElements";
import ActionsTab from "./ActionsTab";
import type { FinanceSummary } from "./../lib/crm-types";
import type { Surface } from "../lib/types";

const T = {
  surface1: "var(--jarvis-surface-1)",
  border: "var(--jarvis-border-subtle)",
  text: "var(--jarvis-text-primary)",
  textMuted: "var(--jarvis-text-muted)",
  textFaint: "var(--jarvis-text-faint)",
  accent: "var(--jarvis-accent)",
  success: "var(--jarvis-success)",
  warning: "var(--jarvis-warning)",
  error: "var(--jarvis-error)",
};

export default function TodayTab({ onNavigate }: { onNavigate?: (s: Surface) => void }) {
  const { list, loading: dealsLoading } = useDeals();
  const [finance, setFinance] = useState<FinanceSummary | null>(null);
  const [finLoading, setFinLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/finance", { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.summary) setFinance(d.summary); })
      .finally(() => setFinLoading(false))
      .catch(() => setFinLoading(false));
  }, []);

  const open = list?.rows.filter(r => !["lost", "dormant", "live", "maintenance"].includes(r.stage)).length ?? 0;
  const hot = list?.rows.filter(r => r.priority === 1 && !["lost", "dormant"].includes(r.stage)).length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Today"
        subtitle="What needs you now."
      />

      {/* KPI strip — last 30d */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {finLoading ? (
          <>
            <HudBox label="Revenue" value="—" />
            <HudBox label="Outstanding" value="—" />
            <HudBox label="Open deals" value="—" />
            <HudBox label="Hot" value="—" />
          </>
        ) : (
          <>
            <HudBox
              label="Revenue (mo)"
              value={`CHF ${(finance?.revenueMonth ?? 0).toLocaleString("de-CH")}`}
              color={T.success}
            />
            <HudBox
              label="Outstanding"
              value={`CHF ${(finance?.outstanding ?? 0).toLocaleString("de-CH")}`}
              color={(finance?.outstanding ?? 0) > 0 ? T.warning : T.textMuted}
            />
            <HudBox
              label="Open deals"
              value={dealsLoading ? "—" : String(open)}
            />
            <HudBox
              label="Hot leads"
              value={dealsLoading ? "—" : String(hot)}
              color={hot > 0 ? T.error : T.textMuted}
            />
          </>
        )}
      </div>

      {/* Queue — delegate to existing ActionsTab (header hidden, TODAY's is the canonical one) */}
      <ActionsTab
        hideHeader
        onNavigate={target => {
          if (!onNavigate) return;
          // Map old tab targets to new surfaces.
          if (target.tab === "pipeline") onNavigate("deals");
          else if (target.tab === "money") onNavigate("money");
        }}
      />
    </div>
  );
}
