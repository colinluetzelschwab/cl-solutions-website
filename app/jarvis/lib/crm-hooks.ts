"use client";

/**
 * CRM hooks. Thin client wrappers around /api/dashboard/* CRM routes.
 * Mirror the existing useBriefs / useProjects pattern.
 */

import { useCallback, useEffect, useState } from "react";
import type {
  Lead, LeadIndexEntry,
  Outreach, OutreachIndexEntry,
  Mockup, MockupIndexEntry,
  Offer, OfferIndexEntry,
  CrmProject, CrmProjectIndexEntry,
  CostEntry, CostIndexEntry,
  FinanceSummary, NextAction,
} from "./crm-types";

/* ── Leads ───────────────────────────────────────────────── */

export function useLeads() {
  const [leads, setLeads] = useState<LeadIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/leads", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (
    partial: Partial<Omit<Lead, "id" | "createdAt" | "updatedAt" | "createdBy">>,
  ): Promise<Lead | null> => {
    try {
      const res = await fetch("/api/dashboard/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.lead as Lead;
    } catch { return null; }
  }, [refresh]);

  return { leads, loading, refresh, create };
}

export function useLead(id: string | null) {
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!id) { setLead(null); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${id}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead ?? null);
      } else {
        setLead(null);
      }
    } catch { /* */ }
    setLoading(false);
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const update = useCallback(async (
    patch: Partial<Lead>,
  ): Promise<Lead | null> => {
    if (!id) return null;
    try {
      const res = await fetch(`/api/dashboard/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      const data = await res.json();
      setLead(data.lead);
      return data.lead as Lead;
    } catch { return null; }
  }, [id]);

  const remove = useCallback(async (): Promise<boolean> => {
    if (!id) return false;
    try {
      const res = await fetch(`/api/dashboard/leads/${id}`, { method: "DELETE" });
      if (res.ok) { setLead(null); return true; }
    } catch { /* */ }
    return false;
  }, [id]);

  return { lead, loading, refresh, update, remove };
}

/* ── Outreach ────────────────────────────────────────────── */

export function useOutreachForLead(leadId: string | null) {
  const [items, setItems] = useState<Outreach[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!leadId) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/outreach?leadId=${encodeURIComponent(leadId)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.outreach ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, [leadId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (partial: Partial<Outreach>): Promise<Outreach | null> => {
    if (!leadId) return null;
    try {
      const res = await fetch("/api/dashboard/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...partial, leadId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.outreach as Outreach;
    } catch { return null; }
  }, [leadId, refresh]);

  const update = useCallback(async (id: string, patch: Partial<Outreach>): Promise<Outreach | null> => {
    try {
      const res = await fetch(`/api/dashboard/outreach/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.outreach as Outreach;
    } catch { return null; }
  }, [refresh]);

  return { items, loading, refresh, create, update };
}

export async function fetchOutreachDraft(leadId: string): Promise<{ subject: string; body: string } | null> {
  try {
    const res = await fetch("/api/dashboard/outreach/draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

/* ── Mockups ─────────────────────────────────────────────── */

export function useMockupsForLead(leadId: string | null) {
  const [items, setItems] = useState<Mockup[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!leadId) { setItems([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/dashboard/mockups?leadId=${encodeURIComponent(leadId)}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.mockups ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, [leadId]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (partial: Partial<Mockup>): Promise<Mockup | null> => {
    if (!leadId) return null;
    try {
      const res = await fetch("/api/dashboard/mockups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...partial, leadId }),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.mockup as Mockup;
    } catch { return null; }
  }, [leadId, refresh]);

  const update = useCallback(async (id: string, patch: Partial<Mockup>): Promise<Mockup | null> => {
    try {
      const res = await fetch(`/api/dashboard/mockups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.mockup as Mockup;
    } catch { return null; }
  }, [refresh]);

  return { items, loading, refresh, create, update };
}

/* ── Offers ──────────────────────────────────────────────── */

export function useOffers() {
  const [offers, setOffers] = useState<OfferIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/offers", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setOffers(data.offers ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (partial: Partial<Offer>): Promise<Offer | null> => {
    try {
      const res = await fetch("/api/dashboard/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.offer as Offer;
    } catch { return null; }
  }, [refresh]);

  const update = useCallback(async (id: string, patch: Partial<Offer>): Promise<Offer | null> => {
    try {
      const res = await fetch(`/api/dashboard/offers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.offer as Offer;
    } catch { return null; }
  }, [refresh]);

  return { offers, loading, refresh, create, update };
}

/* ── CrmProjects ─────────────────────────────────────────── */

export function useCrmProjects() {
  const [projects, setProjects] = useState<CrmProjectIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/crm-projects", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (partial: Partial<CrmProject>): Promise<CrmProject | null> => {
    try {
      const res = await fetch("/api/dashboard/crm-projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.project as CrmProject;
    } catch { return null; }
  }, [refresh]);

  const update = useCallback(async (id: string, patch: Partial<CrmProject>): Promise<CrmProject | null> => {
    try {
      const res = await fetch(`/api/dashboard/crm-projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.project as CrmProject;
    } catch { return null; }
  }, [refresh]);

  return { projects, loading, refresh, create, update };
}

/* ── Costs ───────────────────────────────────────────────── */

export function useCosts(month?: string) {
  const [costs, setCosts] = useState<CostIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const url = month ? `/api/dashboard/costs?month=${encodeURIComponent(month)}` : "/api/dashboard/costs";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setCosts(data.costs ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, [month]);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (partial: Partial<CostEntry>): Promise<CostEntry | null> => {
    try {
      const res = await fetch("/api/dashboard/costs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partial),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.cost as CostEntry;
    } catch { return null; }
  }, [refresh]);

  const update = useCallback(async (id: string, patch: Partial<CostEntry>): Promise<CostEntry | null> => {
    try {
      const res = await fetch(`/api/dashboard/costs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      if (!res.ok) return null;
      const data = await res.json();
      await refresh();
      return data.cost as CostEntry;
    } catch { return null; }
  }, [refresh]);

  const remove = useCallback(async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/dashboard/costs/${id}`, { method: "DELETE" });
      if (res.ok) { await refresh(); return true; }
    } catch { /* */ }
    return false;
  }, [refresh]);

  return { costs, loading, refresh, create, update, remove };
}

/* ── Finance ─────────────────────────────────────────────── */

export function useFinance() {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/finance", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setSummary(data.summary ?? null);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return { summary, loading, refresh };
}

/* ── Next Actions ────────────────────────────────────────── */

export function useNextActions() {
  const [actions, setActions] = useState<NextAction[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/dashboard/next-actions", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setActions(data.actions ?? []);
      }
    } catch { /* */ }
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  // Poll every 60s like useVpsHealth pattern
  useEffect(() => {
    const iv = setInterval(refresh, 60000);
    return () => clearInterval(iv);
  }, [refresh]);

  return { actions, loading, refresh };
}
