'use client'

// SmoothScroll — no-op.
//
// Previously used Lenis for inertial scrolling. Lenis's wheel-capture
// behaviour on pages with heavy backdrop-filter/gradient-mesh sections
// felt like scroll was stalling past mid-page. Native scrolling with
// `scroll-behavior: smooth` (set in globals) is responsive enough
// without the quirks. Keeping this component as an import anchor so
// layout.tsx doesn't need to change.

export default function SmoothScroll() {
  return null
}
