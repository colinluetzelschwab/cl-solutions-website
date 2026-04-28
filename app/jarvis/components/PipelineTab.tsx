"use client";

import { useState } from "react";
import { C, statusColor, relTime } from "../lib/constants";
import type { LeadStatus, LeadSource } from "../lib/crm-types";
import { LEAD_STATUSES } from "../lib/crm-types";
import { useLeads } from "../lib/crm-hooks";
import { HudLabel, HudCard, HudEmpty, HudSkeleton, HudBadge, PageHeader } from "./HudElements";
import LeadDetail from "./LeadDetail";

const PRIORITY_DOT: Record<1 | 2 | 3, string> = {
  1: C.error,                     // hot
  2: C.warning,                   // warm
  3: "rgba(255,255,255,0.30)",    // cold
};

const PRIORITY_LABEL: Record<1 | 2 | 3, string> = {
  1: "HOT",
  2: "WARM",
  3: "COLD",
};

/**
 * Step 3: bare-minimum Pipeline list + create form.
 * Detail pane (autosave) comes in Step 5.
 * Step 3 already exposes per-row delete since Colin asked for it explicitly.
 */
export default function PipelineTab() {
  const { leads, loading, refresh, create } = useLeads();
  const [showNewForm, setShowNewForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCreate = async (form: NewLeadForm) => {
    const lead = await create(form);
    if (lead) {
      setShowNewForm(false);
      setSelectedId(lead.id);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (deletingId) return;
    if (!confirm(`Delete lead "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/dashboard/leads/${id}`, { method: "DELETE" });
      await refresh();
    } finally {
      setDeletingId(null);
    }
  };

  // Status counts for desktop summary
  const statusCounts = leads.reduce<Record<string, number>>((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {});
  const hot = leads.filter(l => l.priority === 1).length;

  return (
    <div className="md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] md:gap-8 md:items-start">
      {/* ── LEFT PANE (full width on mobile) ──────────────────── */}
      <div className="min-w-0">

      <PageHeader
        title="Pipeline"
        subtitle={`${leads.length} ${leads.length === 1 ? "lead" : "leads"} · ${hot} hot`}
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="text-[12px] font-medium px-3 py-2 rounded-lg transition-colors"
              style={{ color: "var(--jarvis-text-muted)" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--jarvis-text-primary)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--jarvis-text-muted)"}
            >
              Refresh
            </button>
            <button
              onClick={() => setShowNewForm(s => !s)}
              className="text-[13px] font-medium px-4 py-2 rounded-lg transition-all"
              style={{
                background: showNewForm ? "var(--jarvis-surface-2)" : "var(--jarvis-accent)",
                color: showNewForm ? "var(--jarvis-text-primary)" : "white",
              }}
            >
              {showNewForm ? "Cancel" : "+ New lead"}
            </button>
          </div>
        }
      />

      {/* ── Desktop status strip ──────────────────────────────── */}
      {leads.length > 0 && (
        <div className="hidden md:grid md:grid-cols-5 gap-3 mb-8">
          {[
            { label: "Total", value: leads.length, color: undefined },
            { label: "Hot", value: hot, color: "var(--jarvis-accent)" },
            { label: "Qualified", value: statusCounts["qualified"] ?? 0, color: undefined },
            { label: "Contacted+", value: (statusCounts["contacted"] ?? 0) + (statusCounts["replied"] ?? 0) + (statusCounts["offer_sent"] ?? 0), color: "var(--jarvis-warning)" },
            { label: "Won", value: statusCounts["won"] ?? 0, color: "var(--jarvis-success)" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className="p-4 rounded-xl transition-colors"
              style={{ background: "var(--jarvis-surface-1)", border: `1px solid var(--jarvis-border-subtle)` }}
            >
              <p className="text-[11px] font-medium" style={{ color: "var(--jarvis-text-muted)" }}>{label}</p>
              <p
                className="text-[32px] mt-2 tabular-nums font-semibold"
                style={{
                  color: color ?? "var(--jarvis-text-primary)",
                  letterSpacing: "-0.025em",
                  lineHeight: 1,
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      {showNewForm && (
        <div className="mb-4">
          <NewLeadFormView onSubmit={handleCreate} onCancel={() => setShowNewForm(false)} />
        </div>
      )}

      {loading ? <HudSkeleton /> : leads.length === 0 && !showNewForm ? (
        <HudEmpty message="No leads yet — start by adding one." />
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-1.5 md:hidden">
            {leads.map(l => {
              const sColor = statusColor(l.status);
              return (
                <HudCard key={l.id} onClick={() => setSelectedId(l.id)}>
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ background: PRIORITY_DOT[l.priority] }}
                      title={`Priority ${l.priority} — ${PRIORITY_LABEL[l.priority]}`}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">{l.name}</p>
                      <p className="text-[11px] mt-0.5 tabular-nums" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {relTime(l.updatedAt)}
                      </p>
                    </div>
                    <HudBadge label={l.status.replace(/_/g, " ").toUpperCase()} color={sColor} />
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(l.id, l.name); }}
                      disabled={deletingId === l.id}
                      className="text-[11px] tracking-wider font-bold px-2 py-1 disabled:opacity-30"
                      style={{ background: `${C.error}10`, border: `1px solid ${C.error}30`, color: C.error }}
                      aria-label={`Delete lead ${l.name}`}
                    >
                      {deletingId === l.id ? "…" : "×"}
                    </button>
                  </div>
                </HudCard>
              );
            })}
          </div>

          {/* Desktop: editorial table — generous padding, no border-bottoms */}
          <div className="hidden md:block rounded-xl overflow-hidden" style={{ background: "var(--jarvis-surface-1)", border: `1px solid var(--jarvis-border-subtle)` }}>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {["", "Business", "Status", "Priority", "Source", "Updated", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`px-5 py-3 text-[11px] font-medium ${i === 6 ? "text-right" : "text-left"}`}
                      style={{ color: "var(--jarvis-text-muted)", borderBottom: `1px solid var(--jarvis-border-subtle)` }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((l, i) => {
                  const sColor = statusColor(l.status);
                  const isSelected = selectedId === l.id;
                  return (
                    <tr
                      key={l.id}
                      onClick={() => setSelectedId(isSelected ? null : l.id)}
                      className="transition-colors group cursor-pointer"
                      style={{
                        background: isSelected ? "var(--jarvis-accent-bg)" : "transparent",
                        borderTop: i === 0 ? "none" : `1px solid var(--jarvis-border-subtle)`,
                      }}
                      onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--jarvis-surface-2)"; }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <td className="px-5 py-4 w-8">
                        <span
                          className="w-2 h-2 rounded-full block"
                          style={{ background: PRIORITY_DOT[l.priority] }}
                          title={PRIORITY_LABEL[l.priority]}
                        />
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-medium" style={{ color: "var(--jarvis-text-primary)" }}>{l.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <HudBadge label={l.status.replace(/_/g, " ")} color={sColor} dot />
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px] font-medium" style={{ color: PRIORITY_DOT[l.priority] }}>
                          {PRIORITY_LABEL[l.priority]}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px]" style={{ color: "var(--jarvis-text-muted)" }}>
                          —
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[12px] tabular-nums" style={{ color: "var(--jarvis-text-muted)" }}>
                          {relTime(l.updatedAt)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(l.id, l.name); }}
                          disabled={deletingId === l.id}
                          className="text-[12px] font-medium px-2.5 py-1 rounded-md disabled:opacity-30 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: "var(--jarvis-error)", background: "rgba(248, 113, 113, 0.1)" }}
                          title="Delete lead"
                        >
                          {deletingId === l.id ? "…" : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>

      {/* ── RIGHT DETAIL PANE (desktop only) ──────────────────── */}
      <aside
        className="hidden md:block sticky top-0 max-h-[calc(100vh-120px)] overflow-y-auto pl-6"
        style={{ borderLeft: `1px solid var(--jarvis-border-subtle)` }}
      >
        {selectedId ? (
          <LeadDetail
            leadId={selectedId}
            onDeleted={() => { setSelectedId(null); refresh(); }}
            onChanged={refresh}
          />
        ) : (
          <div className="py-24 text-center">
            <p
              className="text-[20px] mb-3 font-medium"
              style={{ color: "var(--jarvis-text-muted)", letterSpacing: "-0.02em" }}
            >
              Select a lead to inspect
            </p>
            <p className="text-[13px]" style={{ color: "var(--jarvis-text-faint)" }}>
              Click any row · fields autosave on blur
            </p>
          </div>
        )}
      </aside>

      {/* ── MOBILE FULL-SCREEN DETAIL OVERLAY ─────────────────── */}
      {selectedId && (
        <div className="md:hidden fixed inset-0 z-50 overflow-y-auto" style={{ background: "var(--jarvis-bg)" }}>
          <div
            className="sticky top-0 z-10 flex items-center justify-between px-5 py-4"
            style={{ background: "var(--jarvis-bg)", borderBottom: `1px solid var(--jarvis-border-subtle)` }}
          >
            <HudLabel>Lead detail</HudLabel>
            <button
              onClick={() => setSelectedId(null)}
              className="text-[13px] font-medium px-3 py-1.5 rounded-lg"
              style={{ background: "var(--jarvis-surface-2)", color: "var(--jarvis-text-primary)" }}
            >
              ← Back
            </button>
          </div>
          <div className="p-5 pb-24">
            <LeadDetail
              leadId={selectedId}
              onDeleted={() => { setSelectedId(null); refresh(); }}
              onChanged={refresh}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── New lead form ───────────────────────────────────────── */

interface NewLeadForm {
  businessName: string;
  websiteUrl: string;
  email: string;
  phone: string;
  industry: string;
  location: string;
  status: LeadStatus;
  source: LeadSource;
  priority: 1 | 2 | 3;
  notes: string;
}

function NewLeadFormView({ onSubmit, onCancel }: { onSubmit: (form: NewLeadForm) => void; onCancel: () => void }) {
  const [form, setForm] = useState<NewLeadForm>({
    businessName: "",
    websiteUrl: "",
    email: "",
    phone: "",
    industry: "",
    location: "",
    status: "found",
    source: "manual",
    priority: 2,
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim() || submitting) return;
    setSubmitting(true);
    try {
      onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handle} className="p-4 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Business Name *">
          <input
            value={form.businessName}
            onChange={e => setForm(f => ({ ...f, businessName: e.target.value }))}
            autoFocus
            required
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </Field>
        <Field label="Website">
          <input
            type="url"
            value={form.websiteUrl}
            onChange={e => setForm(f => ({ ...f, websiteUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </Field>
        <Field label="Phone">
          <input
            value={form.phone}
            onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </Field>
        <Field label="Industry">
          <input
            value={form.industry}
            onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </Field>
        <Field label="Location">
          <input
            value={form.location}
            onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
            placeholder="Zurich, CH"
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
        </Field>
        <Field label="Status">
          <select
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          >
            {LEAD_STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </Field>
        <Field label="Priority">
          <select
            value={form.priority}
            onChange={e => setForm(f => ({ ...f, priority: Number(e.target.value) as 1 | 2 | 3 }))}
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          >
            <option value={1}>1 — hot</option>
            <option value={2}>2 — warm</option>
            <option value={3}>3 — cold</option>
          </select>
        </Field>
      </div>
      <Field label="Notes">
        <textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          rows={2}
          className="w-full text-sm px-3 py-2 outline-none resize-y"
          style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
        />
      </Field>
      <div className="flex justify-end gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] tracking-wider font-medium px-4 py-2"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={submitting || !form.businessName.trim()}
          className="text-[11px] tracking-wider font-bold px-4 py-2 disabled:opacity-30"
          style={{
            background: `${C.success}12`,
            border: `1px solid ${C.success}40`,
            color: C.success,
          }}
        >
          {submitting ? "SAVING..." : "▸ CREATE LEAD"}
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[9px] tracking-[0.2em] uppercase font-medium block mb-1.5" style={{ color: `${C.primary}50` }}>
        {label}
      </span>
      {children}
    </label>
  );
}
