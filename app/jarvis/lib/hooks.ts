"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Tab, BriefSummary, ProjectSummary, ActiveBuild, BuildHistoryEntry, VpsHealth } from "./types";

/* ═══ Tab persistence ═══ */

export function useTab(defaultTab: Tab = "briefs"): [Tab, (t: Tab) => void] {
  const [tab, setTabState] = useState<Tab>(defaultTab);

  useEffect(() => {
    const saved = localStorage.getItem("jarvis-tab") as Tab | null;
    if (saved && ["briefs", "live", "systems", "settings"].includes(saved)) {
      setTabState(saved);
    }
  }, []);

  const setTab = useCallback((t: Tab) => {
    setTabState(t);
    localStorage.setItem("jarvis-tab", t);
  }, []);

  return [tab, setTab];
}

/* ═══ Auth ═══ */

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then(res => { if (res.ok) setAuthed(true); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  const login = useCallback(async (password: string): Promise<boolean> => {
    const res = await fetch("/api/dashboard/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) { setAuthed(true); return true; }
    return false;
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/dashboard/auth", { method: "DELETE" }).catch(() => {});
    setAuthed(false);
  }, []);

  return { authed, checking, login, logout };
}

/* ═══ Briefs ═══ */

export function useBriefs() {
  const [briefs, setBriefs] = useState<BriefSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/briefs");
      if (res.ok) {
        const data = await res.json();
        setBriefs(data.briefs ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const updateStatus = useCallback(async (briefId: string, status: string, buildSlug?: string) => {
    await fetch("/api/dashboard/briefs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ briefId, status, buildSlug }),
    }).catch(() => {});
  }, []);

  return { briefs, loading, refresh, updateStatus };
}

/* ═══ Projects ═══ */

export function useProjects() {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { projects, loading, refresh };
}

/* ═══ VPS Health ═══ */

export function useVpsHealth() {
  const [health, setHealth] = useState<VpsHealth>({ status: "offline", uptime: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/dashboard/vps");
        if (res.ok) setHealth(await res.json());
      } catch { /* */ }
      setLoading(false);
    };
    poll();
    const iv = setInterval(poll, 30000);
    return () => clearInterval(iv);
  }, []);

  return { health, loading };
}

/* ═══ Build Status (polling) ═══ */

export function useBuildStatus(slug: string | null) {
  const [status, setStatus] = useState<"running" | "complete" | "error" | "idle">("idle");
  const [log, setLog] = useState("");
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!slug) { setStatus("idle"); setLog(""); setPhase(0); return; }
    setStatus("running");

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
  }, [slug]);

  return { status, log, phase };
}

/* ═══ Active Build (server-persisted via Vercel Blob — syncs across devices) ═══ */

export function useActiveBuild() {
  const [build, setBuild] = useState<ActiveBuild | null>(null);

  // Load from server on mount
  useEffect(() => {
    fetch("/api/dashboard/build-state")
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.activeBuild) setBuild(data.activeBuild); })
      .catch(() => {});
  }, []);

  const saveBuildState = useCallback(async (b: ActiveBuild | null) => {
    await fetch("/api/dashboard/build-state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeBuild: b }),
    }).catch(() => {});
  }, []);

  const startBuild = useCallback(async (briefUrl: string, clientName: string, briefId: string): Promise<ActiveBuild | null> => {
    try {
      const res = await fetch("/api/dashboard/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefUrl, clientName }),
      });
      const data = await res.json();
      if (data.success) {
        const b: ActiveBuild = { slug: data.slug, clientName, briefId, startedAt: new Date().toISOString() };
        setBuild(b);
        await saveBuildState(b);
        return b;
      }
    } catch { /* */ }
    return null;
  }, [saveBuildState]);

  const completeBuild = useCallback(async (status: "complete" | "failed") => {
    if (!build) return;
    // Add to history on server
    await fetch("/api/dashboard/build-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entry: {
          slug: build.slug,
          clientName: build.clientName,
          briefId: build.briefId,
          startedAt: build.startedAt,
          completedAt: new Date().toISOString(),
          status,
          duration: Math.floor((Date.now() - new Date(build.startedAt).getTime()) / 1000),
          deployUrl: status === "complete" ? `https://${build.slug}.vercel.app` : null,
        },
      }),
    }).catch(() => {});
    // Clear active
    setBuild(null);
    await saveBuildState(null);
  }, [build, saveBuildState]);

  const clearBuild = useCallback(async () => {
    setBuild(null);
    await saveBuildState(null);
  }, [saveBuildState]);

  return { build, startBuild, completeBuild, clearBuild };
}

/* ═══ Build History (server-persisted) ═══ */

export function useBuildHistory() {
  const [history, setHistory] = useState<BuildHistoryEntry[]>([]);

  useEffect(() => {
    fetch("/api/dashboard/build-state")
      .then(res => res.ok ? res.json() : null)
      .then(data => { if (data?.history) setHistory(data.history); })
      .catch(() => {});
  }, []);

  return history;
}

/* ═══ Media Query ═══ */

export function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(false);
  const ref = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      ref.current = e.matches;
      setDesktop(e.matches);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return desktop;
}
