'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion'

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

interface Step {
  n: string
  title: string
  text: string
  marker: string
}

// Each step occupies a ~20% slice of section scroll progress with a small
// overlap so adjacent reveals feel braided rather than stuttery.
const RANGES: [number, number][] = [
  [0.00, 0.20],
  [0.18, 0.38],
  [0.36, 0.56],
  [0.54, 0.74],
]

function useStepReveal(progress: MotionValue<number>, range: [number, number]) {
  const opacity = useTransform(progress, range, [0, 1])
  const x = useTransform(progress, range, [-32, 0])
  return { opacity, x }
}

export default function Process() {
  const t = useTranslations('Process')
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduce = useReducedMotion()
  const [headerRef, headerIn] = useInView<HTMLDivElement>(0.25)

  const steps: Step[] = [
    { n: '01', title: t('step1Title'), text: t('step1Text'), marker: t('step1Marker') },
    { n: '02', title: t('step2Title'), text: t('step2Text'), marker: t('step2Marker') },
    { n: '03', title: t('step3Title'), text: t('step3Text'), marker: t('step3Marker') },
    { n: '04', title: t('step4Title'), text: t('step4Text'), marker: t('step4Marker') },
  ]

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 50%'],
  })

  const r0 = useStepReveal(scrollYProgress, RANGES[0])
  const r1 = useStepReveal(scrollYProgress, RANGES[1])
  const r2 = useStepReveal(scrollYProgress, RANGES[2])
  const r3 = useStepReveal(scrollYProgress, RANGES[3])
  const reveals = [r0, r1, r2, r3]

  return (
    <section
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 border-t border-[color:var(--border-subtle)]"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div
          ref={headerRef}
          data-in={headerIn ? 'true' : 'false'}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20"
        >
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6 section-arrive" style={{ ['--arrive-delay' as string]: '0ms' } as CSSProperties}>
              {t('eyebrow')}
            </p>
            <h2
              className="display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02] section-arrive"
              style={{ ['--arrive-delay' as string]: '160ms' } as CSSProperties}
            >
              {t('headlineLead')}{' '}
              <span className="serif-italic text-[color:var(--ink-soft)]">{t('headlineEmphasis')}</span>
            </h2>
          </div>
        </div>

        {/* Ledger timeline — each row reveals one-by-one as the user scrolls
            through the section, tied to scrollYProgress. */}
        <ol className="border-t border-[color:var(--border-default)]">
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              style={reduce ? undefined : { opacity: reveals[i].opacity, x: reveals[i].x }}
              className={`group grid grid-cols-[auto_1fr_auto] gap-6 md:gap-12 items-baseline py-10 md:py-12 ${
                i < steps.length - 1 ? 'border-b border-[color:var(--border-subtle)]' : ''
              } transition-colors hover:bg-[oklch(1_0_0/0.015)]`}
            >
              <span
                className="display-sans tabular text-[clamp(2rem,4vw,3.2rem)] leading-none text-[color:var(--ink-faint)] w-[2ch]"
              >
                {step.n}
              </span>
              <div>
                <h3 className="display text-2xl md:text-[2.1rem] leading-tight text-[color:var(--ink)] mb-3">
                  {step.title}
                </h3>
                <p className="measure text-[15px] md:text-base text-[color:var(--ink-muted)] leading-relaxed">
                  {step.text}
                </p>
              </div>
              <span className="eyebrow shrink-0">{step.marker}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
