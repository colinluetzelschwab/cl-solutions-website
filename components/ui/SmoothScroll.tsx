'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

// SmoothScroll — Lenis-driven inertial wheel scrolling.
//
// Disabled inside the JARVIS dashboard (`/jarvis/*`): JARVIS scrolls
// inside <main> rather than on window, and Lenis intercepts wheel events
// at the window level which prevents inner-pane scroll from working.

export default function SmoothScroll() {
  const pathname = usePathname()
  const isJarvis = pathname?.startsWith('/jarvis')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isJarvis) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.14,
      wheelMultiplier: 1,
      smoothWheel: true,
    })

    // Expose the instance so scroll-commit triggers (e.g. HeroContent's
    // curtain-close auto-scroll) can drive smooth jumps without each
    // consumer instantiating its own Lenis.
    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [isJarvis])

  return null
}
