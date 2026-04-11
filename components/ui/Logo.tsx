'use client'

import React from 'react'

interface LogoProps {
  variant?: 'dark' | 'light'
  className?: string
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const color = variant === 'dark' ? 'text-text-primary' : 'text-white'

  return (
    <span className={`inline-flex items-baseline select-none ${color} ${className}`} aria-label="CL Solutions">
      <span className="text-xl md:text-2xl font-bold tracking-tight">cls</span>
      <span className="text-xl md:text-2xl font-bold tracking-tight text-[#C8956C]">.</span>
    </span>
  )
}
