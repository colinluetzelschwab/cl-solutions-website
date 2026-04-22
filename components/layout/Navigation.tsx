'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'

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
  const [scrolled, setScrolled] = useState(false)

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

  // Track scroll so we can fade the pill background out on the homepage hero.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'
  // Hero mode = homepage AND at the very top AND no mobile menu open.
  // In hero mode: no pill background, nav items render white over the dark hero.
  const heroMode = isHome && !scrolled && !isMobileMenuOpen

  return (
    <>
      <div className="fixed top-4 md:top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-[960px]">
        <nav aria-label="Primary" className="relative">
          {/* Animated pill background — fades out only on homepage hero */}
          <motion.div
            aria-hidden
            className="nav-pill absolute inset-0 pointer-events-none"
            initial={false}
            animate={{ opacity: heroMode ? 0 : 1 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            data-theme={heroMode ? 'dark' : undefined}
            className="relative flex items-center justify-between px-3 md:px-4 py-2 transition-colors duration-300"
          >
          {/* Logo — hidden during homepage hero mode */}
          <Link
            href="/"
            aria-label="CL Solutions — Home"
            aria-hidden={heroMode}
            tabIndex={heroMode ? -1 : 0}
            className={`flex items-center rounded-full pl-1.5 pr-3 py-1 hover:bg-[color:var(--surface-2)]/60 transition-all duration-300 ${
              heroMode ? 'opacity-0 pointer-events-none -translate-x-1' : 'opacity-100'
            }`}
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

          {/* Mobile toggle */}
          <div className="flex items-center gap-2">
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
      </div>

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
