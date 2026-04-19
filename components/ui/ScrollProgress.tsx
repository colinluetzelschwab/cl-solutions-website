'use client'

import React from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

// Ambient scroll progress — thin burgundy line pinned to the top of the
// viewport, scaleX driven by `useScroll()`. Raviklaassens + editorial
// studios often use this as a quiet signal of page depth.

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 36,
    restDelta: 0.001,
  })

  return (
    <motion.div
      aria-hidden
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-[color:var(--accent)]"
      style={{ scaleX }}
    />
  )
}
