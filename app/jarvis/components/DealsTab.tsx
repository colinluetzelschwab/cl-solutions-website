"use client";

/**
 * DEALS surface — unified pipeline (Lead + Brief + Offer + CrmProject).
 *
 * v1: read-only projection from the 4 source collections, served by
 * /api/dashboard/deals. Click a row to open the Deal detail (right pane
 * desktop, full-screen mobile). Detail view delegates to existing
 * LeadDetail when the deal is lead-origin (most cases in the early funnel).
 */

import { useState, useMemo } from "react";
import { useDeals } from "../lib/hooks";
import { DEAL_STAGES, DEAL_SIDE_STAGES, DEAL_STAGE_LABELS } from "../lib/deals";
import type { DealRow, DealStage } from "../lib/deals";
import { PageHeader, HudBadge, HudEmpty, HudSkeleton } from "./HudElements";
import LeadDetail from "./LeadDetail";
import { relTime } from "../lib/constants";

const T = {
  surface1: "var(--jarvis-surface-1)",
  surface2: "var(--jarvis-surface-2)",
  border: "var(--jarvis-border-subtle)",
  borderStrong: "var(--jarvis-border-strong)",
  text: "var(--jarvis-text-primary)",
  textSecondary: "var(--jarvis-text-secondary)",
  textMuted: "var(--jarvis-text-muted)",
  textFaint: "var(--jarvis-text-faint)",
  accent: "var(--jarvis-accent)",
  accentBg: "var(--jarvis-accent-bg)",
  success: "var(--jarvis-success)",
  warning: "var(--jarvis-warning)",
  info: "var(--jarvis-info)",
};

const STAGE_COLORS: Record<DealStage, string> = {
  prospect: "rgba(255,255,255,0.4)",
  qualified: "var(--jarvis-info)",
  mockup: "var(--jarvis-info)",
  outreach: "var(--jarvis-warning)",
  negotiating: "var(--jarvis-warning)",
  signed: "var(--jarvis-success)",
  building: "var(--jarvis-warning)",
  live: "var(--jarvis-success)",
  maintenance: "var(--jarvis-success)",
  lost: "var(--jarvis-error)",
  dormant: "rgba(255,255,255,0.22)",
};

const PRIORITY_LABELS = { 1: "Hot", 2: "Warm", 3: "Cold" } as const;
const PRIORITY_COLORS = { 1: "var(--jarvis-error)", 2: "var(--jarvis-warning)", 3: "rgba(255,255,255,0.4)" } as const;

export default function DealsTab() {
  const { list, loading, refresh } = useDeals();
  const [stageFilter, setStageFilter] = useState<DealStage | "all">("all");
  const [search, setSearch] = useState("");
  const [openDealId, setOpenDealId] = useState<string | null>(null);

  const allStages = [...DEAL_STAGES, ...DEAL_SIDE_STAGES];

  const filtered = useMemo(() => {
    if (!list) return [] as DealRow[];
    let rows = list.rows;
    if (stageFilter !== "all") rows = rows.filter(r => r.stage === stageFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(r => r.client.toLowerCase().includes(q));
    }
    return rows;
  }, [list, stageFilter, search]);

  const openDeal = list?.rows.find(r => r.id === openDealId);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Deals"
        subtitle="Lead → qualified → mockup → outreach → signed → building → live → maintenance"
        action={
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-1.5 text-[13px] rounded-md outline-none"
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
        }
      />

      {/* Stage strip */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <StageChip
          label={`All · ${list?.rows.length ?? 0}`}
          active={stageFilter === "all"}
          onClick={() => setStageFilter("all")}
        />
        {allStages.map(stage => {
          const count = list?.byStage[stage]?.length ?? 0;
          if (count === 0 && stageFilter !== stage) return null;
          return (
            <StageChip
              key={stage}
              label={`${DEAL_STAGE_LABELS[stage]} · ${count}`}
              active={stageFilter === stage}
              onClick={() => setStageFilter(stage)}
              color={STAGE_COLORS[stage]}
            />
          );
        })}
      </div>

      {/* Layout: list + detail (desktop) or list-or-detail (mobile) */}
      <div className="lg:grid lg:grid-cols-[1fr_480px] gap-6">
        {/* List */}
        <div className={openDealId ? "hidden lg:block" : ""}>
          {loading ? (
            <HudSkeleton rows={6} />
          ) : filtered.length === 0 ? (
            <HudEmpty
              message="No deals match this filter."
              hint={list?.rows.length === 0 ? "Add a Lead in TODAY or via ⌘K → Create lead." : undefined}
            />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ background: T.surface1, borderBottom: `1px solid ${T.border}` }}>
                    <th className="text-left px-4 py-3 font-medium" style={{ color: T.textMuted }}>Client</th>
                    <th className="text-left px-3 py-3 font-medium hidden md:table-cell" style={{ color: T.textMuted }}>Stage</th>
                    <th className="text-left px-3 py-3 font-medium hidden md:table-cell" style={{ color: T.textMuted }}>Priority</th>
                    <th className="text-left px-3 py-3 font-medium hidden md:table-cell" style={{ color: T.textMuted }}>Origin</th>
                    <th className="text-right px-4 py-3 font-medium" style={{ color: T.textMuted }}>Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(row => (
                    <tr
                      key={row.id}
                      onClick={() => setOpenDealId(row.id)}
                      className="cursor-pointer transition-colors"
                      style={{
                        background: openDealId === row.id ? T.accentBg : "transparent",
                        borderTop: `1px solid ${T.border}`,
                      }}
                      onMouseEnter={e => { if (openDealId !== row.id) (e.currentTarget as HTMLElement).style.background = T.surface1; }}
                      onMouseLeave={e => { if (openDealId !== row.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.priority && (
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ background: PRIORITY_COLORS[row.priority] }}
                              title={PRIORITY_LABELS[row.priority]}
                            />
                          )}
                          <span style={{ color: T.text }}>{row.client}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        <HudBadge label={DEAL_STAGE_LABELS[row.stage]} color={STAGE_COLORS[row.stage]} />
                      </td>
                      <td className="px-3 py-3 text-[12px] hidden md:table-cell" style={{ color: T.textMuted }}>
                        {row.priority ? PRIORITY_LABELS[row.priority] : "—"}
                      </td>
                      <td className="px-3 py-3 text-[12px] hidden md:table-cell" style={{ color: T.textFaint }}>
                        {row.origin}
                      </td>
                      <td className="px-4 py-3 text-right text-[12px] jarvis-mono" style={{ color: T.textFaint }}>
                        {relTime(row.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail */}
        {openDeal && (
          <div className="lg:sticky lg:top-0 lg:self-start">
            <DealDetail
              deal={openDeal}
              onClose={() => setOpenDealId(null)}
              onChange={refresh}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StageChip({ label, active, onClick, color }: { label: string; active: boolean; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-[12px] rounded-md whitespace-nowrap transition-colors"
      style={{
        background: active ? T.accentBg : T.surface1,
        border: `1px solid ${active ? T.accent : T.border}`,
        color: active ? T.text : T.textMuted,
      }}
    >
      {color && !active && <span className="inline-block w-1.5 h-1.5 rounded-full mr-2" style={{ background: color }} />}
      {label}
    </button>
  );
}

/* ── Deal detail (right pane / full screen) ───────────────── */

function DealDetail({ deal, onClose, onChange }: { deal: DealRow; onClose: () => void; onChange: () => void }) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: T.surface1, border: `1px solid ${T.border}` }}
    >
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div>
          <p className="text-[11px]" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>{deal.origin.toUpperCase()}</p>
          <p className="text-[16px] font-semibold mt-1" style={{ color: T.text, letterSpacing: "-0.01em" }}>{deal.client}</p>
        </div>
        <button
          onClick={onClose}
          className="text-[18px]"
          style={{ color: T.textMuted }}
        >
          ×
        </button>
      </div>
      <div className="p-5">
        {deal.origin === "lead" && deal.links.leadId && (
          <LeadDetail leadId={deal.links.leadId} onDeleted={() => { onChange(); onClose(); }} onChanged={onChange} />
        )}
        {deal.origin === "brief" && (
          <DealBriefFacet deal={deal} />
        )}
        {deal.origin === "project" && (
          <DealProjectFacet deal={deal} />
        )}
      </div>
    </div>
  );
}

function DealBriefFacet({ deal }: { deal: DealRow }) {
  return (
    <div className="space-y-3 text-[13px]">
      <p style={{ color: T.textSecondary }}>
        Brief-origin deal. Promote to lead in the legacy Briefs panel (or via ⌘K).
      </p>
      <div className="text-[11px] jarvis-mono" style={{ color: T.textFaint }}>
        Brief ID: {deal.links.briefId}
      </div>
      {deal.amount !== undefined && (
        <div className="text-[14px]" style={{ color: T.text }}>
          Quote total: <span className="tabular-nums">CHF {deal.amount.toLocaleString("de-CH")}</span>
        </div>
      )}
    </div>
  );
}

function DealProjectFacet({ deal }: { deal: DealRow }) {
  return (
    <div className="space-y-3 text-[13px]">
      <p style={{ color: T.textSecondary }}>
        Project-origin deal. Detailed editor lives in MONEY → Projects (Wave C will fold it here).
      </p>
      <div className="text-[11px] jarvis-mono" style={{ color: T.textFaint }}>
        Project ID: {deal.links.projectId}
        {deal.domain && <><br />Domain: {deal.domain}</>}
      </div>
    </div>
  );
}
