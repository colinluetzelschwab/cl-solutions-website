"use client";

import { useState } from "react";
import {
  ExternalLink,
  Link2,
  Mail,
  Globe,
  Server,
  LogOut,
  ChevronRight,
} from "lucide-react";

interface SettingsTabProps {
  onLogout: () => void;
}

interface LinkRow {
  icon: typeof ExternalLink;
  label: string;
  href: string;
}

const quickLinks: LinkRow[] = [
  {
    icon: ExternalLink,
    label: "Vercel Dashboard",
    href: "https://vercel.com/colinluetzelschwabs-projects",
  },
  {
    icon: Link2,
    label: "GitHub",
    href: "https://github.com/colinluetzelschwab",
  },
  {
    icon: Mail,
    label: "Resend",
    href: "https://resend.com",
  },
  {
    icon: Globe,
    label: "CL Solutions",
    href: "https://clsolutions.dev",
  },
];

export default function SettingsTab({ onLogout }: SettingsTabProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/dashboard/auth", { method: "DELETE" });
    } catch {
      // ignore — clear local state regardless
    }
    onLogout();
  };

  return (
    <div className="px-4 pt-4 pb-8">
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>

      {/* Quick Links */}
      <p className="mt-6 px-4 mb-2 text-xs uppercase tracking-wider text-text-muted">
        Quick Links
      </p>
      <div className="rounded-xl bg-background-surface overflow-hidden">
        {quickLinks.map(({ icon: Icon, label, href }, i) => (
          <button
            key={label}
            onClick={() => window.open(href, "_blank", "noopener")}
            className={`flex w-full items-center h-12 px-4 active:opacity-70 transition-opacity ${
              i < quickLinks.length - 1
                ? "border-b border-[rgba(255,255,255,0.06)]"
                : ""
            }`}
          >
            <Icon className="h-4 w-4 text-text-muted shrink-0" />
            <span className="ml-3 flex-1 text-sm text-text-primary text-left">
              {label}
            </span>
            <ChevronRight className="h-4 w-4 text-text-muted shrink-0" />
          </button>
        ))}
      </div>

      {/* VPS */}
      <p className="mt-6 px-4 mb-2 text-xs uppercase tracking-wider text-text-muted">
        VPS
      </p>
      <div className="rounded-xl bg-background-surface overflow-hidden">
        <div className="flex w-full items-center h-12 px-4">
          <Server className="h-4 w-4 text-text-muted shrink-0" />
          <span className="ml-3 flex-1 text-sm text-text-primary">
            Build Server
          </span>
          <span className="text-sm text-text-muted">Not configured</span>
        </div>
      </div>

      {/* Account */}
      <p className="mt-6 px-4 mb-2 text-xs uppercase tracking-wider text-text-muted">
        Account
      </p>
      <div className="rounded-xl bg-background-surface overflow-hidden">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex w-full items-center h-12 px-4 active:opacity-70 transition-opacity disabled:opacity-50"
        >
          <LogOut className="h-4 w-4 text-red-400 shrink-0" />
          <span className="ml-3 flex-1 text-sm text-red-400 text-left">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>

      {/* Version */}
      <p className="mt-8 text-center text-[11px] text-text-muted/50">
        CL Solutions Cockpit v1.0
      </p>
    </div>
  );
}
