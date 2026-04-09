"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, Mail } from "lucide-react";
import BriefSheet from "./BriefSheet";

export interface BriefSummary {
  id: string;
  clientName: string;
  email: string;
  packageId: string;
  totalPrice: number;
  createdAt: string;
  couponUsed: boolean;
  blobUrl: string;
}

function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return "Yesterday";
  if (diffDay < 7) return `${diffDay}d ago`;

  const d = new Date(dateString);
  const day = d.getDate();
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${day} ${months[d.getMonth()]}`;
}

function formatPackage(packageId: string): string {
  const map: Record<string, string> = {
    starter: "Starter",
    business: "Business",
    pro: "Pro",
  };
  return map[packageId] ?? packageId;
}

function formatPrice(price: number): string {
  return `CHF ${price.toLocaleString("de-CH")}`;
}

function SkeletonRows() {
  return (
    <div className="px-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="py-4 border-b border-border-subtle flex justify-between items-center"
        >
          <div className="flex flex-col gap-2">
            <div className="h-4 w-36 bg-background-elevated rounded animate-pulse" />
            <div className="h-3 w-48 bg-background-elevated rounded animate-pulse" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-16 bg-background-elevated rounded-full animate-pulse" />
            <div className="h-3 w-12 bg-background-elevated rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function InboxTab() {
  const [briefs, setBriefs] = useState<BriefSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<BriefSummary | null>(null);

  const fetchBriefs = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/dashboard/briefs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setBriefs(data.briefs ?? []);
    } catch (err) {
      console.error("Failed to load briefs:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBriefs();
  }, [fetchBriefs]);

  return (
    <>
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-text-primary">Inbox</h1>
          {briefs.length > 0 && (
            <span className="bg-accent-blue text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium">
              {briefs.length}
            </span>
          )}
        </div>
        <button
          onClick={() => fetchBriefs(true)}
          disabled={refreshing}
          className="p-2 -mr-2 text-text-muted active:text-text-secondary transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw
            className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            strokeWidth={1.5}
          />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <SkeletonRows />
      ) : briefs.length === 0 ? (
        <div className="flex flex-col items-center justify-center pt-32 text-text-muted">
          <Mail className="w-10 h-10 mb-3 opacity-40" strokeWidth={1.2} />
          <p className="text-sm">No briefs yet</p>
        </div>
      ) : (
        <div className="px-4">
          {briefs.map((brief) => (
            <button
              key={brief.id}
              onClick={() => setSelectedBrief(brief)}
              className="w-full text-left py-4 border-b border-border-subtle flex justify-between items-start gap-3 active:bg-background-elevated/50 transition-colors"
            >
              {/* Left */}
              <div className="flex flex-col min-w-0">
                <span className="text-base font-medium text-text-primary truncate">
                  {brief.clientName}
                </span>
                <span className="text-xs text-text-muted truncate mt-0.5">
                  {brief.email}
                </span>
              </div>

              {/* Right */}
              <div className="flex flex-col items-end shrink-0">
                <span className="bg-accent-blue/15 text-accent-blue text-[10px] px-2 py-0.5 rounded-full font-medium">
                  {formatPackage(brief.packageId)}
                </span>
                <span className="text-[11px] text-text-muted mt-1">
                  {formatRelativeTime(brief.createdAt)}
                </span>
                <span className="text-xs text-text-secondary font-medium mt-0.5">
                  {formatPrice(brief.totalPrice)}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Brief Sheet */}
      <BriefSheet
        brief={selectedBrief}
        onClose={() => setSelectedBrief(null)}
      />
    </>
  );
}
