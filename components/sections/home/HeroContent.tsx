'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeOut' as const },
  },
}

const lineReveal = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 1.2, ease: 'easeOut' as const, delay: 0.6 },
  },
}

function useTime() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString('de-CH', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Zurich',
        })
      )
    }
    tick()
    const iv = setInterval(tick, 30000)
    return () => clearInterval(iv)
  }, [])
  return time
}

/**
 * Grain texture overlay for premium feel.
 * Renders a static noise pattern via canvas.
 */
function GrainOverlay() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 256
    canvas.height = 256

    const imageData = ctx.createImageData(256, 256)
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255
      imageData.data[i] = v
      imageData.data[i + 1] = v
      imageData.data[i + 2] = v
      imageData.data[i + 3] = 12 // very subtle
    }
    ctx.putImageData(imageData, 0, 0)
  }, [])

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      style={{ mixBlendMode: 'overlay' }}
      aria-hidden="true"
    />
  )
}

export default function HeroContent() {
  const zurichTime = useTime()

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-background-primary">
      {/* Grain texture */}
      <GrainOverlay />

      {/* Subtle accent gradient — top right */}
      <div
        className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,149,108,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 min-h-screen flex flex-col justify-end px-6 sm:px-10 lg:px-16 pb-12 md:pb-16"
      >
        {/* Top bar — location + time */}
        <motion.div
          variants={fadeUp}
          className="absolute top-24 md:top-28 left-6 sm:left-10 lg:left-16 right-6 sm:right-10 lg:right-16 flex items-center justify-between"
        >
          <span className="text-[10px] md:text-xs text-text-muted tracking-[0.2em] uppercase">
            Zurich, Switzerland
          </span>
          <span className="text-[10px] md:text-xs text-text-muted tracking-[0.2em] tabular-nums font-mono">
            {zurichTime} CET
          </span>
        </motion.div>

        {/* Main content — large type, editorial */}
        <div className="max-w-6xl">
          {/* Overline */}
          <motion.div variants={fadeUp} className="mb-6 md:mb-8">
            <span className="text-[10px] md:text-xs text-accent-blue tracking-[0.3em] uppercase font-medium">
              Web Design Studio
            </span>
          </motion.div>

          {/* Headline — the big statement */}
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.5rem,8vw,7rem)] font-light text-text-primary leading-[0.95] tracking-[-0.03em] mb-8 md:mb-10"
          >
            We design websites
            <br />
            that make businesses{' '}
            <span className="font-semibold italic text-shimmer">grow.</span>
          </motion.h1>

          {/* Accent line */}
          <motion.div
            variants={lineReveal}
            className="h-px w-32 md:w-48 mb-8 md:mb-10 origin-left"
            style={{ background: 'linear-gradient(90deg, #C8956C, transparent)' }}
          />

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-base md:text-lg lg:text-xl text-text-secondary max-w-lg leading-relaxed mb-10 md:mb-14"
          >
            Premium websites for Swiss businesses.
            <br className="hidden md:block" />
            Fixed price. Ready in days.
          </motion.p>

          {/* CTA row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-text-primary text-background-primary hover:bg-text-primary/90 font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300 group"
              >
                Start a project
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/work">
              <Button
                size="lg"
                variant="outline"
                className="border-text-primary/15 text-text-primary hover:bg-text-primary/5 hover:border-text-primary/30 font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300"
              >
                See our work
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Bottom stats bar */}
        <motion.div
          variants={fadeUp}
          className="mt-16 md:mt-20 pt-6 border-t border-border-subtle flex flex-wrap gap-8 md:gap-16"
        >
          {[
            { label: 'Delivery', value: '3–5 days' },
            { label: 'Packages', value: 'From CHF 1,500' },
            { label: 'Based in', value: 'Switzerland' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-[10px] md:text-xs text-text-muted tracking-[0.15em] uppercase mb-1">
                {stat.label}
              </p>
              <p className="text-sm md:text-base text-text-primary font-medium">
                {stat.value}
              </p>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.4 }}
        className="absolute bottom-6 right-6 sm:right-10 lg:right-16 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ height: ['16px', '32px', '16px'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px bg-gradient-to-b from-text-muted/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
