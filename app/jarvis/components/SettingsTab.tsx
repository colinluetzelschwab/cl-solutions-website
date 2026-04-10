"use client";

import { C, LINKS } from "../lib/constants";
import { HudLabel, HudCard } from "./HudElements";

export default function SettingsTab({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="space-y-6">
      {/* Quick Links */}
      <div>
        <HudLabel>Quick Links</HudLabel>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          {LINKS.map(link => (
            <HudCard
              key={link.label}
              onClick={() => window.open(link.url, "_blank", "noopener")}
              className="flex items-center justify-between"
            >
              <span className="text-sm lg:text-base font-medium">{link.label}</span>
              <span className="text-[10px] lg:text-xs tracking-wider" style={{ color: `${C.primary}40` }}>OPEN →</span>
            </HudCard>
          ))}
        </div>
      </div>

      {/* VPS Config */}
      <div>
        <HudLabel>VPS Configuration</HudLabel>
        <div className="mt-3 p-4 space-y-2" style={{ background: C.surface }}>
          {[
            ["Host", "46.225.88.110:3333"],
            ["Provider", "Hetzner Cloud CPX22"],
            ["Region", "Nuremberg (nbg1-dc3)"],
            ["OS", "Ubuntu 24.04"],
            ["Node", "v24.14.1"],
            ["Claude Code", "v2.1.97"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-[10px] lg:text-xs tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>{label}</span>
              <span className="text-[11px] lg:text-xs tabular-nums font-mono" style={{ color: `${C.primary}50` }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={onLogout}
          className="w-full p-3 lg:p-4 text-sm lg:text-base font-medium tracking-wider active:opacity-60 transition-opacity text-center"
          style={{ background: `${C.error}08`, border: `1px solid ${C.error}20`, color: `${C.error}80` }}
        >
          ⏻ DISCONNECT
        </button>
      </div>

      {/* Version */}
      <p className="text-center text-[9px] lg:text-[10px] tracking-wider" style={{ color: "rgba(255,255,255,0.06)" }}>
        JARVIS v2.0 — CL Solutions Build System
      </p>
    </div>
  );
}
