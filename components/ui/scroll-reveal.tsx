// ScrollReveal — intentionally a no-op passthrough.
//
// The previous implementation hid children at opacity:0 and revealed them
// on IntersectionObserver intersection. Under Lenis smooth scroll this was
// chronically unreliable: Chrome occasionally skipped the paint-commit
// when the style flipped while the element was off-screen, leaving blocks
// permanently invisible and creating large blank "dead zones" on pages
// like /services that looked like the page had stopped scrolling.
//
// Every attempted fix (fallback timers, post-commit reflow via display
// toggle, RAF-delayed commits) reliably fixed SOME trigger paths but not
// all of them. Correctness outweighs the cosmetic reveal, so the reveal
// has been removed. Content is always rendered visible.
//
// Re-introduce scroll-triggered reveal later with a CSS @keyframes /
// animation-timeline approach (compositor-driven, not style-driven) if
// desired. Do not bring back the opacity-transition version.

import React from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  // Kept for API compatibility with existing call sites — all ignored.
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
}

export default function ScrollReveal({
  children,
  className,
}: ScrollRevealProps) {
  return <div className={className}>{children}</div>
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className,
}: StaggerContainerProps) {
  return <div className={className}>{children}</div>
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  isVisible?: boolean
  delay?: number
}) {
  return <div className={className}>{children}</div>
}
