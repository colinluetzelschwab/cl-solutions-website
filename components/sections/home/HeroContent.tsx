'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  animate,
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'
import { Warp } from '@paper-design/shaders-react'

const HERO_SPEED_SETTLED = 0.35
const HERO_SPEED_PEAK = 2.0

// Hero composition — 21st.dev shadway/wrap-shader (Warp) repainted in our
// warm editorial palette, layered under the existing Ravi-style editorial
// overlay: Instrument Serif display, rotating italic moment on line 2,
// corner live-clock, Ch. I marker. The hero is always visually dark
// (the shader is its own cinematic room) — the rest of the page still
// adapts to system light/dark via prefers-color-scheme.

const ROTATING_WORDS = ['intent', 'care', 'craft', 'precision'] as const

function RotatingWord({
  words,
  suffix = '.',
}: {
  words: readonly string[]
  suffix?: string
}) {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = setTimeout(() => {
      setActive((i) => (i + 1) % words.length)
    }, 2400)
    return () => clearTimeout(id)
  }, [active, reduce, words.length])

  if (reduce) {
    return (
      <span className="serif-italic text-[color:var(--ink-soft)]">
        {words[0]}
        {suffix}
      </span>
    )
  }

  const longest = words.reduce(
    (a, b) => (b.length > a.length ? b : a),
    words[0] ?? '',
  )

  return (
    <span
      className="relative inline-grid overflow-hidden align-baseline leading-[inherit]"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Invisible spacer — reserves width/height + sets the baseline */}
      <span
        className="col-start-1 row-start-1 invisible serif-italic whitespace-nowrap leading-[inherit]"
        aria-hidden
      >
        {longest}
        {suffix}
      </span>
      {words.map((w, i) => (
        <motion.span
          key={w}
          className="col-start-1 row-start-1 serif-italic text-[color:var(--ink-soft)] whitespace-nowrap leading-[inherit]"
          initial={{ y: '100%', opacity: 0 }}
          animate={
            active === i
              ? { y: '0%', opacity: 1 }
              : { y: active > i ? '-100%' : '100%', opacity: 0 }
          }
          transition={{ type: 'spring', stiffness: 55, damping: 14 }}
          aria-hidden={active !== i}
        >
          {w}
          <span className="not-italic" aria-hidden>
            {suffix}
          </span>
        </motion.span>
      ))}
    </span>
  )
}

export default function HeroContent() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const [heroSpeed, setHeroSpeed] = useState(HERO_SPEED_SETTLED)

  useEffect(() => {
    if (reduce) return
    const controls = animate(
      HERO_SPEED_SETTLED,
      [HERO_SPEED_SETTLED, HERO_SPEED_PEAK, HERO_SPEED_SETTLED],
      {
        duration: 5,
        times: [0, 0.2, 1],
        ease: ['easeOut', 'easeInOut'],
        onUpdate: (v) => setHeroSpeed(v),
      },
    )
    return () => controls.stop()
  }, [reduce])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  })
  const headlineY = useTransform(progress, [0, 1], [0, -60])

  return (
    <section
      ref={sectionRef}
      data-theme="dark"
      className="relative isolate w-full overflow-hidden h-[100svh] min-h-[640px] flex flex-col"
    >
      {/* Warp shader backdrop — warm rust/ember palette, slow cinematic swirl */}
      <div aria-hidden className="absolute inset-0 -z-10">
        {!reduce && (
          <Warp
            style={{ height: '100%', width: '100%' }}
            proportion={0.45}
            softness={1}
            distortion={0.28}
            swirl={0.6}
            swirlIterations={10}
            shape="checks"
            shapeScale={0.08}
            scale={1.1}
            rotation={0}
            speed={heroSpeed}
            colors={[
              'hsl(22, 45%, 5%)',   // near-black warm undertone
              'hsl(18, 55%, 16%)',  // deep espresso
              'hsl(14, 65%, 32%)',  // rich rust
              'hsl(10, 80%, 52%)',  // ember highlight
            ]}
          />
        )}
        {/* Reduced-motion fallback — static gradient, same palette */}
        {reduce && (
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 50% at 30% 20%, hsl(14 65% 32% / 0.5), transparent 60%),\
                 radial-gradient(ellipse 60% 50% at 80% 70%, hsl(10 80% 52% / 0.35), transparent 65%),\
                 hsl(22 45% 5%)',
            }}
          />
        )}
        {/* Top vignette — protects nav-pill legibility */}
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, hsl(22 45% 3% / 0.55) 0%, transparent 100%)',
          }}
        />
        {/* Bottom fade — merges into paper below */}
        <div
          className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, var(--paper-dark) 100%)',
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16 flex-1 flex flex-col justify-center">
        <motion.div
          style={reduce ? undefined : { y: headlineY }}
        >
          <h1 className="display text-[clamp(2.6rem,7.6vw,7rem)] leading-[1.02] text-[color:var(--ink)] whitespace-nowrap">
            <span
              className="word-reveal"
              style={{ ['--word-delay' as string]: '0.15s' }}
            >
              Built with
            </span>
            <span aria-hidden>&nbsp;</span>
            <span
              className="word-reveal"
              style={{ ['--word-delay' as string]: '0.40s' }}
            >
              <RotatingWord words={ROTATING_WORDS} />
            </span>
          </h1>

          <div
            className="fade-up mt-12 md:mt-16"
            style={{ ['--fade-delay' as string]: '1.1s' }}
          >
            <Link
              href="/contact/start"
              className="group inline-flex items-center gap-3 text-[color:var(--ink)] text-[15px] md:text-base font-medium"
            >
              <span className="relative">
                Start a project
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1 h-px bg-[color:var(--ink)] origin-left scale-x-100 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-0"
                />
                <span
                  aria-hidden
                  className="absolute left-0 right-0 -bottom-1 h-px bg-[color:var(--accent)] origin-right scale-x-0 transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 delay-[60ms]"
                />
              </span>
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--border-default)] text-[color:var(--ink)] transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:border-[color:var(--accent)]"
                aria-hidden
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  className="h-[9px] w-[9px] text-current"
                >
                  <path
                    d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
