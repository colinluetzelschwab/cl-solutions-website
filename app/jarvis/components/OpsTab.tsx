"use client";

/**
 * OPS surface — composes the existing Live (active build) +
 * Systems (VPS + Vercel projects) tabs into one continuous live page,
 * adds a third row: Recent activity (cross-source event log).
 */

import { useEffect, useState } from "react";
import { useVpsHealth, useProjects } from "../lib/hooks";
import { PageHeader, HudBox, HudBadge, HudEmpty, HudSkeleton } from "./HudElements";
import { relTime } from "../lib/constants";
import LiveTab from "./LiveTab";
import type { ActivityItem } from "../lib/inbox-types";

const T = {
  surface1: "var(--jarvis-surface-1)",
  surface2: "var(--jarvis-surface-2)",
  border: "var(--jarvis-border-subtle)",
  text: "var(--jarvis-text-primary)",
  textSecondary: "var(--jarvis-text-secondary)",
  textMuted: "var(--jarvis-text-muted)",
  textFaint: "var(--jarvis-text-faint)",
  success: "var(--jarvis-success)",
  warning: "var(--jarvis-warning)",
  error: "var(--jarvis-error)",
  info: "var(--jarvis-info)",
};

interface VercelDeployment {
  id: string;
  project: string;
  url: string | null;
  state: string;
  createdAt?: string;
  branch: string | null;
}

export default function OpsTab() {
  const { health, loading: vpsLoading } = useVpsHealth();
  const { projects } = useProjects();
  const [deployments, setDeployments] = useState<VercelDeployment[]>([]);
  const [deployStatus, setDeployStatus] = useState<"loading" | "ok" | "missing-token" | "error">("loading");
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [actLoading, setActLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/integrations/vercel/deployments", { cache: "no-store" });
        if (cancel) return;
        if (res.ok) {
          const data = await res.json();
          setDeployments(data.deployments ?? []);
          setDeployStatus(data.status === "ok" ? "ok" : data.status === "missing-token" ? "missing-token" : "error");
        }
      } catch {
        if (!cancel) setDeployStatus("error");
      }
    };
    load();
    const iv = setInterval(load, 30000);
    return () => { cancel = true; clearInterval(iv); };
  }, []);

  useEffect(() => {
    let cancel = false;
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/activity?limit=30", { cache: "no-store" });
        if (cancel) return;
        if (res.ok) {
          const data = await res.json();
          setActivity(data.items ?? []);
        }
      } catch { /* */ }
      if (!cancel) setActLoading(false);
    };
    load();
    const iv = setInterval(load, 30000);
    return () => { cancel = true; clearInterval(iv); };
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Ops"
        subtitle="Active build · infra health · cross-source activity feed."
      />

      {/* Row 1 — Active build (delegate to existing LiveTab) */}
      <section>
        <p className="text-[11px] mb-3" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>ACTIVE BUILD</p>
        <LiveTab />
      </section>

      {/* Row 2 — Infrastructure */}
      <section className="space-y-4">
        <p className="text-[11px]" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>INFRASTRUCTURE</p>

        {/* VPS row */}
        <div
          className="rounded-xl p-5 flex items-center justify-between"
          style={{
            background: T.surface1,
            border: `1px solid ${T.border}`,
            borderLeftWidth: 3,
            borderLeftColor: vpsLoading ? T.warning : health.status === "online" ? T.success : T.error,
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[14px] font-semibold" style={{ color: T.text }}>VPS · 46.225.88.110</span>
              <HudBadge label={health.status} color={health.status === "online" ? T.success : T.error} />
            </div>
            <p className="text-[12px]" style={{ color: T.textMuted }}>Hetzner CPX22 · Claude Code v2.x · tmux build host</p>
          </div>
          <div className="text-right">
            <p className="text-[11px]" style={{ color: T.textFaint }}>Uptime</p>
            <p className="text-[16px] tabular-nums font-semibold" style={{ color: T.text }}>
              {Math.floor(health.uptime / 86400)}d {Math.floor((health.uptime % 86400) / 3600)}h
            </p>
          </div>
        </div>

        {/* Vercel deploys */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px]" style={{ color: T.textMuted }}>Vercel — last 20 deployments</p>
            {deployStatus === "missing-token" && (
              <span className="text-[11px]" style={{ color: T.warning }}>VERCEL_API_TOKEN not set · go to CONFIG → Connections</span>
            )}
          </div>
          {deployStatus === "loading" ? (
            <HudSkeleton rows={4} />
          ) : deployStatus === "missing-token" ? (
            // Fall back to manual list from existing /projects route.
            projects.length === 0 ? (
              <HudEmpty message="No Vercel data." hint="Set VERCEL_API_TOKEN to pull live deploys." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {projects.slice(0, 12).map(p => (
                  <div key={p.id} className="rounded-xl p-4 flex items-center justify-between" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium truncate" style={{ color: T.text }}>{p.name}</p>
                      <p className="text-[11px] truncate" style={{ color: T.textMuted }}>{p.framework ?? "—"} · {p.lastDeployedAt ? relTime(p.lastDeployedAt) : "never"}</p>
                    </div>
                    {p.url && <a href={p.url} target="_blank" rel="noopener noreferrer" className="text-[11px]" style={{ color: T.textMuted }}>↗</a>}
                  </div>
                ))}
              </div>
            )
          ) : deployments.length === 0 ? (
            <HudEmpty message="No deployments yet." />
          ) : (
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
              <table className="w-full text-[13px]">
                <thead>
                  <tr style={{ background: T.surface1, borderBottom: `1px solid ${T.border}` }}>
                    <th className="text-left px-4 py-2.5 font-medium" style={{ color: T.textMuted }}>Project</th>
                    <th className="text-left px-3 py-2.5 font-medium" style={{ color: T.textMuted }}>State</th>
                    <th className="text-left px-3 py-2.5 font-medium hidden md:table-cell" style={{ color: T.textMuted }}>Branch</th>
                    <th className="text-right px-4 py-2.5 font-medium" style={{ color: T.textMuted }}>When</th>
                  </tr>
                </thead>
                <tbody>
                  {deployments.map(d => (
                    <tr key={d.id} style={{ borderTop: `1px solid ${T.border}` }}>
                      <td className="px-4 py-2.5" style={{ color: T.text }}>
                        {d.url ? <a href={d.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{d.project}</a> : d.project}
                      </td>
                      <td className="px-3 py-2.5">
                        <HudBadge label={d.state} color={d.state === "READY" ? T.success : d.state === "ERROR" ? T.error : T.warning} />
                      </td>
                      <td className="px-3 py-2.5 text-[12px] jarvis-mono hidden md:table-cell" style={{ color: T.textFaint }}>{d.branch ?? "—"}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] jarvis-mono" style={{ color: T.textFaint }}>{d.createdAt ? relTime(d.createdAt) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Row 3 — Recent activity */}
      <section>
        <p className="text-[11px] mb-3" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>RECENT ACTIVITY</p>
        {actLoading ? (
          <HudSkeleton rows={3} />
        ) : activity.length === 0 ? (
          <HudEmpty message="No activity yet." hint="Webhooks + agent runs will populate this feed." />
        ) : (
          <div className="space-y-1.5">
            {activity.map(item => (
              <div key={item.id} className="flex items-center gap-3 px-3 py-2 rounded-md" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
                <span className="text-[10px] jarvis-mono uppercase shrink-0" style={{ color: T.textFaint, width: 70 }}>{item.source}</span>
                <span className="text-[13px] flex-1 truncate" style={{ color: T.text }}>{item.label}</span>
                <span className="text-[11px] jarvis-mono shrink-0" style={{ color: T.textFaint }}>{relTime(item.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
