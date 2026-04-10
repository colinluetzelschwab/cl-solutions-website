"use client";

import { C, TABS } from "../lib/constants";
import type { Tab } from "../lib/types";

export function HudLine() {
  return <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${C.primary}25, transparent)` }} />;
}

export function HudLabel({ children }: { children: string }) {
  return (
    <span className="text-[9px] lg:text-[11px] tracking-[0.3em] uppercase font-medium" style={{ color: `${C.primary}70` }}>
      {children}
    </span>
  );
}

export function HudBox({ label, value, color = C.primary }: { label: string; value: string; color?: string }) {
  return (
    <div className="relative p-3 lg:p-4" style={{ background: C.surface }}>
      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l" style={{ borderColor: `${C.primary}35` }} />
      <span className="absolute top-0 right-0 w-2 h-2 border-t border-r" style={{ borderColor: `${C.primary}35` }} />
      <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l" style={{ borderColor: `${C.primary}35` }} />
      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r" style={{ borderColor: `${C.primary}35` }} />
      <p className="text-[8px] lg:text-[10px] tracking-[0.2em] uppercase" style={{ color: `${C.primary}50` }}>{label}</p>
      <p className="text-lg lg:text-xl mt-0.5 tabular-nums font-bold" style={{ color, textShadow: `0 0 12px ${color}50` }}>{value}</p>
    </div>
  );
}

export function HudBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className="text-[9px] lg:text-[10px] px-2 py-0.5 font-semibold tracking-wider" style={{
      background: `${color}18`, color: `${color}CC`, border: `1px solid ${color}30`,
    }}>
      {label}
    </span>
  );
}

export function HudCard({ children, active, onClick, className = "" }: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative p-3 lg:p-4 transition-all duration-200 ${onClick ? "cursor-pointer active:scale-[0.98]" : ""} ${className}`}
      style={{
        background: active ? `${C.primary}08` : C.surface,
        borderLeft: `3px solid ${active ? C.primary : `${C.primary}15`}`,
      }}
    >
      {children}
    </div>
  );
}

export function HudEmpty({ message }: { message: string }) {
  return (
    <div className="py-16 lg:py-24 text-center">
      <span className="text-xs lg:text-sm tracking-wider" style={{ color: `${C.primary}20` }}>{message}</span>
    </div>
  );
}

export function HudSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-16 animate-pulse" style={{ background: C.surface }} />
      ))}
    </div>
  );
}

export function HudHeader({ hasActiveBuild }: { hasActiveBuild: boolean }) {
  return (
    <div className="px-4 lg:px-6 py-3 flex items-center justify-between" style={{ borderBottom: `1px solid ${C.border}` }}>
      <div className="flex items-center gap-2">
        <span className="text-sm lg:text-base font-bold tracking-[0.15em]" style={{ color: `${C.primary}90` }}>JARVIS</span>
        <span className="text-[8px] lg:text-[9px] tracking-wider" style={{ color: `${C.primary}25` }}>v2.0</span>
      </div>
      <div className="flex items-center gap-3">
        {hasActiveBuild && (
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full hud-dot-pulse" style={{ color: C.warning, background: C.warning }} />
            <span className="text-[9px] lg:text-[10px] tracking-wider" style={{ color: C.warning }}>BUILDING</span>
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: C.success }} />
          <span className="text-[9px] lg:text-[10px] tracking-wider" style={{ color: `${C.success}70` }}>ONLINE</span>
        </span>
      </div>
    </div>
  );
}

export function HudTabBar({ active, onChange, hasLiveDot }: { active: Tab; onChange: (t: Tab) => void; hasLiveDot: boolean }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex md:hidden" style={{
      background: C.bg, borderTop: `1px solid ${C.border}`,
      paddingBottom: "env(safe-area-inset-bottom)",
    }}>
      {TABS.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className="flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors relative"
        >
          <span className="text-sm" style={{ color: active === t.id ? C.primary : "rgba(255,255,255,0.15)" }}>{t.icon}</span>
          <span className="text-[8px] tracking-[0.15em]" style={{ color: active === t.id ? `${C.primary}80` : "rgba(255,255,255,0.12)" }}>
            {t.label}
          </span>
          {t.id === "live" && hasLiveDot && (
            <span className="absolute top-2 right-1/4 w-2 h-2 rounded-full hud-dot-pulse" style={{ color: C.warning, background: C.warning }} />
          )}
          {active === t.id && (
            <span className="absolute top-0 left-1/4 right-1/4 h-[2px]" style={{ background: C.primary }} />
          )}
        </button>
      ))}
    </div>
  );
}

export function HudSidebar({ active, onChange, hasLiveDot }: { active: Tab; onChange: (t: Tab) => void; hasLiveDot: boolean }) {
  return (
    <div className="hidden md:flex flex-col w-56 shrink-0 h-screen" style={{ borderRight: `1px solid ${C.border}`, background: "#08080C" }}>
      {/* Logo */}
      <div className="p-5 pb-3">
        <span className="text-lg font-bold tracking-[0.15em]" style={{ color: `${C.primary}90` }}>JARVIS</span>
        <p className="text-[9px] tracking-wider mt-0.5" style={{ color: `${C.primary}25` }}>CL Solutions Build System v2.0</p>
      </div>
      <HudLine />

      {/* Tabs */}
      <nav className="flex-1 p-3 space-y-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all relative"
            style={{
              background: active === t.id ? `${C.primary}10` : "transparent",
              borderLeft: `2px solid ${active === t.id ? C.primary : "transparent"}`,
            }}
          >
            <span className="text-base" style={{ color: active === t.id ? C.primary : "rgba(255,255,255,0.2)" }}>{t.icon}</span>
            <span className="text-[11px] tracking-[0.15em] font-medium" style={{
              color: active === t.id ? `${C.primary}90` : "rgba(255,255,255,0.3)",
            }}>
              {t.label}
            </span>
            {t.id === "live" && hasLiveDot && (
              <span className="w-2 h-2 rounded-full ml-auto hud-dot-pulse" style={{ color: C.warning, background: C.warning }} />
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 text-[8px] tracking-wider" style={{ color: "rgba(255,255,255,0.06)" }}>
        VPS 46.225.88.110 · EU-CENTRAL
      </div>
    </div>
  );
}
