'use client'

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' as const },
  },
}

function AbstractCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    const w = () => window.innerWidth
    const h = () => window.innerHeight

    const draw = () => {
      time += 0.003

      ctx.clearRect(0, 0, w(), h())

      // Base gradient — warm cream to slightly darker
      const bgGrad = ctx.createLinearGradient(0, 0, w(), h())
      bgGrad.addColorStop(0, '#F5F1EC')
      bgGrad.addColorStop(0.5, '#EDE8E0')
      bgGrad.addColorStop(1, '#E8E2D8')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, w(), h())

      // Flowing abstract shapes — soft amber/cream blobs
      for (let i = 0; i < 4; i++) {
        ctx.beginPath()
        const cx = w() * (0.3 + i * 0.2) + Math.sin(time + i * 1.5) * w() * 0.08
        const cy = h() * (0.3 + i * 0.12) + Math.cos(time * 0.7 + i * 2) * h() * 0.1
        const rx = w() * (0.15 + i * 0.03)
        const ry = h() * (0.2 + i * 0.04)

        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(time * 0.15 + i * 0.8)

        // Elliptical blob
        ctx.beginPath()
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2)

        const colors = [
          'rgba(200, 149, 108, 0.06)',  // amber
          'rgba(180, 160, 140, 0.04)',  // warm gray
          'rgba(210, 170, 130, 0.05)',  // light amber
          'rgba(200, 149, 108, 0.04)',  // amber subtle
        ]
        ctx.fillStyle = colors[i]
        ctx.fill()
        ctx.restore()
      }

      // Subtle grid lines — architectural feel
      ctx.strokeStyle = 'rgba(26, 24, 21, 0.025)'
      ctx.lineWidth = 0.5
      const gridSpacing = 80

      // Vertical lines with subtle wave
      for (let x = 0; x < w(); x += gridSpacing) {
        ctx.beginPath()
        for (let y = 0; y < h(); y += 4) {
          const offset = Math.sin(y * 0.005 + time + x * 0.002) * 3
          if (y === 0) ctx.moveTo(x + offset, y)
          else ctx.lineTo(x + offset, y)
        }
        ctx.stroke()
      }

      // Floating particles — small amber dots
      for (let i = 0; i < 30; i++) {
        const px = (Math.sin(time * 0.3 + i * 4.1) * 0.5 + 0.5) * w()
        const py = (Math.cos(time * 0.2 + i * 3.7) * 0.5 + 0.5) * h()
        const size = 1.5 + Math.sin(time + i) * 0.8
        const alpha = 0.08 + Math.sin(time * 0.5 + i * 2) * 0.04

        ctx.beginPath()
        ctx.arc(px, py, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 149, 108, ${alpha})`
        ctx.fill()
      }

      // Accent line — a flowing curve from bottom-left toward center
      ctx.beginPath()
      ctx.moveTo(0, h() * 0.85)
      for (let t = 0; t <= 1; t += 0.01) {
        const x = t * w() * 0.7
        const y = h() * 0.85 - t * h() * 0.4 + Math.sin(t * 4 + time) * 30
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(200, 149, 108, 0.12)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Second accent line
      ctx.beginPath()
      ctx.moveTo(w(), h() * 0.3)
      for (let t = 0; t <= 1; t += 0.01) {
        const x = w() - t * w() * 0.5
        const y = h() * 0.3 + t * h() * 0.5 + Math.cos(t * 3 + time * 0.8) * 25
        ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(26, 24, 21, 0.04)'
      ctx.lineWidth = 1
      ctx.stroke()

      animationId = requestAnimationFrame(draw)
    }

    // Respect reduced motion
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mq.matches) {
      draw() // Single frame
    } else {
      draw()
    }

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}

export default function HeroContent() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Animated abstract background */}
      <AbstractCanvas />

      {/* Content — bottom-left aligned */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 min-h-screen flex items-end pb-16 md:pb-24 px-6 sm:px-10 lg:px-16"
      >
        <div className="max-w-4xl">
          {/* Label */}
          <motion.p
            variants={fadeUpVariant}
            className="text-sm md:text-base text-text-secondary/60 uppercase tracking-[0.25em] mb-6 md:mb-8"
          >
            Web Design Studio · Switzerland
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariant}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-semibold text-text-primary tracking-[-0.03em] leading-[1.05] mb-6 md:mb-8"
          >
            We build websites
            <br />
            that{' '}
            <span className="text-shimmer">win clients.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUpVariant}
            className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-2xl mb-10 md:mb-14 leading-relaxed"
          >
            Premium websites for Swiss businesses. Fixed price. Ready in days, not months.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-[#C8956C] text-white hover:bg-[#b8855c] font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300 glow-pulse"
              >
                Start Your Project
              </Button>
            </Link>
            <Link href="/work">
              <Button
                size="lg"
                variant="outline"
                className="border border-text-primary/15 text-text-primary hover:bg-text-primary/5 hover:border-text-primary/30 font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300"
              >
                View Our Work
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator — bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-text-secondary/40">Scroll</span>
        <motion.div
          animate={{ height: ['12px', '24px', '12px'] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-px bg-gradient-to-b from-text-secondary/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
