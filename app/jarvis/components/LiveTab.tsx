"use client";

import { useState, useEffect, useRef } from "react";
import { C, fmt, relTime } from "../lib/constants";
import type { ActiveBuild } from "../lib/types";
import { useActiveBuild, useBuildStatus, useBuildHistory, useBriefs } from "../lib/hooks";
import { HudLabel, HudBadge, HudCard, HudEmpty } from "./HudElements";
import BuildTerminal from "./BuildTerminal";

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

  // Auto-show terminal when build starts
  useEffect(() => {
    if (build) setShowTerminal(true);
  }, [build]);

  if (build && showTerminal) {
    return (
      <div className="bg-[#050508] flex flex-col rounded-sm -mx-4 lg:-mx-6 -mt-2"
        style={{ minHeight: "calc(100vh - 120px)" }}>
        <BuildTerminal
          slug={build.slug}
          clientName={build.clientName}
          log={log}
          phase={phase}
          status={status === "idle" ? "running" : status}
          elapsed={elapsed}
          onBack={() => setShowTerminal(false)}
          onAbort={() => { clearBuild(); setShowTerminal(false); }}
        />
      </div>
    );
  }

  return (
    <div>
      <HudLabel>Live Builds</HudLabel>

      {/* Active build card (when terminal is minimized) */}
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

      {/* Build History */}
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
  );
}
