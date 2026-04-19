'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import ThemeToggle from '@/components/ui/ThemeToggle'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Work',     href: '/work' },
  { label: 'Contact',  href: '/contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoverKey, setHoverKey] = useState<string | null>(null)

  // Determine active link — match exact route or section prefix.
  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname === href || pathname?.startsWith(href + '/')
  }

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  // Close mobile menu on route change
  useEffect(() => { setIsMobileMenuOpen(false) }, [pathname])

  return (
    <>
      <nav
        aria-label="Primary"
        className="fixed top-4 md:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[960px]"
      >
        <div className="nav-pill flex items-center justify-between px-3 md:px-4 py-2">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center rounded-full pl-1.5 pr-3 py-1 hover:bg-[color:var(--surface-2)]/60 transition-colors"
            aria-label="CL Solutions — Home"
          >
            <Logo />
          </Link>

          {/* Desktop links */}
          <div
            className="hidden lg:flex items-center gap-0.5 relative"
            onMouseLeave={() => setHoverKey(null)}
          >
            {navLinks.map((link) => {
              const active = isActive(link.href)
              const hovered = hoverKey === link.href
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoverKey(link.href)}
                  className="relative px-4 py-2 text-[13px] tracking-tight text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors"
                >
                  {hovered && (
                    <motion.span
                      layoutId="nav-hover-pill"
                      className="absolute inset-0 rounded-full bg-[color:var(--surface-2)]/80 border border-[color:var(--border-subtle)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className={`relative z-10 ${active ? 'text-[color:var(--ink)]' : ''}`}>
                    {link.label}
                  </span>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-1/2 -translate-x-1/2 bottom-1 h-[2px] w-1 rounded-full bg-[color:var(--accent-bright)] shadow-[0_0_6px_var(--accent-glow)]"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* CTA + theme toggle + mobile toggle */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/contact/start"
              className="hidden md:inline-flex btn btn-primary !py-1.5 !px-3.5 text-[12px]"
            >
              Start a Project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              className="lg:hidden inline-flex items-center justify-center h-9 w-9 rounded-full border border-[color:var(--border-subtle)] text-[color:var(--ink)] hover:bg-[color:var(--surface-2)]/70 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-[color:var(--paper-dark)]/92 backdrop-blur-2xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex h-full flex-col justify-between px-8 pt-28 pb-12">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between border-b border-[color:var(--border-subtle)] py-5 text-3xl sm:text-4xl font-medium tracking-tight text-[color:var(--ink)]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="h-5 w-5 text-[color:var(--ink-faint)] group-hover:text-[color:var(--accent-bright)] transition-colors" />
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-4"
              >
                <Link
                  href="/contact/start"
                  className="btn btn-primary w-full justify-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Start a Project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <p className="text-xs text-[color:var(--ink-faint)] tracking-wide">
                  colin@clsolutions.dev
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
