"use client";

/**
 * AGENTS surface — multi-step AI workflow launcher.
 *
 * Each agent is a server-side orchestration of CRM mutations + Claude
 * API calls + external integrations. Click [Run] to fire; results show
 * inline + land in Inbox.
 */

import { useEffect, useState } from "react";
import { AGENTS, type AgentDef, type AgentRun } from "../lib/agent-types";
import { PageHeader, HudBadge, HudEmpty, HudSkeleton } from "./HudElements";
import { relTime } from "../lib/constants";

const T = {
  surface1: "var(--jarvis-surface-1)",
  surface2: "var(--jarvis-surface-2)",
  border: "var(--jarvis-border-subtle)",
  text: "var(--jarvis-text-primary)",
  textSecondary: "var(--jarvis-text-secondary)",
  textMuted: "var(--jarvis-text-muted)",
  textFaint: "var(--jarvis-text-faint)",
  accent: "var(--jarvis-accent)",
  accentBg: "var(--jarvis-accent-bg)",
  success: "var(--jarvis-success)",
  warning: "var(--jarvis-warning)",
  error: "var(--jarvis-error)",
};

export default function AgentsTab() {
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyAgent, setBusyAgent] = useState<string | null>(null);
  const [openAgent, setOpenAgent] = useState<AgentDef | null>(null);
  const [lastResult, setLastResult] = useState<{ agent: string; summary: string; ok: boolean } | null>(null);

  const refresh = async () => {
    try {
      const res = await fetch("/api/dashboard/agents", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setRuns(data.runs ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const run = async (agent: AgentDef, input: Record<string, string | number>) => {
    setBusyAgent(agent.id);
    setLastResult(null);
    try {
      const res = await fetch(`/api/dashboard/agents/${agent.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await res.json();
      if (res.ok && data.run) {
        setLastResult({ agent: agent.label, summary: data.run.resultSummary ?? "Done", ok: true });
      } else {
        setLastResult({ agent: agent.label, summary: data.error ?? "Run failed", ok: false });
      }
    } catch (e) {
      setLastResult({ agent: agent.label, summary: e instanceof Error ? e.message : "network error", ok: false });
    } finally {
      setBusyAgent(null);
      setOpenAgent(null);
      refresh();
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agents"
        subtitle="Multi-step workflows — scrape, draft, deploy, audit. ⌘K is for single actions; this is for batch jobs."
      />

      {lastResult && (
        <div
          className="rounded-xl px-4 py-3 text-[13px]"
          style={{
            background: T.surface1,
            border: `1px solid ${lastResult.ok ? T.success : T.error}`,
            color: lastResult.ok ? T.success : T.error,
          }}
        >
          <span className="font-medium">{lastResult.agent}:</span> {lastResult.summary}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENTS.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            running={busyAgent === agent.id}
            lastRun={runs.find(r => r.agentId === agent.id)}
            onRun={() => agent.fields ? setOpenAgent(agent) : run(agent, {})}
          />
        ))}
      </div>

      <div>
        <p className="text-[11px] mb-3" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>RECENT RUNS</p>
        {loading ? <HudSkeleton rows={3} /> : runs.length === 0 ? (
          <HudEmpty message="No runs yet." hint="Click [Run] on any agent above." />
        ) : (
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: T.surface1, borderBottom: `1px solid ${T.border}` }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: T.textMuted }}>Agent</th>
                  <th className="text-left px-3 py-3 font-medium" style={{ color: T.textMuted }}>Status</th>
                  <th className="text-left px-3 py-3 font-medium hidden md:table-cell" style={{ color: T.textMuted }}>Output</th>
                  <th className="text-right px-4 py-3 font-medium" style={{ color: T.textMuted }}>When</th>
                </tr>
              </thead>
              <tbody>
                {runs.slice(0, 20).map(run => {
                  const def = AGENTS.find(a => a.id === run.agentId);
                  return (
                    <tr key={run.id} style={{ borderTop: `1px solid ${T.border}` }}>
                      <td className="px-4 py-3" style={{ color: T.text }}>{def?.label ?? run.agentId}</td>
                      <td className="px-3 py-3">
                        <HudBadge
                          label={run.status}
                          color={run.status === "complete" ? T.success : run.status === "running" ? T.warning : run.status === "failed" ? T.error : T.textFaint}
                        />
                      </td>
                      <td className="px-3 py-3 text-[12px] hidden md:table-cell" style={{ color: T.textSecondary }}>
                        {run.resultSummary ?? run.errorMessage ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-[12px] jarvis-mono" style={{ color: T.textFaint }}>
                        {relTime(run.startedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openAgent && (
        <ConfigDrawer
          agent={openAgent}
          onClose={() => setOpenAgent(null)}
          onRun={input => run(openAgent, input)}
          busy={busyAgent === openAgent.id}
        />
      )}
    </div>
  );
}

function AgentCard({ agent, running, lastRun, onRun }: { agent: AgentDef; running: boolean; lastRun?: AgentRun; onRun: () => void }) {
  return (
    <div className="rounded-xl p-5" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-[15px] font-semibold" style={{ color: T.text, letterSpacing: "-0.01em" }}>{agent.label}</h3>
        <button
          onClick={onRun}
          disabled={running}
          className="px-3 py-1.5 text-[12px] rounded-md font-medium transition-colors"
          style={{
            background: running ? T.surface2 : T.accentBg,
            border: `1px solid ${running ? T.border : T.accent}`,
            color: running ? T.textFaint : T.accent,
            cursor: running ? "wait" : "pointer",
          }}
        >
          {running ? "Running…" : "Run"}
        </button>
      </div>
      <p className="text-[12px] leading-relaxed" style={{ color: T.textSecondary }}>{agent.description}</p>
      <div className="mt-3 pt-3 flex items-center justify-between text-[11px]" style={{ borderTop: `1px solid ${T.border}` }}>
        <span style={{ color: T.textFaint }}>~{agent.estimatedDuration}s · {agent.outputLabel}</span>
        {lastRun && <span className="jarvis-mono" style={{ color: T.textFaint }}>last: {relTime(lastRun.startedAt)}</span>}
      </div>
    </div>
  );
}

function ConfigDrawer({ agent, onClose, onRun, busy }: { agent: AgentDef; onClose: () => void; onRun: (input: Record<string, string | number>) => void; busy: boolean }) {
  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const initial: Record<string, string | number> = {};
    (agent.fields ?? []).forEach(f => { initial[f.key] = f.default ?? ""; });
    return initial;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div className="w-full max-w-md mx-4 rounded-xl p-6" style={{ background: "#0a0a0a", border: `1px solid ${T.border}` }} onClick={e => e.stopPropagation()}>
        <h3 className="text-[18px] font-semibold mb-2" style={{ color: T.text }}>{agent.label}</h3>
        <p className="text-[12px] mb-5" style={{ color: T.textSecondary }}>{agent.description}</p>

        <div className="space-y-4">
          {(agent.fields ?? []).map(f => (
            <div key={f.key}>
              <label className="text-[11px] block mb-1.5" style={{ color: T.textMuted, letterSpacing: "0.04em" }}>{f.label}</label>
              {f.kind === "select" ? (
                <select
                  value={String(values[f.key] ?? "")}
                  onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
                  className="w-full px-3 py-2 text-[13px] rounded-md outline-none"
                  style={{ background: T.surface1, border: `1px solid ${T.border}`, color: T.text }}
                >
                  {(f.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.kind === "number" ? "number" : "text"}
                  value={String(values[f.key] ?? "")}
                  placeholder={f.placeholder}
                  onChange={e => setValues(v => ({ ...v, [f.key]: f.kind === "number" ? Number(e.target.value) : e.target.value }))}
                  className="w-full px-3 py-2 text-[13px] rounded-md outline-none"
                  style={{ background: T.surface1, border: `1px solid ${T.border}`, color: T.text }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-[12px] rounded-md" style={{ background: T.surface1, border: `1px solid ${T.border}`, color: T.textMuted }}>
            Cancel
          </button>
          <button onClick={() => onRun(values)} disabled={busy} className="px-4 py-2 text-[12px] rounded-md font-medium" style={{ background: T.accentBg, border: `1px solid ${T.accent}`, color: T.accent }}>
            {busy ? "Running…" : "Run"}
          </button>
        </div>
      </div>
    </div>
  );
}
