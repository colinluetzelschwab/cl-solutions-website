'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

// Hero composition — galdu.fi register: dark macro lake-water surface as a
// 5.4s seamless loop video (DoP first-last-frame, same image both ends).
// Layered under the existing Ravi-style editorial overlay: Instrument Serif
// display, rotating italic moment on line 2, "Start a project" CTA. Hero
// stays dark-locked (data-theme="dark"); rest of page adapts to system
// light/dark via prefers-color-scheme.
//
// Assets (committed under public/):
//   - /videos/hero/water-loop.mp4   (H.264 1.3 Mbps, ~870 KB, 1280×720, 30fps)
//   - /videos/hero/water-loop.webm  (VP9, ~710 KB, fallback)
//   - /images/hero/water-hero.png   (still poster for instant first paint
//                                    + reduced-motion / video-fail fallback)

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
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduce = useReducedMotion()
  const [videoFailed, setVideoFailed] = useState(false)

  // Pause loop when tab/window is hidden — saves battery on mobile.
  useEffect(() => {
    if (reduce) return
    const v = videoRef.current
    if (!v) return
    const onVis = () => {
      if (document.hidden) v.pause()
      else v.play().catch(() => {})
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
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
      {/* Galdu-water backdrop — dark macro lake surface, 5.4s seamless loop.
          Reduced-motion users (and any video failure) see the still poster. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black">
        {!reduce && !videoFailed && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/hero/water-hero.png"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/videos/hero/water-loop.webm" type="video/webm" />
            <source src="/videos/hero/water-loop.mp4" type="video/mp4" />
          </video>
        )}
        {(reduce || videoFailed) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/hero/water-hero.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* Top vignette — protects nav-pill legibility */}
        <div
          className="absolute inset-x-0 top-0 h-40 pointer-events-none"
          style={{
            background:
              'linear-gradient(180deg, rgb(0 0 0 / 0.55) 0%, transparent 100%)',
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
