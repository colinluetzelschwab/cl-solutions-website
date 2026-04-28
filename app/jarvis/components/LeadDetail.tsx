"use client";

import { useEffect, useRef, useState } from "react";
import { C, statusColor, relTime } from "../lib/constants";
import type { Lead, LeadStatus, ReplyStatus } from "../lib/crm-types";
import { LEAD_STATUSES } from "../lib/crm-types";
import { useLead, useOutreachForLead, useMockupsForLead, fetchOutreachDraft } from "../lib/crm-hooks";
import { HudLabel, HudBadge, HudCard, HudEmpty, HudSkeleton } from "./HudElements";

const PRIORITY_LABEL: Record<1 | 2 | 3, string> = { 1: "1 — hot", 2: "2 — warm", 3: "3 — cold" };

export default function LeadDetail({
  leadId,
  onDeleted,
  onChanged,
}: {
  leadId: string;
  onDeleted: () => void;
  onChanged: () => void;
}) {
  const { lead, loading, update, remove } = useLead(leadId);

  if (loading) return <HudSkeleton />;
  if (!lead) return <HudEmpty message="Lead not found." />;

  return (
    <div className="space-y-6">
      <LeadHeader lead={lead} onDelete={async () => { if (confirm("Delete this lead?")) { await remove(); onDeleted(); } }} />
      <LeadEditForm lead={lead} update={update} onChanged={onChanged} />
      <OutreachSection leadId={leadId} leadEmail={lead.email} leadName={lead.businessName} />
      <MockupsSection leadId={leadId} />
    </div>
  );
}

/* ── Header ──────────────────────────────────────────────── */

function LeadHeader({ lead, onDelete }: { lead: Lead; onDelete: () => void }) {
  const sColor = statusColor(lead.status);
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[22px] font-medium tracking-tight truncate" style={{ color: "var(--jarvis-text-primary)" }}>
          {lead.businessName}
        </p>
        <div className="flex items-center gap-2 mt-2.5">
          <HudBadge label={lead.status.replace(/_/g, " ")} color={sColor} dot />
          <HudBadge
            label={lead.priority === 1 ? "Hot" : lead.priority === 2 ? "Warm" : "Cold"}
            color={lead.priority === 1 ? "var(--jarvis-error)" : lead.priority === 2 ? "var(--jarvis-warning)" : "var(--jarvis-text-muted)"}
          />
          <HudBadge label={lead.source} color="var(--jarvis-text-muted)" />
        </div>
        <p className="text-[12px] mt-3" style={{ color: "var(--jarvis-text-muted)" }}>
          Updated {relTime(lead.updatedAt)} · Created {relTime(lead.createdAt)}
        </p>
      </div>
      <button
        onClick={onDelete}
        className="text-[12px] font-medium px-3 py-1.5 rounded-lg shrink-0"
        style={{ background: "rgba(248, 113, 113, 0.1)", color: "var(--jarvis-error)" }}
      >
        Delete
      </button>
    </div>
  );
}

/* ── Edit form (autosave on blur) ────────────────────────── */

function LeadEditForm({
  lead,
  update,
  onChanged,
}: {
  lead: Lead;
  update: (patch: Partial<Lead>) => Promise<Lead | null>;
  onChanged: () => void;
}) {
  const handleSave = async (patch: Partial<Lead>) => {
    const next = await update(patch);
    if (next) onChanged();
  };

  return (
    <div>
      <h3 className="text-[16px] font-medium mb-3" style={{ color: "var(--jarvis-text-primary)" }}>Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <BlurField label="Business Name" value={lead.businessName} onSave={v => handleSave({ businessName: v })} />
        <BlurField label="Website" value={lead.websiteUrl ?? ""} type="url" onSave={v => handleSave({ websiteUrl: v || undefined })} />
        <BlurField label="Email" value={lead.email ?? ""} type="email" onSave={v => handleSave({ email: v || undefined })} />
        <BlurField label="Phone" value={lead.phone ?? ""} onSave={v => handleSave({ phone: v || undefined })} />
        <BlurField label="Industry" value={lead.industry ?? ""} onSave={v => handleSave({ industry: v || undefined })} />
        <BlurField label="Location" value={lead.location ?? ""} onSave={v => handleSave({ location: v || undefined })} />

        <SelectField
          label="Status"
          value={lead.status}
          options={LEAD_STATUSES.map(s => ({ value: s, label: s.replace(/_/g, " ") }))}
          onChange={v => handleSave({ status: v as LeadStatus })}
        />
        <SelectField
          label="Priority"
          value={String(lead.priority)}
          options={[
            { value: "1", label: PRIORITY_LABEL[1] },
            { value: "2", label: PRIORITY_LABEL[2] },
            { value: "3", label: PRIORITY_LABEL[3] },
          ]}
          onChange={v => handleSave({ priority: Number(v) as 1 | 2 | 3 })}
        />

        <BlurField label="Google Rating (0-5)" value={lead.googleRating != null ? String(lead.googleRating) : ""} type="number" onSave={v => handleSave({ googleRating: v ? Math.max(0, Math.min(5, Number(v))) : undefined })} />
        <BlurField label="Site Quality (0-10)" value={lead.websiteQualityScore != null ? String(lead.websiteQualityScore) : ""} type="number" onSave={v => handleSave({ websiteQualityScore: v ? Math.max(0, Math.min(10, Number(v))) : undefined })} />
      </div>

      <div className="mt-3">
        <BlurField label="Notes" value={lead.notes ?? ""} multiline onSave={v => handleSave({ notes: v || undefined })} />
      </div>
    </div>
  );
}

function BlurField({
  label, value, onSave, type = "text", multiline = false,
}: {
  label: string;
  value: string;
  onSave: (v: string) => void | Promise<void>;
  type?: string;
  multiline?: boolean;
}) {
  const [local, setLocal] = useState(value);
  const [savedFlash, setSavedFlash] = useState(false);
  const initial = useRef(value);

  useEffect(() => { setLocal(value); initial.current = value; }, [value]);

  const commit = async () => {
    if (local === initial.current) return;
    await onSave(local);
    initial.current = local;
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 800);
  };

  const inputStyle: React.CSSProperties = {
    background: "var(--jarvis-surface-1)",
    border: `1px solid ${savedFlash ? "var(--jarvis-success)" : "var(--jarvis-border-subtle)"}`,
    color: "var(--jarvis-text-primary)",
    transition: "border-color 200ms",
    borderRadius: "8px",
  };

  return (
    <label className="block">
      <span className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--jarvis-text-muted)" }}>
        {label}
      </span>
      {multiline ? (
        <textarea
          value={local}
          rows={3}
          onChange={e => setLocal(e.target.value)}
          onBlur={commit}
          className="w-full text-[14px] px-3 py-2.5 outline-none resize-y"
          style={inputStyle}
        />
      ) : (
        <input
          type={type}
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={commit}
          className="w-full text-[14px] px-3 py-2.5 outline-none"
          style={inputStyle}
        />
      )}
    </label>
  );
}

function SelectField({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void | Promise<void>;
}) {
  return (
    <label className="block">
      <span className="text-[12px] font-medium block mb-1.5" style={{ color: "var(--jarvis-text-muted)" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full text-[14px] px-3 py-2.5 outline-none rounded-lg"
        style={{ background: "var(--jarvis-surface-1)", border: `1px solid var(--jarvis-border-subtle)`, color: "var(--jarvis-text-primary)" }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

/* ── Outreach timeline ───────────────────────────────────── */

const REPLY_COLOR: Record<ReplyStatus, string> = {
  none: "rgba(255,255,255,0.25)",
  positive: C.success,
  negative: C.error,
  auto_reply: C.warning,
};

function OutreachSection({
  leadId, leadEmail, leadName,
}: {
  leadId: string;
  leadEmail?: string;
  leadName: string;
}) {
  const { items, loading, create, update } = useOutreachForLead(leadId);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerSubject, setDrawerSubject] = useState("");
  const [drawerBody, setDrawerBody] = useState("");
  const [drawerSaving, setDrawerSaving] = useState(false);

  const openDrawer = async () => {
    setDrawerOpen(true);
    setDrawerSaving(false);
    const draft = await fetchOutreachDraft(leadId);
    if (draft) {
      setDrawerSubject(draft.subject);
      setDrawerBody(draft.body);
    } else {
      setDrawerSubject(`Quick idea for ${leadName}`);
      setDrawerBody("");
    }
  };

  const saveDraft = async () => {
    if (!drawerSubject.trim() || drawerSaving) return;
    setDrawerSaving(true);
    await create({ subject: drawerSubject, bodyDraft: drawerBody, replyStatus: "none" });
    setDrawerOpen(false);
    setDrawerSubject("");
    setDrawerBody("");
    setDrawerSaving(false);
  };

  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { /* no-op */ }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-medium" style={{ color: "var(--jarvis-text-primary)" }}>Outreach</h3>
        <button
          onClick={openDrawer}
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "var(--jarvis-surface-2)", color: "var(--jarvis-text-primary)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--jarvis-surface-3)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--jarvis-surface-2)"}
        >
          + Draft email
        </button>
      </div>

      {drawerOpen && (
        <div className="mt-3 p-3 space-y-2" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <input
            value={drawerSubject}
            onChange={e => setDrawerSubject(e.target.value)}
            placeholder="Subject"
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
          <textarea
            value={drawerBody}
            onChange={e => setDrawerBody(e.target.value)}
            rows={8}
            placeholder="Body draft"
            className="w-full text-sm px-3 py-2 outline-none resize-y font-mono"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
              {leadEmail ? `to: ${leadEmail}` : "no email on file"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => copy(`Subject: ${drawerSubject}\n\n${drawerBody}`)}
                className="text-[10px] tracking-wider font-bold px-3 py-1.5"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: `${C.primary}90` }}
              >
                ⧉ COPY
              </button>
              <button
                onClick={() => setDrawerOpen(false)}
                className="text-[10px] tracking-wider font-medium px-3 py-1.5"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                CANCEL
              </button>
              <button
                onClick={saveDraft}
                disabled={drawerSaving || !drawerSubject.trim()}
                className="text-[10px] tracking-wider font-bold px-3 py-1.5 disabled:opacity-30"
                style={{ background: `${C.success}12`, border: `1px solid ${C.success}40`, color: C.success }}
              >
                {drawerSaving ? "SAVING..." : "▸ SAVE DRAFT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? <div className="mt-2"><HudSkeleton /></div> : items.length === 0 ? (
        <p className="mt-3 text-[11px] py-4 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          NO OUTREACH YET
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map(o => (
            <li key={o.id}>
              <HudCard>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{o.subject}</p>
                    <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.3)" }}>
                      {o.sentAt ? `sent ${relTime(o.sentAt)}` : `draft · ${relTime(o.updatedAt)}`}
                      {o.followUpAt && ` · follow-up ${relTime(o.followUpAt)}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <HudBadge
                      label={o.sentAt ? "SENT" : "DRAFT"}
                      color={o.sentAt ? C.success : C.warning}
                    />
                    {o.sentAt && (
                      <HudBadge label={o.replyStatus.replace(/_/g, " ").toUpperCase()} color={REPLY_COLOR[o.replyStatus]} />
                    )}
                  </div>
                </div>
                {o.bodyDraft && (
                  <details className="mt-2">
                    <summary className="text-[10px] cursor-pointer" style={{ color: `${C.primary}60` }}>
                      VIEW BODY
                    </summary>
                    <pre className="mt-2 text-[11px] whitespace-pre-wrap font-mono" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {o.bodyDraft}
                    </pre>
                  </details>
                )}
                <div className="flex gap-1.5 mt-2">
                  {!o.sentAt && (
                    <button
                      onClick={() => update(o.id, { sentAt: new Date().toISOString() })}
                      className="text-[10px] tracking-wider font-bold px-2.5 py-1"
                      style={{ background: `${C.success}12`, border: `1px solid ${C.success}40`, color: C.success }}
                    >
                      MARK SENT
                    </button>
                  )}
                  {o.sentAt && o.replyStatus === "none" && (
                    <>
                      <button
                        onClick={() => update(o.id, { replyStatus: "positive" })}
                        className="text-[10px] tracking-wider font-bold px-2.5 py-1"
                        style={{ background: `${C.success}12`, border: `1px solid ${C.success}40`, color: C.success }}
                      >
                        ✓ REPLY+
                      </button>
                      <button
                        onClick={() => update(o.id, { replyStatus: "negative" })}
                        className="text-[10px] tracking-wider font-bold px-2.5 py-1"
                        style={{ background: `${C.error}12`, border: `1px solid ${C.error}40`, color: C.error }}
                      >
                        ✕ REPLY−
                      </button>
                    </>
                  )}
                </div>
              </HudCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── Mockups ─────────────────────────────────────────────── */

function MockupsSection({ leadId }: { leadId: string }) {
  const { items, loading, create, update } = useMockupsForLead(leadId);
  const [showForm, setShowForm] = useState(false);
  const [url, setUrl] = useState("");
  const [repo, setRepo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || submitting) return;
    setSubmitting(true);
    await create({ url, repo: repo || undefined, status: "ready", sent: false });
    setUrl(""); setRepo(""); setShowForm(false); setSubmitting(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[16px] font-medium" style={{ color: "var(--jarvis-text-primary)" }}>Mockups</h3>
        <button
          onClick={() => setShowForm(s => !s)}
          className="text-[12px] font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "var(--jarvis-surface-2)", color: "var(--jarvis-text-primary)" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--jarvis-surface-3)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--jarvis-surface-2)"}
        >
          {showForm ? "Cancel" : "+ Mockup"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="mt-3 p-3 space-y-2" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://mockup.example.com"
            type="url"
            required
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
          <input
            value={repo}
            onChange={e => setRepo(e.target.value)}
            placeholder="github.com/.../repo (optional)"
            className="w-full text-sm px-3 py-2 outline-none"
            style={{ background: "rgba(0,0,0,0.3)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.9)" }}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !url.trim()}
              className="text-[10px] tracking-wider font-bold px-3 py-1.5 disabled:opacity-30"
              style={{ background: `${C.success}12`, border: `1px solid ${C.success}40`, color: C.success }}
            >
              {submitting ? "SAVING..." : "▸ ADD"}
            </button>
          </div>
        </form>
      )}

      {loading ? <div className="mt-2"><HudSkeleton /></div> : items.length === 0 ? (
        <p className="mt-3 text-[11px] py-4 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>
          NO MOCKUPS YET
        </p>
      ) : (
        <ul className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          {items.map(m => (
            <li key={m.id}>
              <HudCard>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <a
                      href={m.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm truncate block hover:opacity-80"
                      style={{ color: `${C.primary}CC` }}
                    >
                      {m.url}
                    </a>
                    {m.repo && (
                      <p className="text-[10px] truncate mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{m.repo}</p>
                    )}
                    {m.buildSlug && (
                      <p className="text-[10px] mt-0.5" style={{ color: `${C.primary}50` }}>build · {m.buildSlug}</p>
                    )}
                  </div>
                  <HudBadge label={m.status.toUpperCase()} color={statusColor(m.status)} />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <StarRating
                    value={m.qualityRating ?? 0}
                    onChange={r => update(m.id, { qualityRating: r as 1 | 2 | 3 | 4 | 5 })}
                  />
                  <button
                    onClick={() => update(m.id, { sent: !m.sent })}
                    className="text-[10px] tracking-wider font-bold px-2.5 py-1"
                    style={{
                      background: m.sent ? `${C.success}12` : C.surface,
                      border: `1px solid ${m.sent ? `${C.success}40` : C.border}`,
                      color: m.sent ? C.success : "rgba(255,255,255,0.4)",
                    }}
                  >
                    {m.sent ? "✓ SENT" : "MARK SENT"}
                  </button>
                </div>
              </HudCard>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className="text-base leading-none px-0.5"
          style={{ color: n <= value ? C.warning : "rgba(255,255,255,0.15)" }}
          aria-label={`${n} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
