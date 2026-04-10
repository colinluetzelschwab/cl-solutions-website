"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

interface BuildMonitorProps {
  slug: string;
  clientName: string;
  onBack: () => void;
}

const PHASES = [
  { id: "init", label: "SYSTEM INIT", short: "INIT" },
  { id: "research", label: "BRANCH RECON", short: "RECON" },
  { id: "generate", label: "SCAFFOLD", short: "SCFLD" },
  { id: "content", label: "CONTENT BUILD", short: "CNTNT" },
  { id: "images", label: "ASSET FETCH", short: "ASSET" },
  { id: "build", label: "COMPILE + QA", short: "BUILD" },
  { id: "deploy", label: "DEPLOY", short: "DPLOY" },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function HudBracket({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Corner brackets */}
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00F0FF]/30" />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00F0FF]/30" />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00F0FF]/30" />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00F0FF]/30" />
      {children}
    </div>
  );
}

export default function BuildMonitor({ slug, clientName, onBack }: BuildMonitorProps) {
  const [status, setStatus] = useState<"running" | "complete" | "error" | "not_found">("running");
  const [log, setLog] = useState("");
  const [elapsed, setElapsed] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [bootText, setBootText] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const [userScrolled, setUserScrolled] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);
  const startTime = useRef(Date.now());

  const progressPercent = status === "complete" ? 100 : Math.round(((activePhase + 0.5) / PHASES.length) * 100);

  // Boot typing effect
  useEffect(() => {
    const text = `> INITIALIZING BUILD SEQUENCE...\n> TARGET: ${slug}.vercel.app\n> CLIENT: ${clientName}\n> STATUS: ONLINE\n`;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= text.length) {
        setBootText(text.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
        setBootDone(true);
      }
    }, 18);
    return () => clearInterval(interval);
  }, [slug, clientName]);

  // Poll status every 4s
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/dashboard/build", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        const data = await res.json();
        if (data.log) {
          setLog(data.log);
          const l = data.log.toLowerCase();
          if (l.includes("deploy") || l.includes("vercel")) setActivePhase(6);
          else if (l.includes("build") || l.includes("qa") || l.includes("npm run")) setActivePhase(5);
          else if (l.includes("image") || l.includes("unsplash") || l.includes("curl")) setActivePhase(4);
          else if (l.includes("content") || l.includes("page.tsx") || l.includes("section")) setActivePhase(3);
          else if (l.includes("generat") || l.includes("template") || l.includes("scaffold")) setActivePhase(2);
          else if (l.includes("research") || l.includes("search") || l.includes("websearch")) setActivePhase(1);
          else setActivePhase(0);
        }
        if (data.status === "complete") setStatus("complete");
        else if (data.status === "not_found") setStatus("not_found");
      } catch {
        /* ignore */
      }
    };

    const interval = setInterval(poll, 4000);
    poll();
    return () => clearInterval(interval);
  }, [slug]);

  // Timer
  useEffect(() => {
    if (status !== "running") return;
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Auto-scroll log (unless user scrolled up)
  useEffect(() => {
    if (logRef.current && !userScrolled) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log, bootText, userScrolled]);

  const handleLogScroll = useCallback(() => {
    if (!logRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = logRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    setUserScrolled(!isAtBottom);
  }, []);

  const isComplete = status === "complete";

  return (
    <div
      className="fixed inset-0 z-50 bg-[#050508] flex flex-col hud-boot hud-scanline overflow-hidden"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* ═══ Top HUD Bar ═══ */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#00F0FF]/10">
        <button onClick={onBack} className="flex items-center gap-1.5 text-[#00F0FF]/40 text-xs font-mono active:text-[#00F0FF]/80">
          <ArrowLeft className="w-3.5 h-3.5" />
          ESC
        </button>
        <span className="text-[10px] font-mono tracking-[0.25em] text-[#00F0FF]/30 uppercase">
          CL Build System
        </span>
        <div className="flex items-center gap-2">
          {status === "running" && (
            <span className="flex items-center gap-1.5 text-[#FFB800] text-[10px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] hud-dot-pulse" />
              BUILDING
            </span>
          )}
          {isComplete && (
            <span className="flex items-center gap-1.5 text-[#00FF88] text-[10px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
              COMPLETE
            </span>
          )}
        </div>
      </div>

      {/* ═══ Progress Bar ═══ */}
      <div className="h-[2px] bg-white/[0.03] relative overflow-hidden">
        {status === "running" ? (
          <div className="absolute inset-y-0 left-0 hud-progress-bar" style={{ width: `${progressPercent}%`, transition: "width 1s ease-out" }} />
        ) : isComplete ? (
          <div className="absolute inset-0 bg-[#00FF88]/60" />
        ) : null}
      </div>

      {/* ═══ Client Header ═══ */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-[10px] font-mono tracking-[0.3em] text-[#00F0FF]/30 uppercase">Target</p>
        <h1 className="text-white text-xl font-mono font-bold mt-0.5 tracking-tight" style={{ textShadow: isComplete ? "0 0 20px rgba(0,255,136,0.3)" : "none" }}>
          {clientName}
        </h1>
        <p className="text-[#00F0FF]/25 text-[11px] font-mono mt-0.5">{slug}.vercel.app</p>
      </div>

      {/* ═══ Metrics Row ═══ */}
      <div className="grid grid-cols-3 gap-2 px-4 pb-3">
        <HudBracket className="bg-white/[0.02] p-2.5">
          <p className="text-[8px] font-mono text-[#00F0FF]/30 tracking-widest uppercase">Time</p>
          <p className="text-base font-mono text-[#00F0FF] mt-0.5 tabular-nums" style={{ textShadow: "0 0 10px rgba(0,240,255,0.3)" }}>
            {formatTime(elapsed)}
          </p>
        </HudBracket>
        <HudBracket className="bg-white/[0.02] p-2.5">
          <p className="text-[8px] font-mono text-[#00F0FF]/30 tracking-widest uppercase">Phase</p>
          <p className="text-base font-mono text-[#00F0FF] mt-0.5" style={{ textShadow: "0 0 10px rgba(0,240,255,0.3)" }}>
            {isComplete ? "DONE" : PHASES[activePhase]?.short ?? "—"}
          </p>
        </HudBracket>
        <HudBracket className="bg-white/[0.02] p-2.5">
          <p className="text-[8px] font-mono text-[#00F0FF]/30 tracking-widest uppercase">Progress</p>
          <p className="text-base font-mono mt-0.5 tabular-nums" style={{
            color: isComplete ? "#00FF88" : "#00F0FF",
            textShadow: isComplete ? "0 0 10px rgba(0,255,136,0.3)" : "0 0 10px rgba(0,240,255,0.3)"
          }}>
            {progressPercent}%
          </p>
        </HudBracket>
      </div>

      {/* ═══ Phase Timeline ═══ */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-0.5">
          {PHASES.map((phase, i) => {
            const isDone = i < activePhase || isComplete;
            const isActive = i === activePhase && !isComplete;

            return (
              <div key={phase.id} className="flex-1 flex flex-col items-center gap-1">
                {/* Bar segment */}
                <div className={`w-full h-1 rounded-full transition-all duration-500 ${
                  isDone ? "bg-[#00FF88]/70" :
                  isActive ? "bg-[#FFB800]/70 hud-glow" :
                  "bg-white/[0.06]"
                }`} />
                {/* Label (only show active) */}
                <span className={`text-[7px] font-mono tracking-wider transition-opacity duration-300 ${
                  isActive ? "text-[#FFB800] opacity-100" :
                  isDone ? "text-[#00FF88]/40 opacity-100" :
                  "text-white/10 opacity-0"
                }`}>
                  {phase.short}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Live Terminal ═══ */}
      <div className={`flex-1 mx-4 mb-2 overflow-hidden rounded border flex flex-col ${
        isComplete ? "border-[#00FF88]/20 hud-success-border" : "border-[#00F0FF]/10"
      }`}>
        {/* Terminal title bar */}
        <div className="px-3 py-1.5 border-b border-white/[0.04] flex items-center gap-2 bg-white/[0.02] shrink-0">
          <span className="w-[6px] h-[6px] rounded-full bg-[#FF5F56]/60" />
          <span className="w-[6px] h-[6px] rounded-full bg-[#FFBD2E]/60" />
          <span className="w-[6px] h-[6px] rounded-full bg-[#27C93F]/60" />
          <span className="text-[9px] text-white/15 font-mono ml-1.5 tracking-wider">build.log — {slug}</span>
          {status === "running" && <Loader2 className="w-2.5 h-2.5 text-[#FFB800]/40 animate-spin ml-auto" />}
        </div>
        {/* Terminal content */}
        <div
          ref={logRef}
          onScroll={handleLogScroll}
          className="flex-1 p-3 overflow-y-auto bg-[#08080C] relative"
        >
          {/* Boot sequence */}
          <pre className="text-[10px] text-[#00F0FF]/50 font-mono whitespace-pre-wrap leading-relaxed mb-1">
            {bootText}
            {!bootDone && <span className="hud-cursor text-[#00F0FF]">█</span>}
          </pre>

          {/* Separator after boot */}
          {bootDone && (
            <div className="text-[10px] text-white/[0.08] font-mono mb-2 select-none">
              ════════════════════════════════════
            </div>
          )}

          {/* Live log */}
          {bootDone && log && (
            <pre className="text-[10px] text-[#00FF88]/60 font-mono whitespace-pre-wrap break-all leading-relaxed">
              {log}
              {status === "running" && <span className="hud-cursor text-[#00FF88]">█</span>}
            </pre>
          )}

          {/* Waiting state */}
          {bootDone && !log && status === "running" && (
            <div className="flex items-center gap-2 text-white/15 text-[10px] font-mono mt-1">
              <span className="hud-cursor text-[#00F0FF]/30">█</span>
              awaiting output...
            </div>
          )}

          {/* Complete message */}
          {isComplete && (
            <div className="mt-3 text-[10px] font-mono">
              <div className="text-white/[0.08] select-none">════════════════════════════════════</div>
              <p className="text-[#00FF88] mt-1" style={{ textShadow: "0 0 8px rgba(0,255,136,0.4)" }}>
                {"> "}BUILD COMPLETE — ALL SYSTEMS GREEN
              </p>
              <p className="text-[#00FF88]/50 mt-0.5">
                {"> "}https://{slug}.vercel.app
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ═══ System Status Bar ═══ */}
      <div className="px-4 py-1.5 flex items-center justify-between text-[8px] font-mono text-white/[0.12] tracking-wider border-t border-white/[0.03]">
        <span>VPS 46.225.88.110</span>
        <span>NODE {status === "running" ? "ACTIVE" : "IDLE"}</span>
        <span>MEM 4GB</span>
        <span>HETZNER EU</span>
      </div>

      {/* ═══ Bottom CTA ═══ */}
      {isComplete && (
        <div className="px-4 pb-3 pt-1 space-y-2">
          <a
            href={`https://${slug}.vercel.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] font-mono text-sm font-bold tracking-wider active:opacity-80 transition-opacity"
            style={{ textShadow: "0 0 10px rgba(0,255,136,0.4)" }}
          >
            <ExternalLink className="w-4 h-4" />
            OPEN LIVE SITE
          </a>
          <button
            onClick={onBack}
            className="w-full h-10 text-white/20 text-[11px] font-mono tracking-wider active:text-white/40"
          >
            ← BACK TO INBOX
          </button>
        </div>
      )}
    </div>
  );
}
