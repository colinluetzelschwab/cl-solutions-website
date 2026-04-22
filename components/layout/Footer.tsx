'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer className="relative mt-24 md:mt-32 w-full">
      {/* Top gradient divider */}
      <div className="divider-gradient w-full" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand block */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" aria-label="CL Solutions — Home">
              <Logo />
            </Link>
            <p className="measure text-sm text-[color:var(--ink-muted)] leading-relaxed">
              An independent boutique studio building fast, custom websites for
              founders anywhere. Fixed scope. Fixed pricing. Shipped in a week.
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <p className="eyebrow mb-4">Explore</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Services', href: '/services' },
                { label: 'Work', href: '/work' },
                { label: 'Contact', href: '/contact' },
                { label: 'Start a project', href: '/contact/start' },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach */}
          <div className="md:col-span-4">
            <p className="eyebrow mb-4">Reach</p>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a
                  href="mailto:colin@clsolutions.dev"
                  className="text-sm text-[color:var(--ink)] hover:text-[color:var(--accent-bright)] transition-colors inline-flex items-center gap-1.5 group"
                >
                  colin@clsolutions.dev
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </a>
              </li>
              <li className="text-sm text-[color:var(--ink-muted)]">Zurich · Helsinki</li>
              <li className="text-sm text-[color:var(--ink-muted)]">Response ≤ 24 h</li>
            </ul>
          </div>
        </div>

        {/* Base row — editorial sendoff */}
        <div className="mt-14 pt-6 border-t border-[color:var(--border-subtle)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-[color:var(--ink-faint)] tabular">
            © 2026 CL Solutions · Designed &amp; built by{' '}
            <span className="serif-italic text-[color:var(--ink-muted)]">Colin L&uuml;tzelschwab</span>
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-[color:var(--ink-faint)] hover:text-[color:var(--ink-muted)] transition-colors">
              Privacy
            </Link>
            <Link href="/imprint" className="text-xs text-[color:var(--ink-faint)] hover:text-[color:var(--ink-muted)] transition-colors">
              Imprint
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
