"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════ */

interface BriefSummary {
  id: string;
  clientName: string;
  email: string;
  packageId: string;
  totalPrice: number;
  createdAt: string;
  couponUsed: boolean;
  blobUrl: string;
}

interface ProjectSummary {
  id: string;
  name: string;
  framework: string | null;
  status: string;
  url: string | null;
  lastDeployedAt: string | null;
}

type View = "login" | "inbox" | "projects" | "build";

interface ActiveBuild {
  slug: string;
  clientName: string;
}

/* ═══════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════ */

const CYAN = "#00F0FF";
const GREEN = "#00FF88";
const AMBER = "#FFB800";
const RED = "#FF4444";
const DIM = "rgba(255,255,255,0.06)";

const PHASES = [
  { id: "init", label: "SYSTEM INIT", short: "INIT" },
  { id: "research", label: "BRANCH RECON", short: "RECON" },
  { id: "generate", label: "SCAFFOLD", short: "SCFLD" },
  { id: "content", label: "CONTENT BUILD", short: "CNTNT" },
  { id: "images", label: "ASSET FETCH", short: "ASSET" },
  { id: "build", label: "COMPILE + QA", short: "BUILD" },
  { id: "deploy", label: "DEPLOY", short: "DPLOY" },
];

/* ═══════════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════════ */

function fmt(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function relTime(d: string): string {
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "now";
  if (min < 60) return `${min}m`;
  const hr = Math.floor(ms / 3600000);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(ms / 86400000);
  return `${day}d`;
}

function statusColor(s: string): string {
  switch (s.toUpperCase()) {
    case "READY": return GREEN;
    case "BUILDING": case "QUEUED": return AMBER;
    case "ERROR": case "CANCELED": return RED;
    default: return "rgba(255,255,255,0.2)";
  }
}

/* ═══════════════════════════════════════════════════
   HUD Components
   ═══════════════════════════════════════════════════ */

function HudLine() {
  return <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${CYAN}20, transparent)` }} />;
}

function HudLabel({ children }: { children: string }) {
  return (
    <span className="text-[8px] tracking-[0.3em] uppercase" style={{ color: `${CYAN}50` }}>
      {children}
    </span>
  );
}

function HudBox({ label, value, color = CYAN }: { label: string; value: string; color?: string }) {
  return (
    <div className="relative p-2.5" style={{ background: "rgba(255,255,255,0.015)" }}>
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l" style={{ borderColor: `${CYAN}30` }} />
      <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r" style={{ borderColor: `${CYAN}30` }} />
      <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l" style={{ borderColor: `${CYAN}30` }} />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r" style={{ borderColor: `${CYAN}30` }} />
      <p className="text-[8px] tracking-[0.2em] uppercase" style={{ color: `${CYAN}40` }}>{label}</p>
      <p className="text-base mt-0.5 tabular-nums" style={{ color, textShadow: `0 0 10px ${color}40` }}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LOGIN
   ═══════════════════════════════════════════════════ */

function LoginView({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lines = [
      "> JARVIS v1.0 — CL Solutions Build System",
      "> Establishing secure connection...",
      "> VPS 46.225.88.110 — ONLINE",
      "> Awaiting authentication...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setBootLines(prev => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        inputRef.current?.focus();
      }
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const submit = async () => {
    if (!pw.trim() || loading) return;
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/dashboard/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        setBootLines(prev => [...prev, "> ACCESS GRANTED"]);
        setTimeout(onAuth, 500);
      } else {
        setErr("ACCESS DENIED");
        setBootLines(prev => [...prev, "> ERROR: Invalid credentials"]);
      }
    } catch {
      setErr("CONNECTION FAILED");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 hud-scanline" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="w-full max-w-sm space-y-6 hud-boot">
        {/* Boot text */}
        <div className="space-y-1">
          {bootLines.map((line, i) => (
            <p key={i} className="text-[11px]" style={{
              color: line.includes("GRANTED") ? GREEN : line.includes("ERROR") ? RED : `${CYAN}60`,
              textShadow: line.includes("GRANTED") ? `0 0 10px ${GREEN}40` : "none",
            }}>
              {line}
            </p>
          ))}
          {bootLines.length < 4 && <span className="hud-cursor" style={{ color: `${CYAN}40` }}>█</span>}
        </div>

        {/* Input */}
        {bootLines.length >= 4 && (
          <div className="space-y-3">
            <HudLine />
            <div>
              <HudLabel>Authentication Required</HudLabel>
              <div className="flex gap-2 mt-2">
                <input
                  ref={inputRef}
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  placeholder="password"
                  className="flex-1 bg-transparent border px-3 py-2.5 text-sm outline-none"
                  style={{ borderColor: err ? `${RED}60` : `${CYAN}20`, color: CYAN }}
                />
                <button
                  onClick={submit}
                  disabled={loading}
                  className="px-4 py-2.5 text-xs tracking-wider disabled:opacity-30"
                  style={{ background: `${CYAN}15`, color: CYAN, border: `1px solid ${CYAN}30` }}
                >
                  {loading ? "..." : "AUTH"}
                </button>
              </div>
              {err && <p className="text-[10px] mt-1.5" style={{ color: RED }}>{err}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   INBOX VIEW
   ═══════════════════════════════════════════════════ */

function InboxView({ onBuild }: { onBuild: (b: ActiveBuild) => void }) {
  const [briefs, setBriefs] = useState<BriefSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [building, setBuilding] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/briefs");
      if (res.ok) {
        const data = await res.json();
        setBriefs(data.briefs ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const startBuild = async (brief: BriefSummary) => {
    if (building) return;
    setBuilding(brief.id);
    try {
      const res = await fetch("/api/dashboard/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefUrl: brief.blobUrl, clientName: brief.clientName }),
      });
      const data = await res.json();
      if (data.success) {
        onBuild({ slug: data.slug, clientName: brief.clientName });
      }
    } catch { /* */ }
    setBuilding(null);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between mb-3">
        <HudLabel>Incoming Briefs</HudLabel>
        <button onClick={() => { setLoading(true); fetch_(); }} className="text-[9px] tracking-wider" style={{ color: `${CYAN}40` }}>
          REFRESH
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <span className="text-xs" style={{ color: `${CYAN}30` }}>SCANNING...</span>
        </div>
      ) : briefs.length === 0 ? (
        <div className="py-12 text-center">
          <span className="text-xs" style={{ color: `${CYAN}20` }}>NO BRIEFS DETECTED</span>
        </div>
      ) : (
        briefs.map(brief => (
          <button
            key={brief.id}
            onClick={() => startBuild(brief)}
            disabled={building === brief.id}
            className="w-full text-left p-3 flex items-center justify-between transition-all active:scale-[0.98]"
            style={{
              background: building === brief.id ? `${CYAN}08` : "rgba(255,255,255,0.02)",
              borderLeft: `2px solid ${building === brief.id ? AMBER : `${CYAN}20`}`,
            }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate" style={{ color: "#FAFAFA" }}>{brief.clientName}</p>
              <p className="text-[10px] mt-0.5 truncate" style={{ color: `${CYAN}30` }}>{brief.email}</p>
            </div>
            <div className="flex flex-col items-end ml-3 shrink-0">
              <span className="text-[9px] px-1.5 py-0.5" style={{
                background: `${CYAN}10`, color: `${CYAN}80`,
                border: `1px solid ${CYAN}15`,
              }}>
                {brief.packageId.toUpperCase()}
              </span>
              <span className="text-[10px] mt-1 tabular-nums" style={{ color: `${CYAN}30` }}>
                {relTime(brief.createdAt)}
              </span>
            </div>
            {building === brief.id && (
              <div className="ml-2 w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: AMBER, borderTopColor: "transparent" }} />
            )}
          </button>
        ))
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PROJECTS VIEW
   ═══════════════════════════════════════════════════ */

function ProjectsView() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then(async res => {
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects ?? []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-1">
      <div className="mb-3 flex items-center justify-between">
        <HudLabel>Deployed Systems</HudLabel>
        <span className="text-[9px] tabular-nums" style={{ color: `${CYAN}30` }}>{projects.length}</span>
      </div>

      {loading ? (
        <div className="py-12 text-center">
          <span className="text-xs" style={{ color: `${CYAN}30` }}>LOADING...</span>
        </div>
      ) : (
        projects.map(p => (
          <button
            key={p.id}
            onClick={() => p.url && window.open(p.url, "_blank")}
            className="w-full text-left p-3 flex items-center justify-between transition-all active:scale-[0.98]"
            style={{ background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${statusColor(p.status)}30` }}
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate" style={{ color: "#FAFAFA" }}>{p.name}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)" }}>
                {p.framework ?? "—"} · {p.lastDeployedAt ? relTime(p.lastDeployedAt) : "—"}
              </p>
            </div>
            <div className="flex items-center gap-1.5 ml-3 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(p.status) }} />
              <span className="text-[9px] uppercase" style={{ color: statusColor(p.status) }}>
                {p.status === "READY" ? "LIVE" : p.status}
              </span>
            </div>
          </button>
        ))
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   BUILD MONITOR
   ═══════════════════════════════════════════════════ */

function BuildView({ build, onBack }: { build: ActiveBuild; onBack: () => void }) {
  const [status, setStatus] = useState<"running" | "complete" | "error">("running");
  const [log, setLog] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState(0);
  const [bootText, setBootText] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(Date.now());

  const pct = status === "complete" ? 100 : Math.round(((phase + 0.5) / PHASES.length) * 100);

  // Boot typing
  useEffect(() => {
    const txt = `> INITIALIZING BUILD SEQUENCE...\n> TARGET: ${build.slug}.vercel.app\n> CLIENT: ${build.clientName}\n> STATUS: ONLINE\n`;
    let i = 0;
    const iv = setInterval(() => {
      if (i <= txt.length) { setBootText(txt.slice(0, i)); i++; }
      else { clearInterval(iv); setBootDone(true); }
    }, 18);
    return () => clearInterval(iv);
  }, [build]);

  // Poll
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/dashboard/build", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: build.slug }),
        });
        const data = await res.json();
        if (data.log) {
          setLog(data.log);
          const l = data.log.toLowerCase();
          if (l.includes("deploy") || l.includes("vercel")) setPhase(6);
          else if (l.includes("build") || l.includes("npm run")) setPhase(5);
          else if (l.includes("image") || l.includes("unsplash")) setPhase(4);
          else if (l.includes("content") || l.includes("page.tsx")) setPhase(3);
          else if (l.includes("generat") || l.includes("scaffold")) setPhase(2);
          else if (l.includes("research") || l.includes("search")) setPhase(1);
        }
        if (data.status === "complete") setStatus("complete");
      } catch { /* */ }
    };
    const iv = setInterval(poll, 4000);
    poll();
    return () => clearInterval(iv);
  }, [build.slug]);

  // Timer
  useEffect(() => {
    if (status !== "running") return;
    const iv = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(iv);
  }, [status]);

  // Auto-scroll
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, bootText]);

  const isComplete = status === "complete";

  return (
    <div className="flex flex-col h-full hud-scanline">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b" style={{ borderColor: DIM }}>
        <button onClick={onBack} className="text-[10px] tracking-wider active:opacity-60" style={{ color: `${CYAN}40` }}>
          ← ESC
        </button>
        <span className="text-[9px] tracking-[0.3em]" style={{ color: `${CYAN}25` }}>CL BUILD SYSTEM</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full hud-dot-pulse" style={{ color: isComplete ? GREEN : AMBER, background: isComplete ? GREEN : AMBER }} />
          <span className="text-[9px] tracking-wider" style={{ color: isComplete ? GREEN : AMBER }}>
            {isComplete ? "COMPLETE" : "BUILDING"}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-[2px] relative" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div
          className={status === "running" ? "hud-progress-bar" : ""}
          style={{
            position: "absolute", inset: 0, width: `${pct}%`,
            background: isComplete ? GREEN : undefined,
            transition: "width 1s ease-out",
          }}
        />
      </div>

      {/* Client */}
      <div className="px-4 pt-4 pb-2">
        <HudLabel>Target</HudLabel>
        <h1 className="text-xl font-bold mt-0.5 tracking-tight" style={{
          textShadow: isComplete ? `0 0 20px ${GREEN}30` : "none",
        }}>
          {build.clientName}
        </h1>
        <p className="text-[11px] mt-0.5" style={{ color: `${CYAN}25` }}>{build.slug}.vercel.app</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-2">
        <HudBox label="Time" value={fmt(elapsed)} />
        <HudBox label="Phase" value={isComplete ? "DONE" : PHASES[phase]?.short ?? "—"} />
        <HudBox label="Progress" value={`${pct}%`} color={isComplete ? GREEN : CYAN} />
      </div>

      {/* Phase bar */}
      <div className="flex items-center gap-0.5 px-4 pb-2">
        {PHASES.map((p, i) => {
          const done = i < phase || isComplete;
          const active = i === phase && !isComplete;
          return (
            <div key={p.id} className="flex-1 flex flex-col items-center gap-0.5">
              <div className={`w-full h-1 rounded-full transition-all duration-500 ${active ? "hud-glow" : ""}`}
                style={{ background: done ? `${GREEN}70` : active ? `${AMBER}70` : DIM }}
              />
              <span className="text-[6px] tracking-wider" style={{
                color: active ? AMBER : done ? `${GREEN}40` : "transparent",
              }}>{p.short}</span>
            </div>
          );
        })}
      </div>

      {/* Terminal */}
      <div className="flex-1 mx-4 mb-2 overflow-hidden flex flex-col" style={{
        border: `1px solid ${isComplete ? `${GREEN}20` : `${CYAN}10`}`,
        ...(isComplete ? { animation: "hud-success-flash 1.5s ease-out" } : {}),
      }}>
        <div className="px-3 py-1 flex items-center gap-1.5 shrink-0" style={{ borderBottom: `1px solid ${DIM}`, background: "rgba(255,255,255,0.015)" }}>
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: "#FF5F5660" }} />
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: "#FFBD2E60" }} />
          <span className="w-[5px] h-[5px] rounded-full" style={{ background: "#27C93F60" }} />
          <span className="text-[8px] ml-1.5 tracking-wider" style={{ color: "rgba(255,255,255,0.12)" }}>build.log</span>
          {status === "running" && (
            <div className="ml-auto w-2 h-2 border border-t-transparent rounded-full animate-spin" style={{ borderColor: `${AMBER}40`, borderTopColor: "transparent" }} />
          )}
        </div>
        <div ref={logRef} className="flex-1 p-3 overflow-y-auto" style={{ background: "#08080C" }}>
          <pre className="text-[10px] leading-relaxed whitespace-pre-wrap break-all" style={{ color: `${CYAN}50` }}>
            {bootText}
            {!bootDone && <span className="hud-cursor" style={{ color: CYAN }}>█</span>}
          </pre>
          {bootDone && <div className="text-[10px] my-1 select-none" style={{ color: "rgba(255,255,255,0.06)" }}>════════════════════════════════════</div>}
          {bootDone && log && (
            <pre className="text-[10px] leading-relaxed whitespace-pre-wrap break-all" style={{ color: `${GREEN}60` }}>
              {log}
              {status === "running" && <span className="hud-cursor" style={{ color: GREEN }}>█</span>}
            </pre>
          )}
          {bootDone && !log && status === "running" && (
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.12)" }}>
              <span className="hud-cursor" style={{ color: `${CYAN}30` }}>█</span> awaiting output...
            </span>
          )}
          {isComplete && (
            <div className="mt-2 text-[10px]">
              <div className="select-none" style={{ color: "rgba(255,255,255,0.06)" }}>════════════════════════════════════</div>
              <p className="mt-1" style={{ color: GREEN, textShadow: `0 0 8px ${GREEN}40` }}>{">"} BUILD COMPLETE — ALL SYSTEMS GREEN</p>
              <p className="mt-0.5" style={{ color: `${GREEN}50` }}>{">"} https://{build.slug}.vercel.app</p>
            </div>
          )}
        </div>
      </div>

      {/* System bar */}
      <div className="px-4 py-1 flex items-center justify-between text-[7px] tracking-wider" style={{ color: "rgba(255,255,255,0.08)", borderTop: `1px solid ${DIM}` }}>
        <span>VPS 46.225.88.110</span>
        <span>NODE {status === "running" ? "ACTIVE" : "IDLE"}</span>
        <span>4GB</span>
        <span>EU-CENTRAL</span>
      </div>

      {/* CTA */}
      {isComplete && (
        <div className="px-4 pb-3 pt-1 space-y-2">
          <a
            href={`https://${build.slug}.vercel.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-11 text-sm tracking-wider font-bold active:opacity-80 transition-opacity"
            style={{ background: `${GREEN}10`, border: `1px solid ${GREEN}30`, color: GREEN, textShadow: `0 0 10px ${GREEN}40` }}
          >
            OPEN LIVE SITE →
          </a>
          <button onClick={onBack} className="w-full h-9 text-[10px] tracking-wider active:opacity-60" style={{ color: "rgba(255,255,255,0.15)" }}>
            ← BACK
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════ */

export default function JarvisApp() {
  const [view, setView] = useState<View>("login");
  const [checking, setChecking] = useState(true);
  const [build, setBuild] = useState<ActiveBuild | null>(null);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then(res => { if (res.ok) setView("inbox"); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-[10px] tracking-wider" style={{ color: `${CYAN}30` }}>CONNECTING...</span>
      </div>
    );
  }

  if (view === "login") {
    return <LoginView onAuth={() => setView("inbox")} />;
  }

  if (view === "build" && build) {
    return (
      <div className="fixed inset-0 bg-[#050508] flex flex-col z-50"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <BuildView build={build} onBack={() => { setBuild(null); setView("inbox"); }} />
      </div>
    );
  }

  const tab = view === "inbox" || view === "build" ? "inbox" : view;

  return (
    <div className="min-h-screen flex flex-col hud-scanline"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>

      {/* Top bar */}
      <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderBottom: `1px solid ${DIM}` }}>
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${CYAN}25` }}>JARVIS</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: GREEN }} />
          <span className="text-[8px] tracking-wider" style={{ color: `${GREEN}50` }}>ONLINE</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {tab === "inbox" && (
          <InboxView onBuild={b => { setBuild(b); setView("build"); }} />
        )}
        {tab === "projects" && <ProjectsView />}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 flex" style={{
        background: "#050508", borderTop: `1px solid ${DIM}`,
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {(["inbox", "projects"] as const).map(t => (
          <button
            key={t}
            onClick={() => setView(t)}
            className="flex-1 py-3 text-center text-[9px] tracking-[0.2em] uppercase transition-colors"
            style={{ color: tab === t ? CYAN : "rgba(255,255,255,0.15)" }}
          >
            {t === "inbox" ? "▧ BRIEFS" : "◈ SYSTEMS"}
          </button>
        ))}
        <button
          onClick={async () => {
            await fetch("/api/dashboard/auth", { method: "DELETE" });
            setView("login");
          }}
          className="flex-1 py-3 text-center text-[9px] tracking-[0.2em] uppercase"
          style={{ color: "rgba(255,255,255,0.1)" }}
        >
          ⏻ EXIT
        </button>
      </div>
    </div>
  );
}
