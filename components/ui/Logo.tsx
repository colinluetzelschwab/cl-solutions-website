'use client'

import React from 'react'

interface LogoProps {
  className?: string
}

// Editorial serif logotype — "cls." set in Instrument Serif italic with a
// warm burgundy period. Replaces the earlier geometric "CL" mark. Pairs
// with Ravi Klaassens / Lolo / Tom Carder references where the wordmark
// is the full identity (no separate bug/mark).
export default function Logo({ className = '' }: LogoProps) {
  return (
    <span
      className={`inline-flex items-baseline select-none ${className}`}
      aria-label="CL Solutions"
    >
      <span className="display text-[20px] md:text-[22px] tracking-[-0.01em] text-[color:var(--ink)] lowercase">
        cls
      </span>
      <span className="display text-[20px] md:text-[22px] tracking-[-0.01em] text-[color:var(--accent)]">
        .
      </span>
    </span>
  )
}
