"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, ExternalLink, Rocket, Loader2 } from "lucide-react";
import type { BriefSummary } from "./InboxTab";

interface BriefSheetProps {
  brief: BriefSummary | null;
  onClose: () => void;
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

function formatDate(dateString: string): string {
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function generateBuildCommand(brief: BriefSummary): string {
  return `claude -p "Build website for ${brief.clientName} from brief ${brief.blobUrl}" --allowedTools "Bash,Read,Write,Edit" --output-format json`;
}

export default function BriefSheet({ brief, onClose }: BriefSheetProps) {
  const [visible, setVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [building, setBuilding] = useState(false);
  const [buildStatus, setBuildStatus] = useState<string | null>(null);
  const [buildSlug, setBuildSlug] = useState<string | null>(null);
  const [buildLog, setBuildLog] = useState<string | null>(null);
  const [buildComplete, setBuildComplete] = useState(false);

  // Poll build status every 5s when building
  useEffect(() => {
    if (!buildSlug || buildComplete) return;
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/dashboard/build", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug: buildSlug }),
        });
        const data = await res.json();
        if (data.log) setBuildLog(data.log);
        if (data.status === "complete") {
          setBuildComplete(true);
          setBuildStatus("✅ Build fertig! " + buildSlug + ".vercel.app");
          setBuilding(false);
        }
      } catch { /* ignore polling errors */ }
    }, 5000);
    return () => clearInterval(interval);
  }, [buildSlug, buildComplete]);

  // Open animation
  useEffect(() => {
    if (brief) {
      setVisible(true);
      // Delay sheet slide-up by one frame so the overlay renders first
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSheetOpen(true);
        });
      });
    } else {
      setSheetOpen(false);
    }
  }, [brief]);

  // Close handler with animation
  const handleClose = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => {
      setVisible(false);
      onClose();
    }, 200);
  }, [onClose]);

  const handleCopy = useCallback(async () => {
    if (!brief) return;
    try {
      await navigator.clipboard.writeText(generateBuildCommand(brief));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error("Clipboard write failed");
    }
  }, [brief]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ${
          sheetOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] bg-background-surface rounded-t-3xl flex flex-col transition-transform ease-out ${
          sheetOpen
            ? "translate-y-0 duration-300"
            : "translate-y-full duration-200"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 bg-text-muted/30 rounded-full" />
        </div>

        {/* Scrollable content */}
        {brief && (
          <div className="overflow-y-auto px-5 py-4 flex-1">
            {/* Client name */}
            <h2 className="text-xl font-bold text-text-primary">
              {brief.clientName}
            </h2>

            {/* Email */}
            <p className="text-sm text-text-secondary mt-1">{brief.email}</p>

            {/* Divider */}
            <div className="border-b border-border-subtle my-4" />

            {/* Package + Price */}
            <div className="flex items-center justify-between">
              <span className="bg-accent-blue/15 text-accent-blue text-xs px-3 py-1 rounded-full font-medium">
                {formatPackage(brief.packageId)}
              </span>
              <div className="flex items-center gap-2">
                {brief.couponUsed && (
                  <span className="text-green-400 text-xs font-medium">
                    Coupon applied
                  </span>
                )}
                <span className="text-2xl font-bold text-accent-blue">
                  {formatPrice(brief.totalPrice)}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-b border-border-subtle my-4" />

            {/* Timestamp */}
            <p className="text-sm text-text-muted">
              Submitted {formatDate(brief.createdAt)}
            </p>

            {/* Divider */}
            <div className="border-b border-border-subtle my-4" />

            {/* Actions */}
            <div className="space-y-3 pb-2">
              {/* Build starten Button */}
              <button
                onClick={async () => {
                  if (!brief || building) return;
                  setBuilding(true);
                  setBuildStatus(null);
                  try {
                    const res = await fetch("/api/dashboard/build", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        briefUrl: brief.blobUrl,
                        clientName: brief.clientName,
                      }),
                    });
                    const data = await res.json();
                    if (data.success) {
                      setBuildSlug(data.slug);
                      setBuildStatus("⏳ Build läuft... " + data.slug);
                      setBuildComplete(false);
                    } else {
                      setBuildStatus("Fehler: " + (data.error || "Unknown"));
                    }
                  } catch {
                    setBuildStatus("VPS nicht erreichbar");
                  } finally {
                    setBuilding(false);
                  }
                }}
                disabled={building}
                className="w-full h-14 bg-green-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 active:opacity-80 transition-opacity disabled:opacity-50"
              >
                {building ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" strokeWidth={1.5} />
                    Build starten
                  </>
                )}
              </button>

              {buildStatus && (
                <div className="space-y-2">
                  <p className={`text-center text-sm font-medium ${
                    buildStatus.startsWith("Fehler") || buildStatus.startsWith("VPS")
                      ? "text-red-400"
                      : buildStatus.startsWith("✅")
                        ? "text-green-400"
                        : "text-amber-400"
                  }`}>
                    {buildStatus}
                  </p>
                  {buildLog && !buildComplete && (
                    <div className="bg-background-elevated rounded-lg p-3 max-h-32 overflow-y-auto">
                      <pre className="text-[10px] text-text-muted font-mono whitespace-pre-wrap break-all leading-relaxed">
                        {buildLog}
                      </pre>
                    </div>
                  )}
                  {buildComplete && buildSlug && (
                    <a
                      href={`https://${buildSlug}.vercel.app`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 text-sm text-accent-blue py-2 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {buildSlug}.vercel.app öffnen
                    </a>
                  )}
                </div>
              )}

              {/* Copy Command als Fallback */}
              <button
                onClick={handleCopy}
                className="w-full h-12 border border-border-default text-text-secondary font-medium rounded-xl flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" strokeWidth={1.5} />
                    Copy Command (manual)
                  </>
                )}
              </button>

              <a
                href={brief.blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-sm text-text-muted py-3 active:text-text-secondary transition-colors"
              >
                <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                View Full Brief
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
