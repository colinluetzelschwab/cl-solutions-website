'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import Logo from '@/components/ui/Logo'

interface NavLink {
  label: string
  href: string
}

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isMobileMenuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background-primary/80 backdrop-blur-xl border-b border-border-subtle/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Logo variant="dark" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-5 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact/start"
                className="ml-4 px-6 py-2.5 text-sm font-medium bg-text-primary text-background-primary hover:bg-text-primary/90 transition-colors duration-200"
              >
                Start a Project
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-text-primary"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="absolute inset-0 bg-background-primary/95 backdrop-blur-lg"
          onClick={() => setIsMobileMenuOpen(false)}
        />

        <div
          className={`absolute top-16 left-0 right-0 bottom-0 flex flex-col items-start justify-center px-10 transition-transform duration-300 ${
            isMobileMenuOpen ? 'translate-y-0' : '-translate-y-8 opacity-0'
          }`}
        >
          {navLinks.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-4xl sm:text-5xl font-light text-text-primary hover:text-accent-blue transition-colors duration-200 py-4"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{ transitionDelay: `${i * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-8 pt-8 border-t border-border-subtle w-full">
            <Link
              href="/contact/start"
              className="inline-block px-8 py-4 text-base font-medium bg-text-primary text-background-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Start a Project
            </Link>
          </div>
          <p className="mt-auto pb-12 text-xs text-text-muted">
            colin@clsolutions.dev
          </p>
        </div>
      </div>
    </>
  )
}
