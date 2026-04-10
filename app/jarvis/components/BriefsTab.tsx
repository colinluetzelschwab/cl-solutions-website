"use client";

import { useState } from "react";
import { C, PACKAGE_COLORS, PACKAGE_LABELS, relTime } from "../lib/constants";
import type { BriefSummary, ActiveBuild } from "../lib/types";
import { useBriefs, useActiveBuild } from "../lib/hooks";
import { HudLabel, HudBadge, HudCard, HudEmpty, HudSkeleton } from "./HudElements";

function ColorDot({ color }: { color?: string }) {
  if (!color) return null;
  return <span className="w-4 h-4 lg:w-5 lg:h-5 rounded-sm border border-white/10 shrink-0" style={{ background: color }} />;
}

function BriefDetail({ brief }: { brief: BriefSummary }) {
  return (
    <div className="mt-3 pt-3 space-y-3" style={{ borderTop: `1px solid ${C.dim}` }}>
      {/* Colors */}
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

      {/* Pages */}
      {brief.pages && brief.pages.length > 0 && (
        <div>
          <HudLabel>Pages</HudLabel>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {brief.pages.map(p => (
              <span key={p} className="text-[9px] lg:text-[10px] px-2 py-0.5" style={{ background: C.surface, color: `${C.primary}70`, border: `1px solid ${C.primary}12` }}>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Features */}
      {brief.features && brief.features.length > 0 && (
        <div>
          <HudLabel>Features</HudLabel>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {brief.features.map(f => (
              <span key={f} className="text-[9px] lg:text-[10px] px-2 py-0.5" style={{ background: C.surface, color: "rgba(255,255,255,0.4)" }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {brief.notes && (
        <div>
          <HudLabel>Notes</HudLabel>
          <p className="text-[11px] lg:text-xs mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>
            {brief.notes.slice(0, 200)}{brief.notes.length > 200 ? "..." : ""}
          </p>
        </div>
      )}

      {/* Meta */}
      <div className="flex gap-3 text-[9px] lg:text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
        <span>{brief.language?.toUpperCase() ?? "DE"}</span>
        <span>{brief.fontPreference ?? "—"}</span>
        <span>{brief.darkMode ? "DARK" : "LIGHT"}</span>
        <span>{brief.hostingPlan?.toUpperCase() ?? "NONE"}</span>
      </div>
    </div>
  );
}

export default function BriefsTab({ onBuildStarted }: { onBuildStarted: (b: ActiveBuild) => void }) {
  const { briefs, loading, refresh, updateStatus } = useBriefs();
  const { startBuild } = useActiveBuild();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [building, setBuilding] = useState(false);

  const newBriefs = briefs.filter(b => b.status === "new");

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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <HudLabel>Incoming Briefs</HudLabel>
          {newBriefs.length > 0 && (
            <span className="text-[10px] lg:text-xs px-2 py-0.5 font-bold tabular-nums" style={{ background: `${C.primary}15`, color: C.primary }}>
              {newBriefs.length}
            </span>
          )}
        </div>
        <button onClick={refresh} className="text-[10px] lg:text-xs tracking-wider font-medium active:opacity-60 transition-opacity" style={{ color: `${C.primary}50` }}>
          REFRESH
        </button>
      </div>

      {loading ? <HudSkeleton /> : newBriefs.length === 0 ? (
        <HudEmpty message="NO NEW BRIEFS" />
      ) : (
        <div className="space-y-2">
          {newBriefs.map(brief => {
            const isExpanded = expanded === brief.id;
            const pkgColor = PACKAGE_COLORS[brief.packageId] ?? C.primary;
            return (
              <HudCard
                key={brief.id}
                active={isExpanded}
                onClick={() => setExpanded(isExpanded ? null : brief.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm lg:text-base font-medium truncate">{brief.clientName}</p>
                    <p className="text-[10px] lg:text-xs mt-0.5 truncate" style={{ color: `${C.primary}35` }}>{brief.email}</p>
                  </div>
                  <div className="flex flex-col items-end ml-3 shrink-0 gap-1.5">
                    <HudBadge label={PACKAGE_LABELS[brief.packageId] ?? brief.packageId} color={pkgColor} />
                    <span className="text-[10px] lg:text-xs tabular-nums font-medium" style={{ color: `${C.primary}40` }}>
                      CHF {brief.totalPrice.toLocaleString("de-CH")}
                    </span>
                    <span className="text-[9px] lg:text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.15)" }}>
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
                      className="w-full mt-4 h-12 lg:h-14 text-sm lg:text-base font-bold tracking-wider disabled:opacity-30 transition-all active:scale-[0.98]"
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
      )}

      {/* Built briefs section */}
      {briefs.filter(b => b.status !== "new").length > 0 && (
        <div className="mt-6">
          <HudLabel>Previously Built</HudLabel>
          <div className="space-y-1 mt-2">
            {briefs.filter(b => b.status !== "new").map(brief => (
              <div key={brief.id} className="flex items-center justify-between py-2 px-3" style={{ background: C.surface }}>
                <span className="text-xs lg:text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>{brief.clientName}</span>
                <HudBadge label={brief.status.toUpperCase()} color={brief.status === "built" ? C.success : brief.status === "failed" ? C.error : C.warning} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
