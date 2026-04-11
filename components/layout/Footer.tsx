'use client'

import React from 'react'
import Link from 'next/link'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle bg-background-primary">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10 md:py-14">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Left — Logo + tagline */}
          <div>
            <Link href="/">
              <Logo variant="dark" />
            </Link>
            <p className="text-xs text-text-muted mt-3">Web Design Studio · Switzerland</p>
          </div>

          {/* Center — nav */}
          <nav className="flex gap-6">
            {['Services', 'Work', 'Contact'].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                {l}
              </Link>
            ))}
          </nav>

          {/* Right — email */}
          <a href="mailto:colin@clsolutions.dev" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
            colin@clsolutions.dev
          </a>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-10 pt-6 border-t border-border-subtle">
          <p className="text-xs text-text-muted">© 2026 CL Solutions</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Privacy</Link>
            <Link href="/imprint" className="text-xs text-text-muted hover:text-text-secondary transition-colors">Imprint</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
