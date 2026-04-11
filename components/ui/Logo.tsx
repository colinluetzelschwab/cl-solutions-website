'use client'

import React from 'react'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
}

/**
 * CL Solutions Logo — Pure typographic.
 *
 * "CL" in bold sans-serif + "Solutions" in italic serif.
 * The contrast between geometric sans and elegant serif
 * communicates: technical precision meets design craft.
 *
 * Uses the fonts already loaded in layout.tsx:
 * - Geist (sans) for "CL"
 * - Instrument Serif (italic) for "Solutions"
 */
export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const color = variant === 'dark' ? 'text-text-primary' : 'text-white'

  return (
    <span className={`inline-flex items-baseline gap-1 select-none ${className}`} aria-label="CL Solutions">
      <span className={`font-sans text-lg md:text-xl font-bold tracking-tight ${color}`}>
        CL
      </span>
      <span className={`font-[family-name:var(--font-display)] text-lg md:text-xl italic ${color} opacity-60`}>
        Solutions
      </span>
    </span>
  )
}
