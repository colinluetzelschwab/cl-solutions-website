"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { Tab, Surface, BriefSummary, ProjectSummary, ActiveBuild, BuildHistoryEntry, VpsHealth } from "./types";
import { LEGACY_TO_SURFACE } from "./types";
import type { InboxEvent } from "./inbox-types";
import type { DealList } from "./deals";

const ALL_SURFACES: Surface[] = ["today", "deals", "inbox", "agents", "ops", "money", "config"];
const ALL_LEGACY = Object.keys(LEGACY_TO_SURFACE);

/* ═══ Surface (was Tab) persistence ═══ */

export function useTab(defaultSurface: Surface = "today"): [Surface, (s: Surface) => void] {
  const [surface, setSurfaceState] = useState<Surface>(defaultSurface);

  useEffect(() => {
    const saved = localStorage.getItem("jarvis-tab") as Tab | null;
    if (!saved) return;
    if (ALL_SURFACES.includes(saved as Surface)) {
      setSurfaceState(saved as Surface);
    } else if (ALL_LEGACY.includes(saved)) {
      // Migrate legacy tab id to its new surface.
      const next = LEGACY_TO_SURFACE[saved as keyof typeof LEGACY_TO_SURFACE];
      if (next) {
        setSurfaceState(next);
        localStorage.setItem("jarvis-tab", next);
      }
    }
  }, []);

  const setSurface = useCallback((s: Surface) => {
    setSurfaceState(s);
    localStorage.setItem("jarvis-tab", s);
  }, []);

  return [surface, setSurface];
}

/* ═══ Inbox unread count + events ═══ */

export function useInbox() {
  const [events, setEvents] = useState<InboxEvent[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/inbox", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events ?? []);
        setUnread(data.unread ?? 0);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const iv = setInterval(refresh, 60000);
    return () => clearInterval(iv);
  }, [refresh]);

  const markRead = useCallback(async (id: string) => {
    setEvents(arr => arr.map(e => e.id === id ? { ...e, readAt: e.readAt ?? new Date().toISOString() } : e));
    setUnread(u => Math.max(0, u - 1));
    await fetch(`/api/dashboard/inbox?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "read" }),
    }).catch(() => {});
  }, []);

  const markAllRead = useCallback(async () => {
    const now = new Date().toISOString();
    setEvents(arr => arr.map(e => e.readAt ? e : { ...e, readAt: now }));
    setUnread(0);
    await fetch("/api/dashboard/inbox", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ op: "all-read" }),
    }).catch(() => {});
  }, []);

  return { events, unread, loading, refresh, markRead, markAllRead };
}

/* ═══ Deals projection ═══ */

export function useDeals() {
  const [list, setList] = useState<DealList | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/deals", { cache: "no-store" });
      if (res.ok) setList(await res.json());
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { list, loading, refresh };
}

/* ═══ Command bar (⌘K) ═══ */

export function useCommandBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return { open, setOpen, toggle: () => setOpen(o => !o) };
}

/* ═══ Auth ═══ */

export function useAuth() {
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Use /api/dashboard/leads as the auth probe (JARVIS-internal, no external API).
    // Previously hit /api/dashboard/projects which depends on the Vercel API and
    // 500s in local dev when VERCEL_API_TOKEN isn't configured.
    fetch("/api/dashboard/leads")
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

  const remove = useCallback(async (briefId: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/dashboard/briefs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ briefId }),
      });
      if (res.ok) {
        setBriefs(b => b.filter(x => x.id !== briefId));
        return true;
      }
    } catch { /* */ }
    return false;
  }, []);

  return { briefs, loading, refresh, updateStatus, remove };
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

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard/build-state");
      if (!res.ok) return;
      const data = await res.json();
      if (data?.history) setHistory(data.history);
    } catch { /* */ }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const removeEntry = useCallback(async (slug: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/dashboard/build-state", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        setHistory(h => h.filter(e => e.slug !== slug));
        return true;
      }
    } catch { /* */ }
    return false;
  }, []);

  const clearAll = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/dashboard/build-state", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clearAll: true }),
      });
      if (res.ok) { setHistory([]); return true; }
    } catch { /* */ }
    return false;
  }, []);

  return Object.assign(history, { refresh, removeEntry, clearAll }) as
    BuildHistoryEntry[] & { refresh: () => Promise<void>; removeEntry: (slug: string) => Promise<boolean>; clearAll: () => Promise<boolean> };
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
