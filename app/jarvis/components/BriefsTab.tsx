"use client";

import { useState, Fragment } from "react";
import { C, PACKAGE_COLORS, PACKAGE_LABELS, relTime } from "../lib/constants";
import type { BriefSummary, ActiveBuild } from "../lib/types";
import { useBriefs, useActiveBuild } from "../lib/hooks";
import { HudLabel, HudBadge, HudCard, HudEmpty, HudSkeleton } from "./HudElements";

function ColorDot({ color }: { color?: string }) {
  if (!color) return null;
  return <span className="w-5 h-5 rounded-sm border border-white/10 shrink-0" style={{ background: color }} />;
}

function BriefDetail({ brief }: { brief: BriefSummary }) {
  return (
    <div className="mt-3 pt-3 space-y-3" style={{ borderTop: `1px solid ${C.dim}` }}>
      {(brief.primaryColor || brief.secondaryColor || brief.accentColor) && (
        <div>
          <HudLabel>Colors</HudLabel>
          <div className="flex gap-2 mt-1.5">
            <ColorDot color={brief.primaryColor} />
            <ColorDot color={brief.secondaryColor} />
            <ColorDot color={brief.accentColor} />
          </div>
        </div>
      )}
      {brief.pages && brief.pages.length > 0 && (
        <div>
          <HudLabel>Pages</HudLabel>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {brief.pages.map(p => (
              <span key={p} className="text-[10px] px-2 py-1" style={{ background: C.surface, color: `${C.primary}70`, border: `1px solid ${C.primary}12` }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
      {brief.features && brief.features.length > 0 && (
        <div>
          <HudLabel>Features</HudLabel>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {brief.features.map(f => (
              <span key={f} className="text-[10px] px-2 py-1" style={{ background: C.surface, color: "rgba(255,255,255,0.4)" }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}
      {brief.notes && (
        <div>
          <HudLabel>Notes</HudLabel>
          <p className="text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            {brief.notes}
          </p>
        </div>
      )}
      <div className="flex gap-3 text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
        <span>{brief.language?.toUpperCase() ?? "DE"}</span>
        <span>{brief.fontPreference ?? "—"}</span>
        <span>{brief.darkMode ? "DARK" : "LIGHT"}</span>
        <span>{brief.hostingPlan?.toUpperCase() ?? "NONE"}</span>
      </div>
    </div>
  );
}

export default function BriefsTab({ onBuildStarted }: { onBuildStarted: (b: ActiveBuild) => void }) {
  const { briefs, loading, refresh, updateStatus, remove } = useBriefs();
  const { startBuild } = useActiveBuild();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<string | null>(null);

  const handlePromote = async (brief: BriefSummary) => {
    if (promoting) return;
    if (!confirm(`Promote "${brief.clientName}" to a CRM project? Pages + features will be seeded as open tasks.`)) return;
    setPromoting(brief.id);
    try {
      const res = await fetch("/api/dashboard/crm-projects/from-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefId: brief.id }),
      });
      if (res.ok) {
        alert(`Project created — open MONEY tab to see it.`);
      } else {
        alert("Promote failed — check console.");
      }
    } finally {
      setPromoting(null);
    }
  };

  const handleDelete = async (brief: BriefSummary) => {
    if (deleting) return;
    if (!confirm(`Delete brief from ${brief.clientName}? This cannot be undone.`)) return;
    setDeleting(brief.id);
    await remove(brief.id);
    setDeleting(null);
  };

  const newBriefs = briefs.filter(b => b.status === "new");
  const builtBriefs = briefs.filter(b => b.status !== "new");

  // Desktop stats
  const totalRevenue = briefs.reduce((sum, b) => sum + b.totalPrice, 0);
  const packageCounts = briefs.reduce<Record<string, number>>((acc, b) => {
    acc[b.packageId] = (acc[b.packageId] ?? 0) + 1;
    return acc;
  }, {});

  const handleBuild = async (brief: BriefSummary) => {
    if (building) return;
    setBuilding(true);
    await updateStatus(brief.id, "building");
    const result = await startBuild(brief.blobUrl, brief.clientName, brief.id);
    if (result) {
      await updateStatus(brief.id, "building", result.slug);
      onBuildStarted(result);
    }
    setBuilding(false);
  };

  return (
    <div>
      {/* ── Desktop pipeline stats bar ─────────────────────────── */}
      {briefs.length > 0 && (
        <div className="hidden md:grid md:grid-cols-4 gap-3 mb-6">
          {[
            { label: "QUEUED", value: newBriefs.length, color: C.warning },
            { label: "DEPLOYED", value: builtBriefs.filter(b => b.status === "built").length, color: C.success },
            { label: "PIPELINE", value: `CHF ${totalRevenue.toLocaleString("de-CH")}`, color: C.primary },
            {
              label: "TOP PACKAGE",
              value: Object.entries(packageCounts).sort((a, b) => b[1] - a[1])[0]
                ? (PACKAGE_LABELS[Object.entries(packageCounts).sort((a, b) => b[1] - a[1])[0][0]] ?? "—")
                : "—",
              color: Object.entries(packageCounts).sort((a, b) => b[1] - a[1])[0]
                ? (PACKAGE_COLORS[Object.entries(packageCounts).sort((a, b) => b[1] - a[1])[0][0]] ?? C.primary)
                : C.primary,
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-3" style={{ background: C.surface, borderLeft: `2px solid ${color}25` }}>
              <p className="text-[9px] tracking-widest font-medium mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>{label}</p>
              <p className="text-base font-bold tabular-nums" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <HudLabel>Incoming Briefs</HudLabel>
          {newBriefs.length > 0 && (
            <span className="text-xs px-2.5 py-1 font-bold tabular-nums" style={{ background: `${C.primary}15`, color: C.primary }}>
              {newBriefs.length}
            </span>
          )}
        </div>
        <button
          onClick={refresh}
          className="text-xs tracking-wider font-medium active:opacity-60 active:scale-95 transition-all px-3 py-2 -mr-3"
          style={{ color: `${C.primary}50` }}
        >
          REFRESH
        </button>
      </div>

      {/* ── New briefs ─────────────────────────────────────────── */}
      {loading ? <HudSkeleton /> : newBriefs.length === 0 ? (
        <HudEmpty message="No new briefs in the queue." />
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-2 md:hidden">
            {newBriefs.map(brief => {
              const isExpanded = expanded === brief.id;
              const pkgColor = PACKAGE_COLORS[brief.packageId] ?? C.primary;
              return (
                <HudCard key={brief.id} active={isExpanded} onClick={() => setExpanded(isExpanded ? null : brief.id)}>
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-medium truncate">{brief.clientName}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: `${C.primary}35` }}>{brief.email}</p>
                    </div>
                    <div className="flex flex-col items-end ml-3 shrink-0 gap-1.5">
                      <HudBadge label={PACKAGE_LABELS[brief.packageId] ?? brief.packageId} color={pkgColor} />
                      <span className="text-xs tabular-nums font-medium" style={{ color: `${C.primary}40` }}>
                        CHF {brief.totalPrice.toLocaleString("de-CH")}
                      </span>
                      <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.15)" }}>
                        {relTime(brief.createdAt)}
                      </span>
                    </div>
                  </div>
                  {isExpanded && (
                    <>
                      <BriefDetail brief={brief} />
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuild(brief); }}
                        disabled={building}
                        className="w-full mt-4 h-14 text-base font-bold tracking-wider disabled:opacity-30 transition-all active:scale-[0.97]"
                        style={{
                          background: building ? `${C.warning}15` : `${C.success}12`,
                          border: `1px solid ${building ? `${C.warning}40` : `${C.success}40`}`,
                          color: building ? C.warning : C.success,
                          textShadow: `0 0 10px ${building ? C.warning : C.success}40`,
                        }}
                      >
                        {building ? "STARTING..." : "▶ BUILD"}
                      </button>
                    </>
                  )}
                </HudCard>
              );
            })}
          </div>

          {/* Desktop: data table */}
          <div className="hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["CLIENT", "PACKAGE", "PALETTE", "PAGES", "FEATURES", "PRICE", "SUBMITTED", ""].map(h => (
                    <th
                      key={h}
                      className={`pb-2.5 text-[9px] tracking-widest font-medium ${h === "PRICE" || h === "SUBMITTED" || h === "" ? "text-right" : "text-left"}`}
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {newBriefs.map(brief => {
                  const isSelected = expanded === brief.id;
                  const pkgColor = PACKAGE_COLORS[brief.packageId] ?? C.primary;
                  return (
                    <Fragment key={brief.id}>
                      <tr
                        onClick={() => setExpanded(isSelected ? null : brief.id)}
                        className="cursor-pointer transition-colors"
                        style={{
                          borderBottom: `1px solid ${isSelected ? "transparent" : C.dim}`,
                          background: isSelected ? `${C.surface}` : "transparent",
                        }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                      >
                        <td className="py-3 pr-6">
                          <p className="text-sm font-medium">{brief.clientName}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: `${C.primary}35` }}>{brief.email}</p>
                        </td>
                        <td className="py-3 pr-6">
                          <HudBadge label={PACKAGE_LABELS[brief.packageId] ?? brief.packageId} color={pkgColor} />
                        </td>
                        <td className="py-3 pr-6">
                          <div className="flex gap-1 items-center">
                            {brief.primaryColor && (
                              <span className="w-5 h-5 rounded-sm" style={{ background: brief.primaryColor, border: "1px solid rgba(255,255,255,0.1)" }} title={brief.primaryColor} />
                            )}
                            {brief.secondaryColor && (
                              <span className="w-5 h-5 rounded-sm" style={{ background: brief.secondaryColor, border: "1px solid rgba(255,255,255,0.1)" }} title={brief.secondaryColor} />
                            )}
                            {brief.accentColor && (
                              <span className="w-5 h-5 rounded-sm" style={{ background: brief.accentColor, border: "1px solid rgba(255,255,255,0.1)" }} title={brief.accentColor} />
                            )}
                            {!brief.primaryColor && !brief.secondaryColor && !brief.accentColor && (
                              <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>—</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-6">
                          <span className="text-sm tabular-nums" style={{ color: "rgba(255,255,255,0.45)" }}>
                            {brief.pages?.length ?? 0}
                          </span>
                          {brief.pages && brief.pages.length > 0 && (
                            <p className="text-[9px] mt-0.5 truncate max-w-[120px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                              {brief.pages.slice(0, 2).join(", ")}{brief.pages.length > 2 ? ` +${brief.pages.length - 2}` : ""}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-6">
                          <span className="text-sm tabular-nums" style={{ color: "rgba(255,255,255,0.45)" }}>
                            {brief.features?.length ?? 0}
                          </span>
                          {brief.features && brief.features.length > 0 && (
                            <p className="text-[9px] mt-0.5 truncate max-w-[140px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                              {brief.features.slice(0, 2).join(", ")}{brief.features.length > 2 ? ` +${brief.features.length - 2}` : ""}
                            </p>
                          )}
                        </td>
                        <td className="py-3 pr-6 text-right">
                          <span className="text-sm tabular-nums font-medium" style={{ color: `${C.primary}70` }}>
                            CHF {brief.totalPrice.toLocaleString("de-CH")}
                          </span>
                        </td>
                        <td className="py-3 pr-6 text-right">
                          <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.2)" }}>
                            {relTime(brief.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleBuild(brief); }}
                            disabled={building}
                            className="px-4 py-1.5 text-[11px] font-bold tracking-wider disabled:opacity-30 transition-all hover:opacity-80 active:scale-95"
                            style={{
                              background: building ? `${C.warning}12` : `${C.success}12`,
                              border: `1px solid ${building ? `${C.warning}35` : `${C.success}35`}`,
                              color: building ? C.warning : C.success,
                            }}
                          >
                            {building ? "..." : "▶ BUILD"}
                          </button>
                        </td>
                      </tr>
                      {isSelected && (
                        <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                          <td colSpan={8} className="px-4 pb-5">
                            <BriefDetail brief={brief} />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleBuild(brief); }}
                              disabled={building}
                              className="mt-4 px-8 py-2.5 text-sm font-bold tracking-wider disabled:opacity-30 transition-all hover:opacity-80 active:scale-95"
                              style={{
                                background: building ? `${C.warning}15` : `${C.success}12`,
                                border: `1px solid ${building ? `${C.warning}40` : `${C.success}40`}`,
                                color: building ? C.warning : C.success,
                                textShadow: `0 0 10px ${building ? C.warning : C.success}40`,
                              }}
                            >
                              {building ? "STARTING..." : "▶ BUILD"}
                            </button>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── Previously Built ───────────────────────────────────── */}
      {builtBriefs.length > 0 && (
        <div className="mt-6">
          <HudLabel>Previously Built</HudLabel>

          {/* Mobile list */}
          <div className="space-y-1 mt-2 md:hidden">
            {builtBriefs.map(brief => (
              <div key={brief.id} className="flex items-center justify-between py-3 px-3 gap-2" style={{ background: C.surface }}>
                <span className="text-sm flex-1 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{brief.clientName}</span>
                <HudBadge label={brief.status.toUpperCase()} color={brief.status === "built" ? C.success : brief.status === "failed" ? C.error : C.warning} />
                <button
                  onClick={() => handleDelete(brief)}
                  disabled={deleting === brief.id}
                  className="text-[11px] tracking-wider font-bold px-2.5 py-1.5 disabled:opacity-30"
                  style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, color: C.error }}
                >
                  {deleting === brief.id ? "..." : "DEL"}
                </button>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block mt-2">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.dim}` }}>
                  {["CLIENT", "PACKAGE", "BUSINESS TYPE", "STATUS", "SUBMITTED", ""].map(h => (
                    <th key={h} className={`pb-2.5 text-[10px] tracking-[0.2em] font-semibold pr-6 ${h === "" ? "text-right" : "text-left"}`} style={{ color: "rgba(255,255,255,0.3)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {builtBriefs.map(brief => {
                  const pkgColor = PACKAGE_COLORS[brief.packageId] ?? C.primary;
                  const statusC = brief.status === "built" ? C.success : brief.status === "failed" ? C.error : C.warning;
                  return (
                    <tr key={brief.id} style={{ borderBottom: `1px solid ${C.dim}` }}>
                      <td className="py-2.5 pr-6">
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>{brief.clientName}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>{brief.email}</p>
                      </td>
                      <td className="py-2.5 pr-6">
                        <HudBadge label={PACKAGE_LABELS[brief.packageId] ?? brief.packageId} color={pkgColor} />
                      </td>
                      <td className="py-2.5 pr-6">
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                          {brief.businessType ?? "—"}
                        </span>
                      </td>
                      <td className="py-2.5 pr-6">
                        <HudBadge label={brief.status.toUpperCase()} color={statusC} />
                      </td>
                      <td className="py-2.5 pr-6">
                        <span className="text-[11px] tabular-nums font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>
                          {relTime(brief.createdAt)}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {brief.status === "built" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePromote(brief); }}
                              disabled={promoting === brief.id}
                              className="text-[10px] tracking-wider font-bold px-2.5 py-1 disabled:opacity-30 hover:opacity-80 active:scale-95"
                              style={{ background: `${C.success}12`, border: `1px solid ${C.success}40`, color: C.success }}
                              title="Promote to CRM project"
                            >
                              {promoting === brief.id ? "..." : "▸ PROJECT"}
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDelete(brief); }}
                            disabled={deleting === brief.id}
                            className="text-[10px] tracking-wider font-bold px-2.5 py-1 disabled:opacity-30 hover:opacity-80 active:scale-95"
                            style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, color: C.error }}
                            title="Delete brief"
                          >
                            {deleting === brief.id ? "..." : "DEL"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
