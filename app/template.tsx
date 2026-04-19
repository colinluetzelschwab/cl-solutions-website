'use client'

// Page transition wrapper — fade + slight y-translate on route change.
// Uses Next App Router `template.tsx` semantics: a new instance is created
// for every navigation, so we can lean on Framer's mount animation without
// needing AnimatePresence's mode="wait" gymnastics.

import React from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.36, ease: EASE }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  )
}
