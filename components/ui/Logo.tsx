'use client'

import React from 'react'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
  iconOnly?: boolean
}

/**
 * CL Solutions Logo
 *
 * Monogram: C and L share their left vertical stroke, forming one
 * interlocked geometric mark (inspired by Lando Norris "LN" approach).
 *
 * The C's curve wraps from top, the L's base extends right.
 * Together they read as "CL" in a single connected shape.
 */
export default function Logo({ variant = 'dark', className = '', iconOnly = false }: LogoProps) {
  const color = variant === 'dark' ? '#1A1815' : '#FFFFFF'

  if (iconOnly) {
    return (
      <svg
        width={32}
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="CL Solutions"
      >
        <CLMark color={color} />
      </svg>
    )
  }

  return (
    <span className={`inline-flex items-center gap-2.5 select-none ${className}`} aria-label="CL Solutions">
      <svg
        width={28}
        height={28}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <CLMark color={color} />
      </svg>
      <span className={`text-lg md:text-xl tracking-tight ${variant === 'dark' ? 'text-text-primary' : 'text-white'}`}>
        <span className="font-semibold">CL</span>
        <span className="font-[family-name:var(--font-display)] italic opacity-50 ml-1">Solutions</span>
      </span>
    </span>
  )
}

function CLMark({ color }: { color: string }) {
  return (
    <>
      {/*
        CL monogram — single connected shape:

        The "C" is the top-left arc curving from right-top → left → down
        The "L" shares the left vertical and extends a base to the right

        Shape breakdown:
        - Start top-right (end of C's top arm)
        - Curve left and down (C shape)
        - Continue straight down (shared vertical = left side of L)
        - Turn right at bottom (L base)
        - End at bottom-right

        This creates one continuous, bold geometric mark.
      */}
      <path
        d={[
          // C top arm: start at top-right
          'M22 5',
          // Horizontal left to start of curve
          'H14',
          // Curve down-left for the C
          'C8 5 4 10 4 16',
          // L vertical: continue straight down
          'V27',
          // L base: horizontal right
          'H22',
          // L base bottom edge: go back left
          'V23',
          // L inner corner
          'H8',
          // Go back up through the C interior
          'V16',
          // C inner curve back up
          'C8 12.5 10.5 9 14 9',
          // C top arm inner edge
          'H22',
          // Close
          'Z',
        ].join(' ')}
        fill={color}
      />
    </>
  )
}
