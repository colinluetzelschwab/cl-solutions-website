'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

// Amber accent cycling — premium synonym of "grow."
const CYCLE_WORDS = ['grow.', 'scale.', 'last.', 'ship.', 'shine.']

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.3 } },
}

const line = {
  hidden: { y: '110%' },
  visible: {
    y: '0%',
    transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] as const },
  },
}

function useZurichTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () =>
      setT(
        new Date().toLocaleTimeString('de-CH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'Europe/Zurich',
        }),
      )
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])
  return t
}

function useWordCycle(words: string[], intervalMs = 2800, startDelay = 1800) {
  const [i, setI] = useState(0)
  useEffect(() => {
    let startTimer: NodeJS.Timeout | null = null
    let tickTimer: NodeJS.Timeout | null = null
    startTimer = setTimeout(() => {
      tickTimer = setInterval(() => {
        setI((prev) => (prev + 1) % words.length)
      }, intervalMs)
    }, startDelay)
    return () => {
      if (startTimer) clearTimeout(startTimer)
      if (tickTimer) clearInterval(tickTimer)
    }
  }, [words.length, intervalMs, startDelay])
  return words[i]
}

function Grain() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    c.width = 200
    c.height = 200
    const d = ctx.createImageData(200, 200)
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255
      d.data[i] = v
      d.data[i + 1] = v
      d.data[i + 2] = v
      d.data[i + 3] = 12
    }
    ctx.putImageData(d, 0, 0)
  }, [])
  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60 z-20"
      style={{ mixBlendMode: 'overlay' }}
      aria-hidden="true"
    />
  )
}

/**
 * LineReveal — wraps children in a Y-axis clip and slides them up from
 * below on mount. overflow-y hidden, overflow-x visible so wide lines
 * are not clipped horizontally.
 */
function LineReveal({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <span
      className={`block pb-[0.08em] ${className}`}
      style={{ overflowY: 'hidden', overflowX: 'visible' }}
    >
      <motion.span variants={line} className="block will-change-transform">
        {children}
      </motion.span>
    </span>
  )
}

export default function HeroContent() {
  const time = useZurichTime()
  const accent = useWordCycle(CYCLE_WORDS, 2800, 2200)
  const prefersReduce = useReducedMotion()

  // Ken Burns — subtle 20s loop, only runs if the user allows motion
  const kenBurns = prefersReduce
    ? { scale: 1, x: 0, y: 0 }
    : { scale: 1.06, x: '-1.5%', y: '1%' }

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background-primary">
      <Grain />

      {/* Full-width image with Ken Burns */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute inset-0 will-change-transform"
          initial={{ scale: 1, x: '0%', y: '0%' }}
          animate={kenBurns}
          transition={{
            duration: 22,
            ease: 'easeOut',
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        >
          <Image
            src="/images/hero/swiss-mountains.jpeg"
            alt=""
            fill
            className="object-cover opacity-[0.72]"
            style={{ objectPosition: 'center 35%' }}
            priority
            sizes="100vw"
          />
        </motion.div>

        {/* Top: cream fades into sky */}
        <div className="absolute top-0 left-0 right-0 h-[35%] bg-gradient-to-b from-background-primary to-transparent" />
        {/* Bottom: cream covers rocks completely */}
        <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-gradient-to-t from-background-primary to-transparent" />
        {/* Left-wash — improves subtext contrast without darkening the whole photo */}
        <div className="absolute inset-y-0 left-0 w-full md:w-[62%] bg-gradient-to-r from-background-primary/60 via-background-primary/25 to-transparent" />
      </div>

      {/* Thin corner ticks — print-catalogue registration marks */}
      <div className="absolute top-20 md:top-24 left-6 sm:left-10 lg:left-16 z-20" aria-hidden>
        <div className="flex flex-col gap-[2px]">
          <span className="block w-5 h-[1px] bg-text-primary/40" />
          <span className="block w-[1px] h-5 bg-text-primary/40" />
        </div>
      </div>
      <div className="absolute top-20 md:top-24 right-6 sm:right-10 lg:right-16 z-20" aria-hidden>
        <div className="flex flex-col gap-[2px] items-end">
          <span className="block w-5 h-[1px] bg-text-primary/40" />
          <span className="block w-[1px] h-5 bg-text-primary/40 ml-auto" />
        </div>
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="relative z-10 min-h-[100svh] flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-28 md:pt-32 pb-10 md:pb-14"
      >
        {/* Top — location + time */}
        <motion.div
          variants={fadeIn}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="relative flex h-[6px] w-[6px] shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8956C] opacity-75" />
              <span className="relative inline-flex rounded-full h-[6px] w-[6px] bg-[#C8956C]" />
            </span>
            <span className="text-[10px] md:text-[11px] text-text-muted tracking-[0.22em] md:tracking-[0.25em] uppercase whitespace-nowrap truncate">
              <span className="md:hidden">Zurich · CH</span>
              <span className="hidden md:inline">Zurich · Switzerland · 47.37°N</span>
            </span>
          </div>
          <span
            className="shrink-0 text-[10px] md:text-[11px] text-text-muted tracking-[0.22em] md:tracking-[0.25em] tabular-nums font-mono whitespace-nowrap"
            suppressHydrationWarning
          >
            <span className="md:hidden">{time ? time.slice(0, 5) : '--:--'}</span>
            <span className="hidden md:inline">{time || '--:--:--'}</span>
            {' '}CET
          </span>
        </motion.div>

        {/* Center — big statement with kinetic reveal */}
        <div className="flex-1 flex items-center">
          <div className="max-w-5xl py-16 md:py-0">
            <h1
              aria-label="We design websites that make businesses grow."
              className="text-[clamp(2.8rem,8vw,6.8rem)] font-light text-text-primary leading-[0.95] tracking-[-0.035em]"
            >
              <LineReveal>We design websites</LineReveal>
              <LineReveal>that make businesses</LineReveal>
              <LineReveal className="min-h-[1em]">
                <span className="inline-flex items-baseline overflow-hidden pr-[0.3em] align-baseline">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={accent}
                      initial={{ y: '100%', opacity: 0 }}
                      animate={{ y: '0%', opacity: 1 }}
                      exit={{ y: '-110%', opacity: 0 }}
                      transition={{
                        duration: 0.65,
                        ease: [0.2, 0.8, 0.2, 1] as const,
                      }}
                      className="inline-block font-[family-name:var(--font-display)] italic font-normal text-[#C8956C] will-change-transform"
                    >
                      {accent}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </LineReveal>
            </h1>

            <motion.p
              variants={fadeIn}
              className="text-base md:text-xl text-text-primary/85 max-w-md leading-relaxed mt-8 md:mt-12"
            >
              Premium websites for Swiss businesses. Fixed price. Ready in days,
              not months.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="flex flex-col sm:flex-row items-start gap-3 mt-10 md:mt-14"
            >
              <Link
                href="/contact/start"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium bg-text-primary text-background-primary hover:bg-text-primary/90 transition-all duration-200 group"
              >
                Start a project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/work"
                className="group relative inline-flex items-center gap-2 px-8 py-4 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                <span>See our work</span>
                <span
                  className="absolute bottom-3 left-8 right-8 h-[1px] bg-text-primary origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                  aria-hidden
                />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom — minimal stats + scroll cue */}
        <motion.div
          variants={fadeIn}
          className="flex items-end justify-between gap-6 pt-8 border-t border-border-subtle"
        >
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:flex md:gap-16">
            {[
              ['Delivery', '3–5 days'],
              ['From', 'CHF 1,500'],
              ['Based in', 'Zurich, CH'],
              ['Booking', 'Q2 2026'],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0">
                <p className="text-[9px] md:text-[10px] text-text-muted tracking-[0.22em] uppercase mb-1.5 font-mono whitespace-nowrap">
                  {label}
                </p>
                <p className="text-xs md:text-sm text-text-primary whitespace-nowrap">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Scroll cue — line that pulses + label */}
          <div className="hidden md:flex flex-col items-center gap-3 shrink-0">
            <span className="text-[9px] md:text-[10px] text-text-muted tracking-[0.3em] uppercase font-mono rotate-0">
              Scroll
            </span>
            <span className="block w-[1px] h-8 bg-gradient-to-b from-text-muted to-transparent relative overflow-hidden">
              <motion.span
                initial={{ y: '-100%' }}
                animate={{ y: '100%' }}
                transition={{
                  duration: 2.2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatDelay: 0.25,
                }}
                className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-transparent via-[#C8956C] to-transparent"
              />
            </span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
