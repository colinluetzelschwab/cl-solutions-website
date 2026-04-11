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

  const readyCount = projects.filter(p => p.status === "READY").length;
  const errorCount = projects.filter(p => p.status === "ERROR").length;

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
            <>
              {/* Mobile: 3 boxes */}
              <div className="grid grid-cols-3 gap-2 md:hidden">
                <HudBox label="Uptime" value={health.uptime > 0 ? formatUptime(health.uptime) : "—"} color={C.success} />
                <HudBox label="RAM" value="4 GB" />
                <HudBox label="Region" value="EU-DE" />
              </div>

              {/* Desktop: 6 boxes */}
              <div className="hidden md:grid md:grid-cols-6 gap-2">
                <HudBox label="Uptime" value={health.uptime > 0 ? formatUptime(health.uptime) : "—"} color={C.success} />
                <HudBox label="RAM" value="4 GB" />
                <HudBox label="CPU" value="2 vCPU" />
                <HudBox label="Disk" value="40 GB" />
                <HudBox label="Region" value="EU-DE" />
                <HudBox label="Load" value={health.status === "online" ? "NOMINAL" : "FAULT"} color={health.status === "online" ? C.success : C.error} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <HudLabel>Deployed Systems</HudLabel>
            {/* Desktop: inline status summary */}
            {!projLoading && projects.length > 0 && (
              <div className="hidden md:flex items-center gap-3 text-[9px] tracking-wider">
                <span style={{ color: `${C.success}70` }}>{readyCount} LIVE</span>
                {errorCount > 0 && <span style={{ color: `${C.error}70` }}>{errorCount} ERR</span>}
              </div>
            )}
          </div>
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
          <>
            {/* Mobile: card grid */}
            <div className="grid grid-cols-1 gap-2 md:hidden">
              {projects.map(p => {
                const sColor = statusColor(p.status);
                return (
                  <HudCard key={p.id} onClick={() => p.url && window.open(p.url, "_blank")}>
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

            {/* Desktop: full table */}
            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {[
                      { label: "PROJECT", align: "left" },
                      { label: "FRAMEWORK", align: "left" },
                      { label: "STATUS", align: "left" },
                      { label: "REPO", align: "left" },
                      { label: "LAST DEPLOY", align: "right" },
                      { label: "", align: "right" },
                    ].map(({ label, align }) => (
                      <th
                        key={label}
                        className={`pb-2.5 text-[9px] tracking-widest font-medium ${align === "right" ? "text-right" : "text-left"} pr-4`}
                        style={{ color: "rgba(255,255,255,0.2)" }}
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map(p => {
                    const sColor = statusColor(p.status);
                    return (
                      <tr
                        key={p.id}
                        className="transition-colors"
                        style={{ borderBottom: `1px solid ${C.dim}` }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <td className="py-3 pr-4">
                          <p className="text-sm font-medium">{p.name}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                            {p.framework ?? "—"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sColor }} />
                            <span className="text-[10px] tracking-wider font-medium" style={{ color: sColor }}>
                              {p.status === "READY" ? "LIVE" : p.status}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          {p.repo ? (
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
                              {p.repo.replace("https://github.com/", "")}
                            </span>
                          ) : (
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.1)" }}>—</span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <span className="text-[10px] tabular-nums" style={{ color: "rgba(255,255,255,0.2)" }}>
                            {p.lastDeployedAt ? relTime(p.lastDeployedAt) : "—"}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {p.url && (
                            <a
                              href={p.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] tracking-wider font-medium hover:opacity-80 transition-opacity"
                              style={{ color: `${C.primary}60` }}
                            >
                              OPEN →
                            </a>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Desktop: project health summary bar */}
              <div className="mt-4 flex items-center gap-6 pt-3" style={{ borderTop: `1px solid ${C.dim}` }}>
                <div className="text-[9px] tracking-widest" style={{ color: "rgba(255,255,255,0.15)" }}>
                  FLEET HEALTH
                </div>
                <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: projects.length > 0 ? `${Math.round((readyCount / projects.length) * 100)}%` : "0%",
                      background: errorCount > 0 ? C.warning : C.success,
                    }}
                  />
                </div>
                <div className="text-[9px] tabular-nums font-bold" style={{ color: errorCount > 0 ? C.warning : C.success }}>
                  {projects.length > 0 ? Math.round((readyCount / projects.length) * 100) : 0}% OPERATIONAL
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
