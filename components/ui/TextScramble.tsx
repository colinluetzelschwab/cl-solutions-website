'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const GLYPHS = '!<>-_\\/[]{}—=+*^?#________'

interface TextScrambleProps {
  text: string
  className?: string
  durationMs?: number
  triggerOnView?: boolean
  as?: React.ElementType
}

export default function TextScramble({
  text,
  className,
  durationMs = 900,
  triggerOnView = true,
  as: Tag = 'span',
}: TextScrambleProps) {
  const [output, setOutput] = useState(text)
  const ref = useRef<HTMLElement | null>(null)
  const started = useRef(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) { setOutput(text); return }

    const start = () => {
      if (started.current) return
      started.current = true
      const len = text.length
      const steps = Math.max(12, Math.floor(durationMs / 40))
      let frame = 0
      const tick = () => {
        const progress = frame / steps
        const revealCount = Math.floor(progress * len)
        let out = ''
        for (let i = 0; i < len; i++) {
          if (i < revealCount || text[i] === ' ') {
            out += text[i]
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          }
        }
        setOutput(out)
        frame++
        if (frame <= steps) {
          requestAnimationFrame(tick)
        } else {
          setOutput(text)
        }
      }
      requestAnimationFrame(tick)
    }

    if (!triggerOnView) { start(); return }

    const node = ref.current
    if (!node) { start(); return }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start()
          io.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    io.observe(node)
    // 900ms fallback in case IO skips (known Chrome quirk under smooth-scroll libs)
    const fallback = window.setTimeout(() => start(), 900)
    return () => { io.disconnect(); window.clearTimeout(fallback) }
  }, [text, durationMs, triggerOnView, reduce])

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={className}
      aria-label={text}
      data-scramble
    >
      {output}
    </Tag>
  )
}
