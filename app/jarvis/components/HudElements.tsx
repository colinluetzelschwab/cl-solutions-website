"use client";

/**
 * JARVIS UI primitives — modern dark master dashboard.
 *
 * Design language:
 *   - Geist sans for UI + numbers, Geist Mono for IDs / timestamps / slugs.
 *   - No serif anywhere (Instrument Serif is reserved for the public
 *     marketing site; this is a working surface, not a headline).
 *   - Sentence case throughout (no SCREAMING_LABELS).
 *   - Subtle borders + warm-dark surfaces (#0a0a0a base).
 *   - Brand red (#dc2222) for accent, not cyan.
 *   - No corner brackets, no scanlines, no left-bar accents on cards.
 *   - Rounded geometry, generous padding, tight headline tracking.
 *
 * Use the CSS vars directly: `var(--jarvis-accent)`,
 * `var(--jarvis-text-secondary)`, etc.
 */

import { SURFACES, SURFACE_GROUPS, MOBILE_PRIMARY_SURFACES, MOBILE_OVERFLOW_SURFACES } from "../lib/constants";
import type { Surface, Tab } from "../lib/types";
import { useState } from "react";

/* ── Reusable token strings (so JSX stays compact) ───────── */
const T = {
  accent:        "var(--jarvis-accent)",
  accentBg:      "var(--jarvis-accent-bg)",
  accentBorder:  "var(--jarvis-accent-border)",
  success:       "var(--jarvis-success)",
  warning:       "var(--jarvis-warning)",
  error:         "var(--jarvis-error)",
  info:          "var(--jarvis-info)",
  surface1:      "var(--jarvis-surface-1)",
  surface2:      "var(--jarvis-surface-2)",
  surface3:      "var(--jarvis-surface-3)",
  borderSubtle:  "var(--jarvis-border-subtle)",
  border:        "var(--jarvis-border)",
  borderStrong:  "var(--jarvis-border-strong)",
  textPrimary:   "var(--jarvis-text-primary)",
  textSecondary: "var(--jarvis-text-secondary)",
  textMuted:     "var(--jarvis-text-muted)",
  textFaint:     "var(--jarvis-text-faint)",
} as const;

/* ── Section divider ─────────────────────────────────────── */

export function HudLine() {
  return <div className="h-px w-full" style={{ background: T.borderSubtle }} />;
}

/* ── Quiet label (sentence case, low contrast) ───────────── */

export function HudLabel({ children }: { children: string }) {
  return (
    <span
      className="text-[12px] font-medium"
      style={{ color: T.textMuted, letterSpacing: "0.01em" }}
    >
      {children}
    </span>
  );
}

/* ── Big stat tile — bold sans, tight tracking, tabular figures ── */

export function HudBox({ label, value, color, trend }: { label: string; value: string; color?: string; trend?: string }) {
  return (
    <div
      className="rounded-xl p-5 transition-colors"
      style={{ background: T.surface1, border: `1px solid ${T.borderSubtle}` }}
    >
      <p className="text-[11px] font-medium" style={{ color: T.textMuted }}>{label}</p>
      <p
        className="mt-2 tabular-nums text-[32px] font-semibold"
        style={{
          color: color ?? T.textPrimary,
          letterSpacing: "-0.025em",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      {trend && (
        <p className="mt-1 text-[11px]" style={{ color: T.textMuted }}>{trend}</p>
      )}
    </div>
  );
}

/* ── Pill: tinted bg, no border, slight uppercase only for status ── */

export function HudBadge({ label, color, dot = false }: { label: string; color: string; dot?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap"
      style={{ background: `${color}1a`, color: color }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      <span>{label}</span>
    </span>
  );
}

/* ── Card: subtle bg, no left-bar, rounded ───────────────── */

export function HudCard({
  children, active, onClick, className = "",
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <div
      onClick={onClick}
      className={`rounded-xl p-4 transition-colors ${onClick ? "cursor-pointer hover:bg-white/[0.04] active:scale-[0.995]" : ""} ${className}`}
      style={{
        background: active ? T.accentBg : T.surface1,
        border: `1px solid ${active ? T.accentBorder : T.borderSubtle}`,
      }}
    >
      {children}
    </div>
  );
}

/* ── Empty state ─────────────────────────────────────────── */

export function HudEmpty({ message, hint }: { message: string; hint?: string }) {
  return (
    <div className="py-20 text-center">
      <p className="text-base" style={{ color: T.textMuted }}>{message}</p>
      {hint && <p className="text-[13px] mt-2" style={{ color: T.textFaint }}>{hint}</p>}
    </div>
  );
}

/* ── Skeleton ─────────────────────────────────────────────── */

export function HudSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: T.surface1 }} />
      ))}
    </div>
  );
}

/* ── Page header — big editorial heading per tab ─────────── */

export function PageHeader({
  title, subtitle, accentWord, action,
}: {
  title: string;
  subtitle?: string;
  /** Optional: kept for back-compat — no longer changes the visual; titles
   *  are uniformly bold sans now. Accent emphasis is via color only. */
  accentWord?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-8">
      <div className="min-w-0">
        <h1
          className="text-[28px] lg:text-[32px] font-semibold"
          style={{ color: T.textPrimary, letterSpacing: "-0.03em", lineHeight: 1.05 }}
        >
          {title.replace(/\.$/, "")}
        </h1>
        {subtitle && (
          <p className="text-[14px] mt-2" style={{ color: T.textSecondary }}>{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
  void accentWord;
}

/* ── Top header bar ──────────────────────────────────────── */

export function HudHeader({ hasActiveBuild, unreadInbox, onCommandBar }: { hasActiveBuild: boolean; unreadInbox?: number; onCommandBar?: () => void }) {
  return (
    <header
      className="px-6 lg:px-12 py-4 flex items-center justify-between"
      style={{ borderBottom: `1px solid ${T.borderSubtle}` }}
    >
      <div className="flex items-baseline gap-3">
        <span
          className="text-[18px] font-semibold"
          style={{ color: T.textPrimary, letterSpacing: "-0.03em" }}
        >
          Jarvis
        </span>
        <span className="jarvis-mono text-[11px]" style={{ color: T.textFaint }}>v2.0</span>
      </div>
      <div className="flex items-center gap-4">
        {!!unreadInbox && unreadInbox > 0 && (
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />
            <span className="text-[12px] font-medium" style={{ color: T.textSecondary }}>{unreadInbox} unread</span>
          </span>
        )}
        {onCommandBar && (
          <button
            onClick={onCommandBar}
            className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors"
            style={{
              background: T.surface1,
              border: `1px solid ${T.borderSubtle}`,
              color: T.textMuted,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = T.surface2)}
            onMouseLeave={e => (e.currentTarget.style.background = T.surface1)}
            title="Command palette (⌘K)"
          >
            <span className="text-[12px]">Search · run command</span>
            <kbd className="jarvis-mono text-[10px] px-1.5 py-0.5 rounded" style={{ background: T.surface2, color: T.textFaint }}>⌘K</kbd>
          </button>
        )}
        {hasActiveBuild && (
          <span className="inline-flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full hud-dot-pulse"
              style={{ color: T.warning, background: T.warning }}
            />
            <span className="text-[12px] font-medium" style={{ color: T.warning }}>Building</span>
          </span>
        )}
        <span className="inline-flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.success }} />
          <span className="text-[12px]" style={{ color: T.textSecondary }}>Online</span>
        </span>
      </div>
    </header>
  );
}

/* ── Mobile bottom tab bar (5 primary + overflow drawer) ── */

export function HudTabBar({
  active, onChange, hasLiveDot, unreadInbox,
}: { active: Tab; onChange: (t: Surface) => void; hasLiveDot: boolean; unreadInbox?: number }) {
  const [showOverflow, setShowOverflow] = useState(false);
  const surfaceById = Object.fromEntries(SURFACES.map(s => [s.id, s]));

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 flex md:hidden"
        style={{
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
          borderTop: `1px solid ${T.borderSubtle}`,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {MOBILE_PRIMARY_SURFACES.map(id => {
          const s = surfaceById[id];
          if (!s) return null;
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex-1 min-w-[60px] py-3 flex flex-col items-center gap-1 transition-colors relative"
            >
              <span className="text-[15px]" style={{ color: isActive ? T.accent : T.textFaint }}>{s.icon}</span>
              <span className="text-[10px] font-medium" style={{ color: isActive ? T.textPrimary : T.textMuted }}>
                {s.label.toLowerCase()}
              </span>
              {id === "ops" && hasLiveDot && (
                <span className="absolute top-2 right-1/4 w-1.5 h-1.5 rounded-full hud-dot-pulse" style={{ background: T.warning }} />
              )}
              {id === "inbox" && !!unreadInbox && unreadInbox > 0 && (
                <span className="absolute top-2 right-1/4 w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />
              )}
            </button>
          );
        })}
        <button
          onClick={() => setShowOverflow(true)}
          className="flex-1 min-w-[60px] py-3 flex flex-col items-center gap-1"
        >
          <span className="text-[15px]" style={{ color: T.textFaint }}>···</span>
          <span className="text-[10px] font-medium" style={{ color: T.textMuted }}>more</span>
        </button>
      </nav>

      {showOverflow && (
        <div
          className="fixed inset-0 z-50 md:hidden flex items-end"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowOverflow(false)}
        >
          <div
            className="w-full p-5 rounded-t-2xl"
            style={{ background: "#0a0a0a", border: `1px solid ${T.borderSubtle}` }}
            onClick={e => e.stopPropagation()}
          >
            <p className="text-[11px] mb-3" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>MORE</p>
            <div className="space-y-1">
              {MOBILE_OVERFLOW_SURFACES.map(id => {
                const s = surfaceById[id];
                if (!s) return null;
                return (
                  <button
                    key={id}
                    onClick={() => { onChange(id); setShowOverflow(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left"
                    style={{ background: T.surface1, color: T.textPrimary }}
                  >
                    <span className="text-[15px]" style={{ color: T.textMuted }}>{s.icon}</span>
                    <span className="text-[13px] font-medium">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sidebar — grouped sections, pill-active, sentence case ─ */

export function HudSidebar({
  active, onChange, hasLiveDot, unreadInbox,
}: { active: Tab; onChange: (s: Surface) => void; hasLiveDot: boolean; unreadInbox?: number }) {
  const surfaceById = Object.fromEntries(SURFACES.map(s => [s.id, s]));

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 h-screen"
      style={{ borderRight: `1px solid ${T.borderSubtle}`, background: "#080808" }}
    >
      {/* Wordmark */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-baseline gap-2">
          <span
            className="text-[22px] font-semibold"
            style={{ color: T.textPrimary, letterSpacing: "-0.03em" }}
          >
            Jarvis
          </span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.accent }} />
        </div>
        <p className="text-[12px] mt-1.5" style={{ color: T.textMuted }}>
          CL Solutions command center
        </p>
      </div>
      <HudLine />

      {/* Surfaces */}
      <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
        {SURFACE_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx}>
            {group.label && (
              <p
                className="px-3 mb-2 text-[10px] font-semibold uppercase"
                style={{ color: T.textFaint, letterSpacing: "0.12em" }}
              >
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.surfaces.map(id => {
                const s = surfaceById[id];
                if (!s) return null;
                const isActive = active === id;
                return (
                  <button
                    key={id}
                    onClick={() => onChange(id)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all"
                    style={{
                      background: isActive ? T.accentBg : "transparent",
                      color: isActive ? T.textPrimary : T.textSecondary,
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = T.surface1; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <span className="text-[14px] w-4 text-center" style={{ color: isActive ? T.accent : T.textMuted }}>
                      {s.icon}
                    </span>
                    <span className="text-[13px] font-medium flex-1">{s.label}</span>
                    {id === "ops" && hasLiveDot && (
                      <span className="w-1.5 h-1.5 rounded-full hud-dot-pulse" style={{ background: T.warning }} />
                    )}
                    {id === "inbox" && !!unreadInbox && unreadInbox > 0 && (
                      <span className="text-[10px] tabular-nums px-1.5 py-0.5 rounded-md" style={{ background: T.accent, color: "#fff" }}>{unreadInbox}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 jarvis-mono text-[10px]" style={{ color: T.textFaint, borderTop: `1px solid ${T.borderSubtle}` }}>
        VPS · 46.225.88.110
      </div>
    </aside>
  );
}
