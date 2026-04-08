'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

const navLinks = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Contact', href: '/contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Imprint', href: '/imprint' },
]

export default function Footer() {
  return (
    <footer className="w-full border-t border-border-subtle bg-background-primary relative">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col space-y-6">
          {/* Top Section: Logo and Nav Links */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/images/cl-solutions-light.png"
                  alt="CL Solutions"
                  width={100}
                  height={33}
                  className="h-7 w-auto"
                />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Legal Links */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-text-muted hover:text-text-secondary transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom Section: Email and Copyright */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 pt-4 border-t border-border-subtle">
            {/* Email */}
            <div className="flex items-center space-x-2 text-text-muted">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:colin@clsolutions.dev"
                className="text-sm hover:text-text-secondary transition-colors duration-200"
              >
                colin@clsolutions.dev
              </a>
            </div>

            {/* Copyright */}
            <p className="text-sm text-text-muted">
              © 2026 CL Solutions. Switzerland.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
