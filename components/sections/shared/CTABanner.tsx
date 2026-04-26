'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'

interface CTABannerProps {
  headline?: React.ReactNode
  subtext?: string
  /**
   * Homepage-only flourish: the centre card scales in as it enters the
   * viewport. Other pages leave this off so the CTA stays calm.
   */
  cinematic?: boolean
}

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

export default function CTABanner({
  headline,
  subtext,
  cinematic = false,
}: CTABannerProps) {
  const t = useTranslations('CTA')
  const [cardRef, cardIn] = useInView<HTMLDivElement>(0.18)

  return (
    <section className="relative w-full py-28 md:py-40 border-t border-[color:var(--border-subtle)] overflow-hidden">
      <div aria-hidden className="absolute inset-0 gradient-mesh-subtle" />
      <div aria-hidden className="grid-noise" />

      <div
        ref={cardRef}
        data-in={cardIn ? 'true' : 'false'}
        className={`relative mx-auto max-w-4xl px-6 sm:px-10 lg:px-16 text-center ${
          cinematic ? 'cta-card-reveal' : ''
        }`}
      >
        <h2 className="display text-[clamp(2.2rem,5vw,4.2rem)] leading-[1.04]">
          {headline ? (
            headline
          ) : (
            <>
              {t('headlineLead')}{' '}
              <span className="serif-italic">{t('headlineEmphasis')}</span>
            </>
          )}
        </h2>
        <p className="mt-8 md:mt-10 measure mx-auto text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
          {subtext ?? t('subtext')}
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/contact/start" className="btn btn-primary">
            {t('primary')}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/services" className="btn btn-ghost">
            {t('secondary')}
          </Link>
        </div>
      </div>
    </section>
  )
}
