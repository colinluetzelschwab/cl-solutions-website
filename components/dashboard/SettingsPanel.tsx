'use client'

import { ExternalLink } from 'lucide-react'

interface QuickLink {
  label: string
  href: string
  description: string
}

const quickLinks: QuickLink[] = [
  {
    label: 'Vercel Dashboard',
    href: 'https://vercel.com/dashboard',
    description: 'Manage deployments and domains',
  },
  {
    label: 'Vercel Blob Storage',
    href: 'https://vercel.com/dashboard/stores',
    description: 'View uploaded files and briefs',
  },
  {
    label: 'Resend Dashboard',
    href: 'https://resend.com/overview',
    description: 'Email delivery logs',
  },
  {
    label: 'CL Solutions Website',
    href: 'https://clsolutions.ch',
    description: 'Live production site',
  },
]

export default function SettingsPanel() {
  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-base font-semibold text-text-primary mb-1">
          Settings
        </h2>
        <p className="text-sm text-text-secondary">
          Dashboard configuration and quick links.
        </p>
      </div>

      {/* Environment status */}
      <div className="bg-background-surface border border-border-subtle p-4">
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Environment
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">DASHBOARD_PASSWORD</span>
            <span className="text-green-400 text-xs">Configured</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">VERCEL_API_TOKEN</span>
            <span className="text-text-muted text-xs">Set on Vercel</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-text-secondary">VERCEL_TEAM_ID</span>
            <span className="text-text-muted text-xs">Set on Vercel</span>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Quick Links
        </h3>
        <div className="space-y-2">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-background-surface border border-border-subtle p-3 hover:border-border-default transition-colors group"
            >
              <div>
                <p className="text-sm text-text-primary group-hover:text-accent-blue transition-colors">
                  {link.label}
                </p>
                <p className="text-xs text-text-muted">{link.description}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-text-muted group-hover:text-accent-blue transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
