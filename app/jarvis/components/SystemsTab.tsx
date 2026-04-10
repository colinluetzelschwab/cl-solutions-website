"use client";

import { C, statusColor, relTime } from "../lib/constants";
import { useVpsHealth, useProjects } from "../lib/hooks";
import { HudLabel, HudBox, HudCard, HudBadge, HudSkeleton, HudEmpty } from "./HudElements";

function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h`;
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function SystemsTab() {
  const { health, loading: vpsLoading } = useVpsHealth();
  const { projects, loading: projLoading, refresh } = useProjects();

  return (
    <div className="space-y-6">
      {/* VPS Status */}
      <div>
        <HudLabel>Build Server</HudLabel>
        <div className="mt-3 p-4 lg:p-5 relative" style={{ background: C.surface, borderLeft: `3px solid ${health.status === "online" ? C.success : C.error}40` }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: health.status === "online" ? C.success : C.error }} />
              <span className="text-sm lg:text-base font-bold tracking-wider" style={{
                color: health.status === "online" ? C.success : C.error,
              }}>
                {health.status === "online" ? "ONLINE" : "OFFLINE"}
              </span>
            </div>
            <span className="text-[10px] lg:text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>46.225.88.110</span>
          </div>
          {vpsLoading ? (
            <div className="text-xs" style={{ color: `${C.primary}30` }}>CHECKING...</div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <HudBox label="Uptime" value={health.uptime > 0 ? formatUptime(health.uptime) : "—"} color={C.success} />
              <HudBox label="RAM" value="4 GB" />
              <HudBox label="Region" value="EU-DE" />
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <HudLabel>Deployed Systems</HudLabel>
          <div className="flex items-center gap-3">
            <span className="text-[10px] lg:text-xs tabular-nums" style={{ color: `${C.primary}30` }}>{projects.length}</span>
            <button onClick={refresh} className="text-[10px] lg:text-xs tracking-wider font-medium active:opacity-60" style={{ color: `${C.primary}50` }}>
              REFRESH
            </button>
          </div>
        </div>

        {projLoading ? <HudSkeleton /> : projects.length === 0 ? (
          <HudEmpty message="NO PROJECTS" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {projects.map(p => {
              const sColor = statusColor(p.status);
              return (
                <HudCard
                  key={p.id}
                  onClick={() => p.url && window.open(p.url, "_blank")}
                >
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm lg:text-base font-medium truncate">{p.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {p.framework && (
                          <span className="text-[9px] lg:text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>{p.framework}</span>
                        )}
                        {p.lastDeployedAt && (
                          <span className="text-[9px] lg:text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>{relTime(p.lastDeployedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-3 shrink-0">
                      <span className="w-2 h-2 rounded-full" style={{ background: sColor }} />
                      <span className="text-[10px] lg:text-xs tracking-wider font-medium" style={{ color: sColor }}>
                        {p.status === "READY" ? "LIVE" : p.status}
                      </span>
                    </div>
                  </div>
                </HudCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
