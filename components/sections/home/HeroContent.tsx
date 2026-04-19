'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import HeroFeature from '@/components/ui/HeroFeature'

// Editorial cinematic hero — Ravi × Lolo × Tom Carder.
// Signature moves:
//   · Word-by-word stagger reveal on the display headline
//   · Hand-drawn burgundy SVG underline on the italic phrase
//   · Scroll-linked parallax (headline, supporting, grid-noise all at different speeds)
//   · Italic phrase subtly scales as it moves through the viewport
//   · Right-column rotating client feature (Tom Carder signature)
//   · Ambient floating burgundy/honey shapes drifting slowly in the background
//   · Auto-looping client strip at the bottom

const clients = [
  { name: 'Core Medical', img: '/work/core-medical.jpg' },
  { name: 'LucasVision',  img: '/work/lucasvision.jpg' },
  { name: 'Ääriviiva',    img: '/work/aariviiva.jpg' },
  { name: 'Veloscout',    img: '/work/core-medical.jpg' },
]

type Token =
  | { kind: 'word';   text: string }
  | { kind: 'italic'; text: string; color?: 'soft' | 'accent' }
  | { kind: 'underline'; text: string }
  | { kind: 'br' }

const tokens: Token[] = [
  { kind: 'word',      text: 'We' },
  { kind: 'word',      text: 'build' },
  { kind: 'word',      text: 'small,' },
  { kind: 'italic',    text: 'slow,', color: 'soft' },
  { kind: 'br' },
  { kind: 'word',      text: 'deliberate' },
  { kind: 'word',      text: 'websites' },
  { kind: 'br' },
  { kind: 'underline', text: 'built to last.' },
]

// Ambient floating shape — large blurred radial, drifts slowly, restrained opacity
function AmbientShape({
  className,
  width,
  height,
  color,
  delay = 0,
  driftY = 20,
  rotate = 0,
}: {
  className: string
  width: number
  height: number
  color: string
  delay?: number
  driftY?: number
  rotate?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width,
        height,
        background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
        filter: 'blur(46px)',
      }}
      initial={{ opacity: 0, y: 0, rotate }}
      animate={
        reduce
          ? { opacity: 0.8, y: 0, rotate }
          : {
              opacity: [0.55, 0.85, 0.55],
              y: [0, driftY, 0],
              rotate: [rotate, rotate + 6, rotate],
            }
      }
      transition={{
        duration: 18,
        repeat: reduce ? 0 : Infinity,
        ease: 'easeInOut',
        delay,
      }}
    />
  )
}

export default function HeroContent() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  const headlineY   = useTransform(progress, [0, 1], [0, -80])
  const supportY    = useTransform(progress, [0, 1], [0, -40])
  const gridY       = useTransform(progress, [0, 1], [0, 70])
  const italicScale = useTransform(progress, [0, 0.6], [1, 1.04])
  const stripX      = useTransform(progress, [0, 1], [0, -60])
  const featureY    = useTransform(progress, [0, 1], [0, -30])

  const wordStride = 0.075

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden">
      {/* Grid-noise backdrop (parallax) */}
      <motion.div
        aria-hidden
        className="grid-noise"
        style={reduce ? undefined : { y: gridY }}
      />

      {/* Ambient floating shapes — burgundy + honey, very subtle */}
      <AmbientShape
        className="-left-[10%] top-[18%]"
        width={640}
        height={200}
        color="oklch(0.48 0.16 25 / 0.14)"
        rotate={-8}
        driftY={16}
        delay={0}
      />
      <AmbientShape
        className="right-[-8%] top-[10%]"
        width={520}
        height={160}
        color="oklch(0.65 0.10 75 / 0.18)"
        rotate={10}
        driftY={-14}
        delay={1.2}
      />
      <AmbientShape
        className="left-[30%] bottom-[8%]"
        width={420}
        height={140}
        color="oklch(0.50 0.12 25 / 0.10)"
        rotate={-4}
        driftY={12}
        delay={2.4}
      />

      <div className="relative mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-16 pt-36 md:pt-44 pb-14 md:pb-20">
        <div
          className="fade-up mb-10 md:mb-14"
          style={{ ['--fade-delay' as string]: '0s' }}
        >
          <span className="eyebrow">Swiss studio · Est. 2024</span>
        </div>

        {/* Split grid: text left, rotating feature right */}
        <div className="grid grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* LEFT column — headline + philosophical + CTAs */}
          <div className="col-span-12 lg:col-span-7 xl:col-span-7">
            <motion.div style={reduce ? undefined : { y: headlineY }}>
              <h1 className="display text-[clamp(2.4rem,6vw,5.6rem)] leading-[0.98]">
                {tokens.map((tok, i) => {
                  const delay = `${0.25 + i * wordStride}s`
                  if (tok.kind === 'br') return <br key={i} />

                  if (tok.kind === 'italic') {
                    const color =
                      tok.color === 'accent'
                        ? 'text-[color:var(--accent)]'
                        : 'text-[color:var(--ink-soft)]'
                    return (
                      <React.Fragment key={i}>
                        <span
                          className={`word-reveal serif-italic ${color}`}
                          style={{ ['--word-delay' as string]: delay }}
                        >
                          {tok.text}
                        </span>{' '}
                      </React.Fragment>
                    )
                  }

                  if (tok.kind === 'underline') {
                    return (
                      <motion.span
                        key={i}
                        className="word-reveal serif-italic text-[color:var(--accent)] relative inline-block origin-left"
                        style={{
                          ['--word-delay' as string]: delay,
                          ...(reduce ? {} : { scale: italicScale }),
                        } as React.CSSProperties}
                      >
                        {tok.text}
                        <svg
                          className="draw-underline"
                          viewBox="0 0 600 14"
                          preserveAspectRatio="none"
                          aria-hidden
                        >
                          <path d="M 6 9 C 90 3, 180 13, 280 7 S 480 3, 594 8" />
                        </svg>
                      </motion.span>
                    )
                  }

                  return (
                    <React.Fragment key={i}>
                      <span
                        className="word-reveal"
                        style={{ ['--word-delay' as string]: delay }}
                      >
                        {tok.text}
                      </span>{' '}
                    </React.Fragment>
                  )
                })}
              </h1>
            </motion.div>

            <motion.div style={reduce ? undefined : { y: supportY }}>
              <p
                className="fade-up mt-10 md:mt-14 measure text-lg md:text-xl leading-[1.55] text-[color:var(--ink-muted)]"
                style={{ ['--fade-delay' as string]: '1.4s' }}
              >
                For teams who would rather be{' '}
                <span className="serif-italic text-[color:var(--ink)]">understood</span>{' '}
                than loud.
              </p>

              <div
                className="fade-up mt-10 md:mt-12 flex flex-wrap items-center gap-3"
                style={{ ['--fade-delay' as string]: '1.7s' }}
              >
                <Link href="/contact/start" className="btn btn-primary">
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/work" className="btn btn-ghost">
                  See the work
                </Link>
              </div>
            </motion.div>
          </div>

          {/* RIGHT column — rotating cinematic feature */}
          <motion.div
            className="col-span-12 lg:col-span-5 xl:col-span-5 fade-up"
            style={{
              ['--fade-delay' as string]: '0.9s',
              ...(reduce ? {} : { y: featureY }),
            } as React.CSSProperties}
          >
            <HeroFeature />
          </motion.div>
        </div>
      </div>

      {/* Auto-looping client strip with scroll-linked push */}
      <motion.div
        className="fade-up relative mt-8 md:mt-12 border-y border-[color:var(--border-subtle)] overflow-hidden"
        style={{
          ['--fade-delay' as string]: '1.9s',
          ...(reduce ? {} : { x: stripX }),
        } as React.CSSProperties}
      >
        <div
          className="flex w-max items-center gap-6 md:gap-7 py-4 md:py-5 whitespace-nowrap will-change-transform animate-ticker"
          style={
            {
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
              maskImage:
                'linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)',
            } as React.CSSProperties
          }
        >
          {[...clients, ...clients].map((c, i) => (
            <div key={`${c.name}-${i}`} className="flex items-center gap-3 md:gap-4 shrink-0">
              <div className="relative h-9 w-14 md:h-10 md:w-16 overflow-hidden rounded-[4px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)]">
                <Image
                  src={c.img}
                  alt={c.name}
                  fill
                  sizes="(max-width: 768px) 56px, 64px"
                  className="object-cover"
                />
              </div>
              <span className="display text-lg md:text-xl text-[color:var(--ink-muted)]">
                {c.name}
              </span>
              <span className="text-[color:var(--accent-muted)]/60 text-lg md:text-xl">·</span>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
