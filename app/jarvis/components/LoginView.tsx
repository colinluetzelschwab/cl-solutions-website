"use client";

import { useState, useEffect, useRef } from "react";
import { C } from "../lib/constants";
import { HudLine, HudLabel } from "./HudElements";

export default function LoginView({ onAuth }: { onAuth: (pw: string) => Promise<boolean> }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const lines = [
      "> JARVIS v2.0 — CL Solutions Build System",
      "> Establishing secure connection...",
      "> VPS 46.225.88.110 — ONLINE",
      "> Build pipeline — READY",
      "> Awaiting authentication...",
    ];
    const timers = lines.map((line, idx) =>
      setTimeout(() => {
        setBootLines(prev => [...prev, line]);
        if (idx === lines.length - 1) inputRef.current?.focus();
      }, (idx + 1) * 250)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const submit = async () => {
    if (!pw.trim() || loading) return;
    setLoading(true);
    setErr("");
    const ok = await onAuth(pw);
    if (!ok) {
      setErr("ACCESS DENIED");
      setBootLines(prev => [...prev, "> ERROR: Invalid credentials"]);
    } else {
      setBootLines(prev => [...prev, "> ACCESS GRANTED"]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 hud-scanline" style={{ paddingTop: "env(safe-area-inset-top)" }}>
      <div className="w-full max-w-md space-y-8 hud-boot">
        <div className="space-y-1.5">
          {bootLines.map((line, i) => (
            <p key={i} className="text-xs lg:text-sm" style={{
              color: line.includes("GRANTED") ? C.success : line.includes("ERROR") ? C.error : `${C.primary}70`,
              textShadow: line.includes("GRANTED") ? `0 0 12px ${C.success}50` : "none",
            }}>
              {line}
            </p>
          ))}
          {bootLines.length < 5 && <span className="hud-cursor" style={{ color: `${C.primary}50` }}>█</span>}
        </div>

        {bootLines.length >= 5 && (
          <div className="space-y-4">
            <HudLine />
            <div>
              <HudLabel>Authentication Required</HudLabel>
              <div className="flex gap-2 mt-3">
                <input
                  ref={inputRef}
                  type="password"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && submit()}
                  placeholder="password"
                  className="flex-1 bg-transparent border px-4 py-3 text-sm lg:text-base outline-none font-mono"
                  style={{ borderColor: err ? `${C.error}60` : `${C.primary}25`, color: C.primary }}
                />
                <button
                  onClick={submit}
                  disabled={loading}
                  className="px-5 py-3 text-xs lg:text-sm tracking-wider font-bold disabled:opacity-30 transition-opacity"
                  style={{ background: `${C.primary}18`, color: C.primary, border: `1px solid ${C.primary}35` }}
                >
                  {loading ? "..." : "AUTH"}
                </button>
              </div>
              {err && <p className="text-[11px] lg:text-xs mt-2 font-medium" style={{ color: C.error }}>{err}</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
