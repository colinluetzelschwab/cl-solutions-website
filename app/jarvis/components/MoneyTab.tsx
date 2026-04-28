"use client";

import { useState } from "react";
import { C, statusColor, relTime } from "../lib/constants";
import type { Offer, OfferIndexEntry, PackageId, ProjectStatus } from "../lib/crm-types";
import { PROJECT_STATUSES } from "../lib/crm-types";
import { useOffers, useCrmProjects, useFinance, useCosts, useLeads } from "../lib/crm-hooks";
import { HudLabel, HudCard, HudEmpty, HudSkeleton, HudBadge, HudBox, PageHeader } from "./HudElements";

const PACKAGES: { id: PackageId; label: string }[] = [
  { id: "starter", label: "STARTER" },
  { id: "business", label: "BUSINESS" },
  { id: "pro", label: "PRO" },
  { id: "custom", label: "CUSTOM" },
];

const PROJECT_STATUS_LABEL: Record<ProjectStatus, string> = {
  briefing: "BRIEFING",
  waiting_content: "WAITING CONTENT",
  in_build: "IN BUILD",
  in_review: "IN REVIEW",
  revision: "REVISION",
  ready_to_go_live: "READY TO LAUNCH",
  live: "LIVE",
  maintenance: "MAINTENANCE",
};

const COST_CATEGORIES = [
  "vercel", "claude_openai", "sanity", "resend", "domains", "hetzner", "tools", "other",
] as const;

export default function MoneyTab() {
  return (
    <div>
      <PageHeader
        title="Money"
        subtitle="Offers, projects in flight, and what's coming in."
      />
      <div className="space-y-12">
        <FinanceSection />
        <OffersSection />
        <ProjectsSection />
      </div>
    </div>
  );
}

/* ── Offers ──────────────────────────────────────────────── */

function OffersSection() {
  const { offers, loading, refresh, create, update } = useOffers();
  const { leads } = useLeads();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, client: string) => {
    if (deletingId) return;
    if (!confirm(`Delete offer for "${client}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/dashboard/offers/${id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section>
      <SectionHeader
        title="Offers"
        count={offers.length}
        action={
          <ToolbarActions
            refresh={refresh}
            primary={{ label: showForm ? "Cancel" : "+ New offer", onClick: () => setShowForm(s => !s), variant: showForm ? "ghost" : "accent" }}
          />
        }
      />

      {showForm && (
        <div className="mb-4">
          <NewOfferForm
            leads={leads}
            onSubmit={async (data) => {
              const offer = await create(data);
              if (offer) setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? <HudSkeleton /> : offers.length === 0 && !showForm ? (
        <HudEmpty message="No offers yet — create your first one above." />
      ) : (
        <div>
          {/* Mobile: stacked cards */}
          <div className="space-y-1.5 md:hidden">
            {offers.map(o => (
              <OfferCard key={o.id} offer={o} onUpdate={update} onDelete={() => handleDelete(o.id, o.client)} deleting={deletingId === o.id} />
            ))}
          </div>
          {/* Desktop: dense table */}
          <div className="hidden md:block">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                  {["#", "CLIENT", "AMOUNT", "VALID UNTIL", "SIGNED", "INVOICED", "PAID", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`pb-3 text-[11px] tracking-[0.2em] font-semibold ${i >= 2 ? "text-right" : "text-left"} ${i === 7 ? "text-right" : ""}`}
                      style={{ color: "rgba(255,255,255,0.35)" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {offers.map(o => {
                  const expired = new Date(o.validUntil).getTime() < Date.now();
                  return (
                    <tr key={o.id} style={{ borderBottom: `1px solid ${C.dim}` }} className="group">
                      <td className="py-3 pr-6">
                        <span className="text-[11px] font-mono font-semibold" style={{ color: `${C.primary}90` }}>{o.offerNumber}</span>
                      </td>
                      <td className="py-3 pr-6">
                        <p className="text-sm font-semibold">{o.client}</p>
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <span className="text-sm font-bold tabular-nums" style={{ color: C.primary }}>
                          CHF {o.amount.toLocaleString("de-CH")}
                        </span>
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <span className="text-[11px] tabular-nums font-medium" style={{ color: expired ? C.error : "rgba(255,255,255,0.4)" }}>
                          {relTime(o.validUntil)}
                        </span>
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <button
                          onClick={() => update(o.id, { contractSigned: !o.contractSigned })}
                          className="text-[11px] font-bold tracking-wider px-2 py-1"
                          style={{
                            background: o.contractSigned ? `${C.success}15` : "transparent",
                            border: `1px solid ${o.contractSigned ? `${C.success}50` : `${C.border}`}`,
                            color: o.contractSigned ? C.success : "rgba(255,255,255,0.3)",
                          }}
                        >
                          {o.contractSigned ? "✓ YES" : "NO"}
                        </button>
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <button
                          onClick={() => update(o.id, { invoiceSent: !o.invoiceSent })}
                          className="text-[11px] font-bold tracking-wider px-2 py-1"
                          style={{
                            background: o.invoiceSent ? `${C.warning}15` : "transparent",
                            border: `1px solid ${o.invoiceSent ? `${C.warning}50` : `${C.border}`}`,
                            color: o.invoiceSent ? C.warning : "rgba(255,255,255,0.3)",
                          }}
                        >
                          {o.invoiceSent ? "✓ SENT" : "NO"}
                        </button>
                      </td>
                      <td className="py-3 pr-6 text-right">
                        <button
                          onClick={() => update(o.id, { paid: !o.paid })}
                          className="text-[11px] font-bold tracking-wider px-2 py-1"
                          style={{
                            background: o.paid ? `${C.success}15` : "transparent",
                            border: `1px solid ${o.paid ? `${C.success}50` : `${C.border}`}`,
                            color: o.paid ? C.success : "rgba(255,255,255,0.3)",
                          }}
                        >
                          {o.paid ? "✓ PAID" : "OPEN"}
                        </button>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDelete(o.id, o.client)}
                          disabled={deletingId === o.id}
                          className="text-[10px] tracking-wider font-bold px-2.5 py-1 disabled:opacity-30 opacity-60 group-hover:opacity-100 transition-opacity"
                          style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, color: C.error }}
                          title="Delete offer"
                        >
                          {deletingId === o.id ? "…" : "DEL"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}

function OfferCard({
  offer, onUpdate, onDelete, deleting,
}: {
  offer: OfferIndexEntry;
  onUpdate: (id: string, patch: Partial<Offer>) => Promise<Offer | null>;
  onDelete: () => void;
  deleting: boolean;
}) {
  const expired = new Date(offer.validUntil).getTime() < Date.now();
  return (
    <HudCard>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-semibold" style={{ color: `${C.primary}90` }}>{offer.offerNumber}</span>
            {expired && <HudBadge label="EXPIRED" color={C.error} />}
          </div>
          <p className="text-sm font-semibold mt-0.5">{offer.client}</p>
          <p className="text-base font-bold tabular-nums mt-1" style={{ color: C.primary }}>
            CHF {offer.amount.toLocaleString("de-CH")}
          </p>
        </div>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="text-[11px] tracking-wider font-bold px-2 py-1 disabled:opacity-30"
          style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, color: C.error }}
        >
          {deleting ? "…" : "×"}
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2.5">
        <button
          onClick={() => onUpdate(offer.id, { contractSigned: !offer.contractSigned })}
          className="text-[10px] font-bold tracking-wider px-2 py-1"
          style={{
            background: offer.contractSigned ? `${C.success}15` : "transparent",
            border: `1px solid ${offer.contractSigned ? `${C.success}50` : C.border}`,
            color: offer.contractSigned ? C.success : "rgba(255,255,255,0.4)",
          }}
        >
          {offer.contractSigned ? "✓ SIGNED" : "SIGN"}
        </button>
        <button
          onClick={() => onUpdate(offer.id, { invoiceSent: !offer.invoiceSent })}
          className="text-[10px] font-bold tracking-wider px-2 py-1"
          style={{
            background: offer.invoiceSent ? `${C.warning}15` : "transparent",
            border: `1px solid ${offer.invoiceSent ? `${C.warning}50` : C.border}`,
            color: offer.invoiceSent ? C.warning : "rgba(255,255,255,0.4)",
          }}
        >
          {offer.invoiceSent ? "✓ INVOICED" : "INVOICE"}
        </button>
        <button
          onClick={() => onUpdate(offer.id, { paid: !offer.paid })}
          className="text-[10px] font-bold tracking-wider px-2 py-1"
          style={{
            background: offer.paid ? `${C.success}15` : "transparent",
            border: `1px solid ${offer.paid ? `${C.success}50` : C.border}`,
            color: offer.paid ? C.success : "rgba(255,255,255,0.4)",
          }}
        >
          {offer.paid ? "✓ PAID" : "MARK PAID"}
        </button>
      </div>
    </HudCard>
  );
}

function NewOfferForm({
  leads, onSubmit, onCancel,
}: {
  leads: { id: string; name: string }[];
  onSubmit: (data: Partial<Offer>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState("");
  const [packageId, setPackageId] = useState<PackageId>("business");
  const [leadId, setLeadId] = useState("");
  const [validDays, setValidDays] = useState("30");
  const [submitting, setSubmitting] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || !amount || submitting) return;
    setSubmitting(true);
    const validUntil = new Date(Date.now() + Number(validDays) * 24 * 60 * 60 * 1000).toISOString();
    try {
      await onSubmit({
        client,
        amount: Number(amount),
        packageId,
        leadId: leadId || undefined,
        validUntil,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-fill client from lead selection
  const handleLeadChange = (id: string) => {
    setLeadId(id);
    if (id && !client) {
      const lead = leads.find(l => l.id === id);
      if (lead) setClient(lead.name);
    }
  };

  return (
    <form onSubmit={handle} className="p-4 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="Client *">
          <input
            value={client}
            onChange={e => setClient(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </FormField>
        <FormField label="Amount (CHF) *">
          <input
            type="number"
            min={0}
            step={50}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 outline-none tabular-nums"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </FormField>
        <FormField label="Package">
          <select
            value={packageId}
            onChange={e => setPackageId(e.target.value as PackageId)}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          >
            {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </FormField>
        <FormField label="Link to Lead (optional)">
          <select
            value={leadId}
            onChange={e => handleLeadChange(e.target.value)}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          >
            <option value="">— none —</option>
            {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </FormField>
        <FormField label="Valid for (days)">
          <input
            type="number"
            min={1}
            value={validDays}
            onChange={e => setValidDays(e.target.value)}
            className="w-full text-sm px-3 py-2 outline-none tabular-nums"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </FormField>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] tracking-wider font-medium px-4 py-2"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={submitting || !client.trim() || !amount}
          className="text-[12px] tracking-wider font-bold px-4 py-2 disabled:opacity-30"
          style={{ background: `${C.success}12`, border: `1px solid ${C.success}50`, color: C.success }}
        >
          {submitting ? "SAVING..." : "▸ CREATE OFFER"}
        </button>
      </div>
    </form>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--jarvis-text-muted)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

/* ── Section header (h2 + count + toolbar) ───────────────── */

function SectionHeader({
  title, count, action,
}: { title: string; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-baseline gap-3">
        <h2 className="text-[20px] font-medium" style={{ color: "var(--jarvis-text-primary)" }}>{title}</h2>
        {count != null && count > 0 && (
          <span className="jarvis-mono text-[13px] tabular-nums" style={{ color: "var(--jarvis-text-muted)" }}>
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

/* ── Toolbar (refresh + primary CTA) ─────────────────────── */

function ToolbarActions({
  refresh, primary,
}: {
  refresh: () => void;
  primary: { label: string; onClick: () => void; variant: "accent" | "ghost" };
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={refresh}
        className="text-[12px] font-medium px-3 py-2 rounded-lg"
        style={{ color: "var(--jarvis-text-muted)" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--jarvis-text-primary)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--jarvis-text-muted)"}
      >
        Refresh
      </button>
      <button
        onClick={primary.onClick}
        className="text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
        style={{
          background: primary.variant === "accent" ? "var(--jarvis-accent)" : "var(--jarvis-surface-2)",
          color: primary.variant === "accent" ? "white" : "var(--jarvis-text-primary)",
        }}
      >
        {primary.label}
      </button>
    </div>
  );
}

/* ── Projects (filled in step 12) ────────────────────────── */

function ProjectsSection() {
  const { projects, loading, refresh, create, update } = useCrmProjects();
  const { leads } = useLeads();
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const grouped = PROJECT_STATUSES.reduce<Record<ProjectStatus, typeof projects>>((acc, s) => {
    acc[s] = projects.filter(p => p.status === s);
    return acc;
  }, {} as Record<ProjectStatus, typeof projects>);

  const handleDelete = async (id: string, client: string) => {
    if (deletingId) return;
    if (!confirm(`Delete project for "${client}"?`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/dashboard/crm-projects/${id}`, { method: "DELETE" });
      await refresh();
    } finally { setDeletingId(null); }
  };

  // Click status pill to advance to next status
  const advanceStatus = (id: string, current: ProjectStatus) => {
    const idx = PROJECT_STATUSES.indexOf(current);
    const next = PROJECT_STATUSES[(idx + 1) % PROJECT_STATUSES.length];
    update(id, { status: next });
  };

  return (
    <section>
      <SectionHeader
        title="Projects"
        count={projects.length}
        action={
          <ToolbarActions
            refresh={refresh}
            primary={{ label: showForm ? "Cancel" : "+ New project", onClick: () => setShowForm(s => !s), variant: showForm ? "ghost" : "accent" }}
          />
        }
      />

      {showForm && (
        <div className="mb-4">
          <NewProjectForm
            leads={leads}
            onSubmit={async (data) => {
              const project = await create(data);
              if (project) setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {loading ? <HudSkeleton /> : projects.length === 0 && !showForm ? (
        <HudEmpty message="No active projects." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          {PROJECT_STATUSES.map(status => {
            const items = grouped[status];
            if (items.length === 0) return null;
            return (
              <div key={status}>
                <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: statusColor(status) }}>
                  {PROJECT_STATUS_LABEL[status]} <span className="font-medium opacity-60 ml-1">{items.length}</span>
                </p>
                <div className="space-y-1.5">
                  {items.map(p => (
                    <HudCard key={p.id}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">{p.client}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                            updated {relTime(p.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDelete(p.id, p.client)}
                          disabled={deletingId === p.id}
                          className="text-[10px] tracking-wider font-bold px-1.5 py-0.5 disabled:opacity-30"
                          style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, color: C.error }}
                        >×</button>
                      </div>
                      <button
                        onClick={() => advanceStatus(p.id, p.status)}
                        className="mt-2 text-[10px] tracking-wider font-bold px-2 py-1 w-full text-left"
                        style={{
                          background: `${statusColor(p.status)}15`,
                          border: `1px solid ${statusColor(p.status)}40`,
                          color: statusColor(p.status),
                        }}
                        title="Click to advance status"
                      >
                        ▸ ADVANCE
                      </button>
                    </HudCard>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function NewProjectForm({
  leads, onSubmit, onCancel,
}: {
  leads: { id: string; name: string }[];
  onSubmit: (data: Partial<import("../lib/crm-types").CrmProject>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const [client, setClient] = useState("");
  const [packageId, setPackageId] = useState<PackageId>("business");
  const [leadId, setLeadId] = useState("");
  const [domain, setDomain] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLead = (id: string) => {
    setLeadId(id);
    if (id && !client) {
      const lead = leads.find(l => l.id === id);
      if (lead) setClient(lead.name);
    }
  };

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!client.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        client,
        packageId,
        leadId: leadId || undefined,
        domain: domain || undefined,
        startDate: new Date().toISOString(),
        status: "briefing",
        openTasks: [],
      });
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handle} className="p-4 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField label="Client *">
          <input
            value={client}
            onChange={e => setClient(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </FormField>
        <FormField label="Package">
          <select
            value={packageId}
            onChange={e => setPackageId(e.target.value as PackageId)}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          >
            {PACKAGES.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
        </FormField>
        <FormField label="Link to Lead (optional)">
          <select
            value={leadId}
            onChange={e => handleLead(e.target.value)}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          >
            <option value="">— none —</option>
            {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
        </FormField>
        <FormField label="Domain (optional)">
          <input
            value={domain}
            onChange={e => setDomain(e.target.value)}
            placeholder="example.ch"
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </FormField>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] tracking-wider font-medium px-4 py-2"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >CANCEL</button>
        <button
          type="submit"
          disabled={submitting || !client.trim()}
          className="text-[12px] tracking-wider font-bold px-4 py-2 disabled:opacity-30"
          style={{ background: `${C.success}12`, border: `1px solid ${C.success}50`, color: C.success }}
        >
          {submitting ? "SAVING..." : "▸ CREATE PROJECT"}
        </button>
      </div>
    </form>
  );
}

/* ── Finance (filled in step 13) ─────────────────────────── */

function FinanceSection() {
  const { summary, loading, refresh } = useFinance();
  const { costs, refresh: refreshCosts, create, remove } = useCosts();
  const [showForm, setShowForm] = useState(false);

  const refreshAll = async () => { await refresh(); await refreshCosts(); };

  return (
    <section>
      <SectionHeader
        title="Finance"
        action={
          <ToolbarActions
            refresh={refreshAll}
            primary={{ label: showForm ? "Cancel" : "+ Add cost", onClick: () => setShowForm(s => !s), variant: showForm ? "ghost" : "accent" }}
          />
        }
      />

      {showForm && (
        <div className="mb-4">
          <NewCostForm onSubmit={async (data) => { await create(data); setShowForm(false); }} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {loading || !summary ? <HudSkeleton /> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          <HudBox label="Revenue this month" value={`CHF ${summary.revenueMonth.toLocaleString("de-CH")}`} color="var(--jarvis-success)" />
          <HudBox label="Revenue YTD" value={`CHF ${summary.revenueYtd.toLocaleString("de-CH")}`} color="var(--jarvis-success)" />
          <HudBox label="Outstanding" value={`CHF ${summary.outstanding.toLocaleString("de-CH")}`} color={summary.outstanding > 0 ? "var(--jarvis-warning)" : undefined} />
          <HudBox label="MRR" value={`CHF ${summary.mrr.toLocaleString("de-CH")}`} />
          <HudBox label="Costs this month" value={`CHF ${summary.costsMonth.toLocaleString("de-CH")}`} color="var(--jarvis-error)" />
          <HudBox label="Profit (est.)" value={`CHF ${summary.profitEstimate.toLocaleString("de-CH")}`} color={summary.profitEstimate >= 0 ? "var(--jarvis-success)" : "var(--jarvis-error)"} />
        </div>
      )}

      {costs.length > 0 && (
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase font-bold mb-2" style={{ color: `${C.primary}60` }}>
            Recorded Costs
          </p>
          <div className="space-y-1">
            {costs.map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 px-3 gap-3" style={{ background: C.surface }}>
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="text-[11px] tracking-wider font-bold uppercase" style={{ color: `${C.primary}80` }}>
                    {c.category.replace(/_/g, " ")}
                  </span>
                  <span className="text-[11px] font-mono tabular-nums" style={{ color: "rgba(255,255,255,0.4)" }}>{c.month}</span>
                </div>
                <span className="text-sm tabular-nums font-bold" style={{ color: C.error }}>
                  CHF {c.amount.toLocaleString("de-CH")}
                </span>
                <button
                  onClick={() => { if (confirm("Delete cost entry?")) remove(c.id); }}
                  className="text-[11px] tracking-wider font-bold px-2 py-1"
                  style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, color: C.error }}
                >×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function NewCostForm({
  onSubmit, onCancel,
}: {
  onSubmit: (data: Partial<import("../lib/crm-types").CostEntry>) => void | Promise<void>;
  onCancel: () => void;
}) {
  const now = new Date();
  const defaultMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const [category, setCategory] = useState<typeof COST_CATEGORIES[number]>("vercel");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(defaultMonth);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ category, amount: Number(amount), month, note: note || undefined });
    } finally { setSubmitting(false); }
  };

  return (
    <form onSubmit={handle} className="p-4 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormField label="Category">
          <select
            value={category}
            onChange={e => setCategory(e.target.value as typeof COST_CATEGORIES[number])}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          >
            {COST_CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
          </select>
        </FormField>
        <FormField label="Amount (CHF) *">
          <input
            type="number"
            min={0}
            step={1}
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            className="w-full text-sm px-3 py-2 outline-none tabular-nums"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </FormField>
        <FormField label="Month (YYYY-MM)">
          <input
            type="text"
            pattern="\d{4}-\d{2}"
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="w-full text-sm px-3 py-2 outline-none tabular-nums"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </FormField>
      </div>
      <FormField label="Note (optional)">
        <input
          value={note}
          onChange={e => setNote(e.target.value)}
          className="w-full text-sm px-3 py-2 outline-none"
          style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
        />
      </FormField>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-[12px] tracking-wider font-medium px-4 py-2"
          style={{ color: "rgba(255,255,255,0.5)" }}
        >CANCEL</button>
        <button
          type="submit"
          disabled={submitting || !amount}
          className="text-[12px] tracking-wider font-bold px-4 py-2 disabled:opacity-30"
          style={{ background: `${C.success}12`, border: `1px solid ${C.success}50`, color: C.success }}
        >
          {submitting ? "SAVING..." : "▸ ADD COST"}
        </button>
      </div>
    </form>
  );
}
