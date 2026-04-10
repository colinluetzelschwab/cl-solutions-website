"use client";

import { useState, useEffect, useRef } from "react";
import { C, PHASES, fmt } from "../lib/constants";
import { HudBox, HudLabel } from "./HudElements";

interface BuildTerminalProps {
  slug: string;
  clientName: string;
  log: string;
  phase: number;
  status: "running" | "complete" | "error" | "idle";
  elapsed: number;
  onBack?: () => void;
}

export default function BuildTerminal({ slug, clientName, log, phase, status, elapsed, onBack }: BuildTerminalProps) {
  const [bootText, setBootText] = useState("");
  const [bootDone, setBootDone] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const pct = status === "complete" ? 100 : Math.round(((phase + 0.5) / PHASES.length) * 100);
  const isComplete = status === "complete";

  // Boot typing
  useEffect(() => {
    const txt = `> INITIALIZING BUILD SEQUENCE...\n> TARGET: ${slug}.vercel.app\n> CLIENT: ${clientName}\n> STATUS: ONLINE\n`;
    let i = 0;
    const iv = setInterval(() => {
      if (i <= txt.length) { setBootText(txt.slice(0, i)); i++; }
      else { clearInterval(iv); setBootDone(true); }
    }, 15);
    return () => clearInterval(iv);
  }, [slug, clientName]);

  // Auto-scroll
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log, bootText]);

  return (
    <div className="flex flex-col h-full hud-scanline">
      {/* Header */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-2.5 border-b" style={{ borderColor: C.border }}>
        {onBack && (
          <button onClick={onBack} className="text-[10px] lg:text-xs tracking-wider active:opacity-60 font-medium" style={{ color: `${C.primary}50` }}>
            ← ESC
          </button>
        )}
        <span className="text-[10px] lg:text-xs tracking-[0.3em]" style={{ color: `${C.primary}30` }}>CL BUILD SYSTEM</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full hud-dot-pulse" style={{ color: isComplete ? C.success : C.warning, background: isComplete ? C.success : C.warning }} />
          <span className="text-[10px] lg:text-xs tracking-wider font-medium" style={{ color: isComplete ? C.success : C.warning }}>
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
            background: isComplete ? C.success : undefined,
            transition: "width 1s ease-out",
          }}
        />
      </div>

      {/* Client + Metrics */}
      <div className="px-4 lg:px-6 pt-4 lg:pt-5 pb-3">
        <HudLabel>Target</HudLabel>
        <h1 className="text-xl lg:text-2xl font-bold mt-1 tracking-tight" style={{
          textShadow: isComplete ? `0 0 20px ${C.success}30` : "none",
        }}>
          {clientName}
        </h1>
        <p className="text-xs lg:text-sm mt-1" style={{ color: `${C.primary}30` }}>{slug}.vercel.app</p>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 lg:px-6 pb-3">
        <HudBox label="Time" value={fmt(elapsed)} />
        <HudBox label="Phase" value={isComplete ? "DONE" : PHASES[phase]?.short ?? "—"} />
        <HudBox label="Progress" value={`${pct}%`} color={isComplete ? C.success : C.primary} />
      </div>

      {/* Phase bar */}
      <div className="flex items-center gap-1 px-4 lg:px-6 pb-3">
        {PHASES.map((p, i) => {
          const done = i < phase || isComplete;
          const active = i === phase && !isComplete;
          return (
            <div key={p.id} className="flex-1 flex flex-col items-center gap-1">
              <div className={`w-full h-1.5 lg:h-2 rounded-full transition-all duration-500 ${active ? "hud-glow" : ""}`}
                style={{ background: done ? `${C.success}80` : active ? `${C.warning}80` : C.dim }}
              />
              <span className="text-[7px] lg:text-[9px] tracking-wider font-medium" style={{
                color: active ? C.warning : done ? `${C.success}50` : "transparent",
              }}>{p.short}</span>
            </div>
          );
        })}
      </div>

      {/* Terminal window */}
      <div className="flex-1 mx-4 lg:mx-6 mb-3 overflow-hidden flex flex-col" style={{
        border: `1px solid ${isComplete ? `${C.success}25` : `${C.primary}12`}`,
        ...(isComplete ? { animation: "hud-success-flash 1.5s ease-out" } : {}),
      }}>
        <div className="px-3 py-1.5 flex items-center gap-2 shrink-0" style={{ borderBottom: `1px solid ${C.dim}`, background: "rgba(255,255,255,0.02)" }}>
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: "#FF5F5670" }} />
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: "#FFBD2E70" }} />
          <span className="w-[7px] h-[7px] rounded-full" style={{ background: "#27C93F70" }} />
          <span className="text-[9px] lg:text-[11px] ml-2 tracking-wider" style={{ color: "rgba(255,255,255,0.15)" }}>build.log — {slug}</span>
          {status === "running" && (
            <div className="ml-auto w-3 h-3 border border-t-transparent rounded-full animate-spin" style={{ borderColor: `${C.warning}50`, borderTopColor: "transparent" }} />
          )}
        </div>
        <div ref={logRef} className="flex-1 p-3 lg:p-4 overflow-y-auto" style={{ background: "#08080C" }}>
          <pre className="text-[11px] lg:text-xs leading-relaxed whitespace-pre-wrap break-all" style={{ color: `${C.primary}60` }}>
            {bootText}
            {!bootDone && <span className="hud-cursor" style={{ color: C.primary }}>█</span>}
          </pre>
          {bootDone && <div className="text-[11px] lg:text-xs my-2 select-none" style={{ color: "rgba(255,255,255,0.06)" }}>════════════════════════════════════════</div>}
          {bootDone && log && (
            <pre className="text-[11px] lg:text-xs leading-relaxed whitespace-pre-wrap break-all" style={{ color: `${C.success}70` }}>
              {log}
              {status === "running" && <span className="hud-cursor" style={{ color: C.success }}>█</span>}
            </pre>
          )}
          {bootDone && !log && status === "running" && (
            <span className="text-[11px] lg:text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
              <span className="hud-cursor" style={{ color: `${C.primary}40` }}>█</span> awaiting output...
            </span>
          )}
          {isComplete && (
            <div className="mt-3 text-[11px] lg:text-xs">
              <div className="select-none" style={{ color: "rgba(255,255,255,0.06)" }}>════════════════════════════════════════</div>
              <p className="mt-1 font-bold" style={{ color: C.success, textShadow: `0 0 10px ${C.success}50` }}>{">"} BUILD COMPLETE — ALL SYSTEMS GREEN</p>
              <p className="mt-0.5" style={{ color: `${C.success}60` }}>{">"} https://{slug}.vercel.app</p>
            </div>
          )}
        </div>
      </div>

      {/* System bar */}
      <div className="px-4 lg:px-6 py-1.5 flex items-center justify-between text-[8px] lg:text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.1)", borderTop: `1px solid ${C.dim}` }}>
        <span>VPS 46.225.88.110</span>
        <span>NODE {status === "running" ? "ACTIVE" : "IDLE"}</span>
        <span>4GB RAM</span>
        <span>EU-CENTRAL</span>
      </div>

      {/* CTA */}
      {isComplete && (
        <div className="px-4 lg:px-6 pb-4 pt-2 space-y-2">
          <a
            href={`https://${slug}.vercel.app`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 lg:h-14 text-sm lg:text-base tracking-wider font-bold active:opacity-80 transition-opacity"
            style={{ background: `${C.success}12`, border: `1px solid ${C.success}35`, color: C.success, textShadow: `0 0 12px ${C.success}50` }}
          >
            OPEN LIVE SITE →
          </a>
          {onBack && (
            <button onClick={onBack} className="w-full h-10 text-[11px] lg:text-xs tracking-wider active:opacity-60" style={{ color: "rgba(255,255,255,0.18)" }}>
              ← BACK
            </button>
          )}
        </div>
      )}
    </div>
  );
}
