'use client'

import React from 'react'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
  width?: number
  iconOnly?: boolean
}

/**
 * CL Solutions Logo
 *
 * Mark: Two overlapping angular brackets forming a "CL" monogram.
 * The left bracket (C) and right vertical+base (L) interlock,
 * creating depth through overlapping opacity.
 *
 * Inspired by: EZMID's diagonal energy, Howel's geometric simplicity,
 * NVIDIA's contained bold mark.
 */
export default function Logo({ variant = 'dark', className = '', width = 150, iconOnly = false }: LogoProps) {
  const textColor = variant === 'dark' ? '#1A1815' : '#FFFFFF'
  const markColor = variant === 'dark' ? '#1A1815' : '#FFFFFF'
  const accentColor = '#C8956C'

  if (iconOnly) {
    return (
      <svg
        width={36}
        height={36}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="CL Solutions"
      >
        <Mark color={markColor} accent={accentColor} />
      </svg>
    )
  }

  return (
    <svg
      width={width}
      height={Math.round(width * 0.24)}
      viewBox="0 0 150 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CL Solutions"
    >
      {/* Mark */}
      <Mark color={markColor} accent={accentColor} />

      {/* Text — CL bold, Solutions light */}
      <text
        x="44"
        y="24.5"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="18"
        fontWeight="700"
        letterSpacing="1.5"
        fill={textColor}
      >
        CL
      </text>
      <text
        x="71"
        y="24.5"
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif"
        fontSize="18"
        fontWeight="300"
        letterSpacing="0.5"
        fill={textColor}
        opacity="0.7"
      >
        Solutions
      </text>
    </svg>
  )
}

function Mark({ color, accent }: { color: string; accent: string }) {
  return (
    <g>
      {/* Background square — subtle, grounds the mark */}
      <rect x="2" y="2" width="32" height="32" rx="4" fill={accent} opacity="0.08" />

      {/* "C" — open angular bracket */}
      <path
        d="M22 7L10 18L22 29"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* "L" — vertical + horizontal base */}
      <path
        d="M18 7V29H28"
        stroke={accent}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </g>
  )
}
