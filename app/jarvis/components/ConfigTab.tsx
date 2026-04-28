"use client";

/**
 * CONFIG surface — replaces SettingsTab.
 * Two sections: Connections panel + Account.
 */

import { useEffect, useState } from "react";
import { INTEGRATIONS, type IntegrationDef } from "../lib/constants";
import { PageHeader, HudBadge, HudLine } from "./HudElements";

const T = {
  surface1: "var(--jarvis-surface-1)",
  surface2: "var(--jarvis-surface-2)",
  border: "var(--jarvis-border-subtle)",
  text: "var(--jarvis-text-primary)",
  textSecondary: "var(--jarvis-text-secondary)",
  textMuted: "var(--jarvis-text-muted)",
  textFaint: "var(--jarvis-text-faint)",
  accent: "var(--jarvis-accent)",
  success: "var(--jarvis-success)",
  warning: "var(--jarvis-warning)",
  error: "var(--jarvis-error)",
};

interface TestResult {
  status: "connected" | "missing-token" | "error" | "untested";
  detail?: string;
  latency?: number;
  testedAt?: string;
}

export default function ConfigTab({ onLogout }: { onLogout: () => void }) {
  const [results, setResults] = useState<Record<string, TestResult>>(() => {
    const init: Record<string, TestResult> = {};
    INTEGRATIONS.forEach(i => { init[i.id] = { status: "untested" }; });
    return init;
  });
  const [testingAll, setTestingAll] = useState(false);

  const test = async (i: IntegrationDef) => {
    setResults(r => ({ ...r, [i.id]: { ...r[i.id], status: "untested", detail: "Testing…" } }));
    try {
      const res = await fetch(i.testEndpoint, { cache: "no-store" });
      const data = await res.json();
      setResults(r => ({
        ...r,
        [i.id]: {
          status: data.status,
          detail: data.detail,
          latency: data.latency,
          testedAt: new Date().toISOString(),
        },
      }));
    } catch (e) {
      setResults(r => ({
        ...r,
        [i.id]: { status: "error", detail: e instanceof Error ? e.message : "Network error", testedAt: new Date().toISOString() },
      }));
    }
  };

  const testAll = async () => {
    setTestingAll(true);
    await Promise.all(INTEGRATIONS.map(test));
    setTestingAll(false);
  };

  useEffect(() => {
    // Auto-test on mount (low-cost calls).
    testAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Config"
        subtitle="Connections · secrets · account. Tokens live in macOS Keychain or Vercel env, never in this UI."
        action={
          <button
            onClick={testAll}
            disabled={testingAll}
            className="px-3 py-1.5 text-[12px] rounded-md"
            style={{
              background: T.surface1,
              border: `1px solid ${T.border}`,
              color: T.textMuted,
              cursor: testingAll ? "wait" : "pointer",
            }}
          >
            {testingAll ? "Testing…" : "↻ Test all"}
          </button>
        }
      />

      {/* Connections */}
      <section>
        <p className="text-[11px] mb-3" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>CONNECTIONS</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {INTEGRATIONS.map(i => (
            <ConnectionCard
              key={i.id}
              integration={i}
              result={results[i.id]}
              onTest={() => test(i)}
            />
          ))}
        </div>
      </section>

      <HudLine />

      {/* Account */}
      <section>
        <p className="text-[11px] mb-3" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>ACCOUNT</p>
        <div className="rounded-xl p-5 flex items-center justify-between" style={{ background: T.surface1, border: `1px solid ${T.border}` }}>
          <div>
            <p className="text-[14px] font-medium" style={{ color: T.text }}>Single-user session</p>
            <p className="text-[12px]" style={{ color: T.textMuted }}>Cookie auth · DASHBOARD_PASSWORD via Keychain</p>
          </div>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 text-[12px] rounded-md"
            style={{ background: "transparent", border: `1px solid ${T.error}`, color: T.error }}
          >
            Log out
          </button>
        </div>
      </section>

      <p className="text-[11px] jarvis-mono pt-4" style={{ color: T.textFaint }}>
        Jarvis 2.0 · 7-surface IA · feat/jarvis-2.0
      </p>
    </div>
  );
}

function ConnectionCard({ integration, result, onTest }: { integration: IntegrationDef; result: TestResult; onTest: () => void }) {
  const color =
    result.status === "connected" ? T.success :
    result.status === "missing-token" ? T.warning :
    result.status === "error" ? T.error :
    T.textFaint;
  const label =
    result.status === "connected" ? "Connected" :
    result.status === "missing-token" ? "Missing token" :
    result.status === "error" ? "Error" :
    "Not tested";

  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: T.surface1,
        border: `1px solid ${T.border}`,
        borderLeftWidth: 3,
        borderLeftColor: color,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="text-[14px] font-semibold" style={{ color: T.text }}>{integration.label}</h3>
          <p className="text-[11px] jarvis-mono" style={{ color: T.textFaint }}>{integration.envVar}</p>
        </div>
        <HudBadge label={label} color={color} />
      </div>
      <p className="text-[12px] mb-3" style={{ color: T.textSecondary }}>{integration.description}</p>
      {result.detail && (
        <p className="text-[11px] mb-3" style={{ color: T.textMuted }}>{result.detail}{result.latency != null && ` · ${result.latency}ms`}</p>
      )}
      <div className="flex items-center gap-2">
        <button
          onClick={onTest}
          className="px-3 py-1.5 text-[11px] rounded-md font-medium"
          style={{ background: T.surface2, border: `1px solid ${T.border}`, color: T.textMuted }}
        >
          Test
        </button>
        {integration.externalUrl && (
          <a
            href={integration.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 text-[11px] rounded-md"
            style={{ background: T.surface2, border: `1px solid ${T.border}`, color: T.textMuted }}
          >
            Manage ↗
          </a>
        )}
      </div>
    </div>
  );
}
