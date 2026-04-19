'use client'

// ScrollReveal — passthrough (no-op).
//
// Previous attempts at reveal animations (Framer whileInView + Lenis,
// then CSS + IO) ran into a compositor/cascade issue that left some
// scrolled-past sections stuck at opacity:0. Because correctness beats
// cosmetic reveals, we render all content visible. Individual sections
// still use Framer motion at mount (see HeroContent, CTABanner, etc.),
// so the site is not motionless — it just doesn't hide then reveal
// entire below-the-fold blocks.

import React from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

export default function ScrollReveal({ children, className }: ScrollRevealProps) {
  return <div className={className}>{children}</div>
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
}

export function StaggerContainer({ children, className }: StaggerContainerProps) {
  return <div className={className}>{children}</div>
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return <div className={className}>{children}</div>
}
