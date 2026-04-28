"use client";

/**
 * ⌘K command palette. Single-action invocations across surfaces.
 * Wraps the cmdk lib with our palette of {COMMANDS}.
 */

import { useState, useEffect, useCallback } from "react";
import { Command } from "cmdk";
import { COMMANDS, type JarvisCommand } from "../lib/commands";
import type { Surface } from "../lib/types";

const T = {
  bg: "#0a0a0a",
  surface1: "var(--jarvis-surface-1)",
  surface2: "var(--jarvis-surface-2)",
  border: "var(--jarvis-border-subtle)",
  text: "var(--jarvis-text-primary)",
  textMuted: "var(--jarvis-text-muted)",
  textFaint: "var(--jarvis-text-faint)",
  accent: "var(--jarvis-accent)",
  accentBg: "var(--jarvis-accent-bg)",
};

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  surface: Surface;
  onNavigate: (s: Surface) => void;
}

export default function CommandBar({ open, setOpen, surface, onNavigate }: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  // Filter commands by surface scope (empty surfaces = always visible).
  const visible = COMMANDS.filter(c => !c.surfaces || c.surfaces.includes(surface));

  // Group by category.
  const grouped = visible.reduce<Record<string, JarvisCommand[]>>((acc, c) => {
    (acc[c.group] ||= []).push(c);
    return acc;
  }, {});

  const run = useCallback(async (cmd: JarvisCommand) => {
    if (cmd.confirm && !window.confirm(cmd.confirm)) return;
    if (cmd.navigate) {
      const target = typeof cmd.navigate === "string" ? cmd.navigate : cmd.navigate.surface;
      onNavigate(target);
      setOpen(false);
      return;
    }
    if (cmd.href) {
      window.open(cmd.href, "_blank", "noopener,noreferrer");
      setOpen(false);
      return;
    }
    if (!cmd.endpoint) {
      setToast({ text: `${cmd.label}: nothing to do`, ok: false });
      return;
    }

    setBusy(cmd.id);
    try {
      const res = await fetch(cmd.endpoint, {
        method: cmd.method ?? "POST",
        headers: cmd.body ? { "Content-Type": "application/json" } : undefined,
        body: cmd.body ? JSON.stringify(cmd.body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const detail = data.status ? ` · ${data.status}${data.detail ? ` (${data.detail})` : ""}` : "";
        setToast({ text: `${cmd.label}${detail}`, ok: true });
        setOpen(false);
      } else {
        setToast({ text: `${cmd.label} failed: ${data.error ?? res.statusText}`, ok: false });
      }
    } catch (e) {
      setToast({ text: `${cmd.label} error: ${e instanceof Error ? e.message : "network"}`, ok: false });
    } finally {
      setBusy(null);
      setTimeout(() => setToast(null), 4000);
    }
  }, [onNavigate, setOpen]);

  // Close on Escape (cmdk does this, but be explicit).
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  if (!open && !toast) return null;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={() => setOpen(false)}
        >
          <Command
            label="JARVIS command palette"
            className="w-full max-w-[640px] mx-4 rounded-xl overflow-hidden"
            style={{ background: T.bg, border: `1px solid ${T.border}`, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
              <Command.Input
                placeholder="Type a command or search…"
                className="w-full bg-transparent outline-none text-[15px]"
                style={{ color: T.text }}
                autoFocus
              />
            </div>
            <Command.List className="max-h-[420px] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-8 text-center text-[13px]" style={{ color: T.textFaint }}>
                No commands match.
              </Command.Empty>
              {Object.entries(grouped).map(([group, cmds]) => (
                <Command.Group key={group} heading={group} className="mb-2">
                  <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase" style={{ color: T.textFaint, letterSpacing: "0.12em" }}>
                    {group}
                  </p>
                  {cmds.map(c => (
                    <Command.Item
                      key={c.id}
                      value={`${c.label} ${(c.keywords ?? []).join(" ")}`}
                      onSelect={() => run(c)}
                      className="flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-[13px]"
                      style={{ color: T.text }}
                    >
                      <span className="flex flex-col">
                        <span>{c.label}</span>
                        {c.hint && <span className="text-[11px]" style={{ color: T.textMuted }}>{c.hint}</span>}
                      </span>
                      {busy === c.id && <span className="text-[10px]" style={{ color: T.accent }}>running…</span>}
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
            <div className="px-4 py-2 flex items-center justify-between text-[11px]" style={{ borderTop: `1px solid ${T.border}`, color: T.textFaint }}>
              <span>↑↓ to move</span>
              <span>↵ to run · ⎋ to close</span>
            </div>
          </Command>
        </div>
      )}

      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[101] px-4 py-3 rounded-lg text-[13px] max-w-[480px]"
          style={{
            background: T.bg,
            border: `1px solid ${toast.ok ? "rgba(52,211,153,0.4)" : "rgba(248,113,113,0.4)"}`,
            color: toast.ok ? "var(--jarvis-success)" : "var(--jarvis-error)",
          }}
        >
          {toast.text}
        </div>
      )}
    </>
  );
}
