'use client'

import React from 'react'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
  width?: number
  iconOnly?: boolean
}

export default function Logo({ variant = 'dark', className = '', width = 160, iconOnly = false }: LogoProps) {
  const iconSize = 36
  const textColor = variant === 'dark' ? '#1A1815' : '#FFFFFF'
  const accentColor = '#C8956C'
  const accentLight = '#D4A67D'

  if (iconOnly) {
    return (
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="CL Solutions"
      >
        <LogoMark accentColor={accentColor} accentLight={accentLight} />
      </svg>
    )
  }

  const height = Math.round(width * 0.25)

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="CL Solutions"
    >
      <g transform="translate(2, 2)">
        <LogoMark accentColor={accentColor} accentLight={accentLight} />
      </g>

      {/* CL — bold */}
      <text
        x="44"
        y="28"
        fontFamily="system-ui, -apple-system, 'Helvetica Neue', sans-serif"
        fontSize="20"
        fontWeight="800"
        letterSpacing="1"
        fill={textColor}
      >
        CL
      </text>

      {/* SOLUTIONS — lighter weight, tracked */}
      <text
        x="72"
        y="28"
        fontFamily="system-ui, -apple-system, 'Helvetica Neue', sans-serif"
        fontSize="20"
        fontWeight="300"
        letterSpacing="0.5"
        fill={textColor}
      >
        Solutions
      </text>
    </svg>
  )
}

function LogoMark({ accentColor, accentLight }: { accentColor: string; accentLight: string }) {
  return (
    <>
      {/* Abstract angular spiral — two interlocking shapes that suggest motion/code brackets
          Inspired by: NVIDIA's contained mark, iDIAL's swirl, EZMID's diagonal stripes */}

      {/* Outer bracket/arc — the "C" */}
      <path
        d="M26 4C14.954 4 6 12.954 6 24c0 3.866 1.097 7.473 2.997 10.528"
        stroke={accentColor}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Inner angular element — the "L" / forward motion */}
      <path
        d="M18 10L10 22l8 12"
        stroke={accentLight}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Accent dot — tech feel */}
      <circle cx="30" cy="8" r="3" fill={accentColor} />
    </>
  )
}
