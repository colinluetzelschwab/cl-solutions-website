'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from 'framer-motion'

// Hero composition — galdu.fi register: dark macro lake-water surface as a
// 5.4s seamless loop video. Layered under the Ravi-style editorial overlay.
//
// SCROLL CHOREOGRAPHY ("The Curtain Close") — sticky-pin + horizontal reveal:
//   The section is 200svh tall (170svh on mobile) with a sticky inner that
//   pins the hero for 100svh of scroll. As scrollYProgress goes 0 → 1:
//     · The water card stays FULL-BLEED — it does not shrink and does not
//       move. Paper-coloured curtains close in from the LEFT and RIGHT
//       (`clip-path: inset(0 X% 0 X%)`, X going 0 → 50). By the end of the
//       pin the video is fully covered by the page paper.
//     · The "Built with intent." headline + CTA fade out within the first
//       ~20% of scroll so the close reads as a clean reveal, not a fight.
//   When the pin releases, the next section is already at the top of the
//   viewport — services "appears" rather than scrolling up from below.
//   `prefers-reduced-motion` disables all scroll-driven motion entirely.


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
  const t = useTranslations('Hero')
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduce = useReducedMotion()
  const [videoFailed, setVideoFailed] = useState(false)
  const rotatingWords = [
    t('wordIntent'),
    t('wordCare'),
    t('wordCraft'),
    t('wordPrecision'),
  ] as const

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

  // CURTAIN CLOSE — paper closes in from all four sides at the same rate
  // (uniform iris) via clip-path inset. The visible window keeps the
  // viewport's aspect ratio as it shrinks toward the centre. Card never
  // moves and never scales. Inset reaches 50% (fully closed) by progress
  // 0.95, leaving a touch of settled stillness before the pin releases.
  const inset = useTransform(progress, [0, 0.95], [0, 50])
  const cardRadius = useTransform(progress, [0, 0.55], [0, 20])
  const clipPath = useMotionTemplate`inset(${inset}% ${inset}% ${inset}% ${inset}% round ${cardRadius}px)`

  // Hero content (headline + CTA) — fades out early so the curtain reads clean.
  const contentOpacity = useTransform(progress, [0, 0.2], [1, 0])
  const contentY = useTransform(progress, [0, 1], [0, -60])

  return (
    <section
      ref={sectionRef}
      // Outer wrapper: tall enough that the sticky inner pins as the user
      // scrolls. Mobile gets ~70svh of pin runway (160svh outer − 100svh
      // sticky = 60svh of scroll-driven zoom-out, plus 10svh easing room).
      // Desktop keeps the original 100svh runway (200svh − 100svh).
      className="relative w-full h-[170svh] md:h-[200svh]"
    >
      <div className="sticky top-0 isolate w-full h-[100svh] min-h-[640px] overflow-hidden bg-[color:var(--paper-dark)] flex items-center justify-center">

        {/* Water card — full-bleed at scroll 0. As scroll progresses, the
            paper "closes in" from both sides via clip-path inset; the card
            itself never moves or scales.
            data-theme="dark" forces dark tokens INSIDE the card so the
            headline + CTA stay readable over the water; surrounding sticky
            uses page-mode tokens (cream on light, charcoal on dark). */}
        <motion.div
          data-theme="dark"
          className="relative isolate w-full h-full overflow-hidden bg-black z-10 will-change-[clip-path]"
          style={reduce ? undefined : { clipPath }}
        >
          {/* Galdu-water backdrop — dark macro lake surface, 5.4s seamless
              loop. Reduced-motion users (and any video failure) see the
              still poster. */}
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
            {/* Top vignette — protects nav-pill legibility at scroll 0 */}
            <div
              className="absolute inset-x-0 top-0 h-40 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, rgb(0 0 0 / 0.55) 0%, transparent 100%)',
              }}
            />
          </div>

          {/* Headline + CTA — fades out during the zoom-out so the card
              reads as a quiet image card by mid-pin. */}
          <motion.div
            className="relative h-full mx-auto w-full max-w-[1400px] px-6 sm:px-10 lg:px-16 flex flex-col justify-center"
            style={
              reduce
                ? undefined
                : { opacity: contentOpacity, y: contentY }
            }
          >
            <h1 className="display text-[clamp(2.6rem,7.6vw,7rem)] leading-[1.02] text-[color:var(--ink)] whitespace-nowrap">
              <span
                className="word-reveal"
                style={{ ['--word-delay' as string]: '0.15s' }}
              >
                {t('builtWith')}
              </span>
              <span aria-hidden>&nbsp;</span>
              <span
                className="word-reveal"
                style={{ ['--word-delay' as string]: '0.40s' }}
              >
                <RotatingWord words={rotatingWords} />
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
                  {t('startProject')}
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
        </motion.div>
      </div>
    </section>
  )
}
