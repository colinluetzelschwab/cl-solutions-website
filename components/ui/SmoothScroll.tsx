'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

// SmoothScroll — Lenis-driven inertial wheel scrolling.
//
// The page's scroll feel is the foundation of the "experience" — without
// it, scroll-driven reveals just look like CSS transitions on isolated
// elements. With Lenis the whole page moves like a film reel.
//
// Tuning notes:
//   · `lerp: 0.14` — snappier than the default 0.1. At 0.1 wheel input
//     takes ~700ms to fully settle, which feels like "the page is
//     hanging" on long content pages. 0.14 cuts settling time roughly
//     in half while keeping the silky cinematic feel on the homepage.
//   · `wheelMultiplier: 1` keeps native scroll distance (don't accelerate).
//   · `smoothWheel: true` — desktop trackpads/mice get inertia.
//   · Touch is left to the native browser (no `smoothTouch`) — iOS
//     momentum scroll already feels right and smoothing it tends to
//     fight the OS.
//   · Respects `prefers-reduced-motion` by destroying the instance.

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      lerp: 0.14,
      wheelMultiplier: 1,
      smoothWheel: true,
    })

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return null
}
