'use client'

import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number  // 0–1, default 0.28
}

export default function MagneticButton({
  children,
  className,
  strength = 0.28,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const reduce = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.4 })
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.4 })

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const relX = (e.clientX - (r.left + r.width / 2)) * strength
    const relY = (e.clientY - (r.top + r.height / 2)) * strength
    mx.set(relX)
    my.set(relY)
  }

  const handleLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={`inline-block ${className ?? ''}`}
    >
      {children}
    </motion.div>
  )
}
