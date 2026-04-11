"use client";

import { useState, useEffect, useRef } from "react";
import { C, fmt, relTime, PHASES } from "../lib/constants";
import type { ActiveBuild } from "../lib/types";
import { useActiveBuild, useBuildStatus, useBuildHistory, useBriefs } from "../lib/hooks";
import { HudLabel, HudBadge, HudCard, HudEmpty } from "./HudElements";
import BuildTerminal from "./BuildTerminal";

function BuildStatsPanel({ history }: { history: ReturnType<typeof useBuildHistory> }) {
  if (history.length === 0) return null;

  const successCount = history.filter(h => h.status === "complete").length;
  const successRate = Math.round((successCount / history.length) * 100);
  const durations = history.filter(h => h.duration != null).map(h => h.duration!);
  const avgDuration = durations.length > 0
    ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
    : null;
  const fastest = durations.length > 0 ? Math.min(...durations) : null;
  const lastBuild = history[0];

  return (
    <div className="space-y-4">
      <div>
        <HudLabel>Build Stats</HudLabel>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { label: "TOTAL BUILDS", value: history.length, color: C.primary },
            { label: "SUCCESS RATE", value: `${successRate}%`, color: successRate >= 80 ? C.success : successRate >= 50 ? C.warning : C.error },
            { label: "AVG DURATION", value: avgDuration != null ? fmt(avgDuration) : "—", color: C.primary },
            { label: "FASTEST", value: fastest != null ? fmt(fastest) : "—", color: C.success },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-2.5" style={{ background: C.surface, borderLeft: `2px solid ${color}20` }}>
              <p className="text-[8px] tracking-widest font-medium mb-1" style={{ color: "rgba(255,255,255,0.2)" }}>{label}</p>
              <p className="text-sm font-bold tabular-nums" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {lastBuild && (
        <div>
          <HudLabel>Last Build</HudLabel>
          <div className="mt-2 p-3" style={{ background: C.surface }}>
            <p className="text-sm font-medium">{lastBuild.clientName}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <HudBadge
                label={lastBuild.status.toUpperCase()}
                color={lastBuild.status === "complete" ? C.success : lastBuild.status === "failed" ? C.error : C.warning}
              />
              {lastBuild.duration && (
                <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.25)" }}>
                  {fmt(lastBuild.duration)}
                </span>
              )}
              {lastBuild.startedAt && (
                <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                  {relTime(lastBuild.startedAt)}
                </span>
              )}
            </div>
            {lastBuild.deployUrl && (
              <a
                href={lastBuild.deployUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[10px] mt-2 hover:opacity-80 transition-opacity"
                style={{ color: `${C.primary}60` }}
              >
                {lastBuild.deployUrl.replace("https://", "")} →
              </a>
            )}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <HudLabel>Recent Runs</HudLabel>
          <span className="text-[9px] tabular-nums" style={{ color: `${C.primary}30` }}>{history.length}</span>
        </div>
        <div className="space-y-1">
          {history.slice(0, 6).map((h, i) => {
            const sColor = h.status === "complete" ? C.success : h.status === "failed" ? C.error : C.warning;
            return (
              <div key={`${h.slug}-${i}`} className="flex items-center justify-between py-2 px-2.5" style={{ background: C.surface }}>
                <div className="min-w-0 flex-1">
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{h.clientName}</p>
                  {h.startedAt && (
                    <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.15)" }}>{relTime(h.startedAt)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-2 shrink-0">
                  {h.duration && (
                    <span className="text-[9px] tabular-nums" style={{ color: "rgba(255,255,255,0.2)" }}>{fmt(h.duration)}</span>
                  )}
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: sColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PhaseTimelinePanel({
  phase,
  status,
  elapsed,
}: {
  phase: number;
  status: string;
  elapsed: number;
}) {
  const isComplete = status === "complete";
  const pct = isComplete ? 100 : Math.round(((phase + 0.5) / PHASES.length) * 100);

  return (
    <div className="space-y-4">
      <div>
        <HudLabel>Phase Pipeline</HudLabel>
        <div className="mt-2 space-y-1.5">
          {PHASES.map((p, i) => {
            const done = i < phase || isComplete;
            const active = i === phase && !isComplete;
            const pending = i > phase && !isComplete;
            const color = done ? C.success : active ? C.warning : "rgba(255,255,255,0.1)";
            return (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] tracking-wider font-medium"
                      style={{ color: active ? C.warning : done ? `${C.success}70` : "rgba(255,255,255,0.2)" }}
                    >
                      {p.label}
                    </span>
                    {active && (
                      <span className="text-[9px] tracking-wider animate-pulse" style={{ color: C.warning }}>
                        ACTIVE
                      </span>
                    )}
                    {done && !isComplete && (
                      <span className="text-[9px]" style={{ color: `${C.success}50` }}>✓</span>
                    )}
                    {pending && (
                      <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.1)" }}>—</span>
                    )}
                  </div>
                  <div className="h-px mt-1" style={{ background: active ? `${C.warning}30` : done ? `${C.success}20` : "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <HudLabel>Progress</HudLabel>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
            <span>ELAPSED</span>
            <span className="tabular-nums font-medium" style={{ color: isComplete ? C.success : C.warning }}>{fmt(elapsed)}</span>
          </div>
          <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${pct}%`, background: isComplete ? C.success : C.warning }}
            />
          </div>
          <div className="text-right text-[9px] tabular-nums font-bold" style={{ color: isComplete ? C.success : C.warning }}>
            {pct}%
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveTab() {
  const { build, completeBuild, clearBuild } = useActiveBuild();
  const { status, log, phase } = useBuildStatus(build?.slug ?? null);
  const { updateStatus } = useBriefs();
  const history = useBuildHistory();
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number>(0);

  // Timer
  useEffect(() => {
    if (!build) { setElapsed(0); return; }
    startRef.current = new Date(build.startedAt).getTime();
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [build]);

  // Complete build
  useEffect(() => {
    if (status === "complete" && build) {
      completeBuild("complete");
      updateStatus(build.briefId, "built", build.slug);
    }
  }, [status, build, completeBuild, updateStatus]);

  const [showTerminal, setShowTerminal] = useState(!!build);

  useEffect(() => {
    if (build) setShowTerminal(true);
  }, [build]);

  if (build && showTerminal) {
    const terminalProps = {
      slug: build.slug,
      clientName: build.clientName,
      log,
      phase,
      status: status === "idle" ? "running" as const : status,
      elapsed,
      onBack: () => setShowTerminal(false),
      onAbort: () => { clearBuild(); setShowTerminal(false); },
    };

    return (
      <>
        {/* Mobile: full-width bleed terminal */}
        <div
          className="md:hidden bg-[#050508] flex flex-col rounded-sm -mx-4 -mt-2"
          style={{ minHeight: "calc(100vh - 120px)" }}
        >
          <BuildTerminal {...terminalProps} />
        </div>

        {/* Desktop: terminal + phase/stats sidebar */}
        <div className="hidden md:flex gap-4 -mx-6 -mt-2">
          <div
            className="bg-[#050508] flex flex-col rounded-sm flex-1"
            style={{ minHeight: "calc(100vh - 120px)" }}
          >
            <BuildTerminal {...terminalProps} />
          </div>
          <div className="w-60 shrink-0 py-4 pr-6 overflow-y-auto" style={{ maxHeight: "calc(100vh - 120px)" }}>
            <PhaseTimelinePanel phase={phase} status={status} elapsed={elapsed} />
            {history.length > 0 && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <HudLabel>Recent Builds</HudLabel>
                </div>
                <div className="space-y-1">
                  {history.slice(0, 5).map((h, i) => {
                    const sColor = h.status === "complete" ? C.success : h.status === "failed" ? C.error : C.warning;
                    return (
                      <div key={`${h.slug}-${i}`} className="flex items-center justify-between py-2 px-2.5" style={{ background: C.surface }}>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>{h.clientName}</p>
                        </div>
                        <span className="w-1.5 h-1.5 rounded-full ml-2 shrink-0" style={{ background: sColor }} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="md:grid md:grid-cols-[1fr_240px] md:gap-6">
      {/* Main column */}
      <div>
        <HudLabel>Live Builds</HudLabel>

        {build && !showTerminal && (
          <HudCard active onClick={() => setShowTerminal(true)} className="mt-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full hud-dot-pulse" style={{ color: C.warning, background: C.warning }} />
                <div>
                  <p className="text-sm lg:text-base font-medium">{build.clientName}</p>
                  <p className="text-[10px] lg:text-xs mt-0.5" style={{ color: `${C.primary}35` }}>{build.slug}.vercel.app</p>
                </div>
              </div>
              <span className="text-[10px] lg:text-xs tracking-wider font-bold" style={{ color: C.warning }}>
                OPEN →
              </span>
            </div>
          </HudCard>
        )}

        {!build && <HudEmpty message="NO ACTIVE BUILDS" />}

        {history.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <HudLabel>Build History</HudLabel>
              <span className="text-[10px] lg:text-xs tabular-nums" style={{ color: `${C.primary}30` }}>{history.length}</span>
            </div>
            <div className="space-y-2">
              {history.map((h, i) => (
                <HudCard key={`${h.slug}-${i}`}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm lg:text-base font-medium truncate">{h.clientName}</p>
                      <div className="flex items-center gap-3 mt-1 text-[10px] lg:text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
                        <span>{h.startedAt ? relTime(h.startedAt) : "—"}</span>
                        {h.duration && <span>{fmt(h.duration)}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <HudBadge
                        label={h.status.toUpperCase()}
                        color={h.status === "complete" ? C.success : h.status === "failed" ? C.error : C.warning}
                      />
                      {h.deployUrl && (
                        <a
                          href={h.deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] lg:text-xs tracking-wider font-medium active:opacity-60"
                          style={{ color: `${C.primary}60` }}
                          onClick={e => e.stopPropagation()}
                        >
                          OPEN →
                        </a>
                      )}
                    </div>
                  </div>
                </HudCard>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Desktop stats sidebar */}
      <div className="hidden md:block mt-[1.6rem]">
        <BuildStatsPanel history={history} />
        {history.length === 0 && !build && (
          <div className="p-4" style={{ background: C.surface, borderLeft: `2px solid ${C.dim}` }}>
            <p className="text-[9px] tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>
              BUILD STATS WILL APPEAR HERE AFTER YOUR FIRST DEPLOYMENT.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
