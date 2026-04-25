'use client'

import React, { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'

interface Pkg {
  key: 'starter' | 'business' | 'pro'
  popular?: boolean
}

const packages: Pkg[] = [
  { key: 'starter' },
  { key: 'business', popular: true },
  { key: 'pro' },
]

function useInView<T extends HTMLElement>(threshold = 0.15) {
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
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, inView] as const
}

export default function ServicesOverview() {
  const t = useTranslations('Services')
  const [gridRef, gridIn] = useInView<HTMLDivElement>(0.15)
  const [headerRef, headerIn] = useInView<HTMLDivElement>(0.25)

  return (
    <section id="packages" className="relative w-full py-24 md:py-32 border-t border-[color:var(--border-subtle)]">
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
          <div className="lg:col-span-4 lg:col-start-9 self-end">
            <p
              className="measure text-[color:var(--ink-muted)] text-base leading-relaxed section-arrive"
              style={{ ['--arrive-delay' as string]: '320ms' } as CSSProperties}
            >
              {t('lead')}
            </p>
          </div>
        </div>

        <div
          ref={gridRef}
          data-in={gridIn ? 'true' : 'false'}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7 cards-stagger"
        >
          {packages.map((pkg, i) => {
            const name = t(`${pkg.key}.name`)
            return (
              <article
                key={pkg.key}
                style={{ ['--card-delay' as string]: `${i * 140}ms` } as CSSProperties}
                className="card-reveal card-floating group relative flex flex-col px-7 md:px-9 py-11 md:py-13 overflow-hidden"
              >
                {pkg.popular && (
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, var(--ink), transparent)',
                    }}
                  />
                )}
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="eyebrow tabular">
                    {`0${i + 1}`}
                  </span>
                  <span className="eyebrow">{name}</span>
                  {pkg.popular && (
                    <span className="ml-auto chip chip-accent !px-2 !py-0.5 !text-[9px]">
                      <span className="dot-live" aria-hidden /> {t('mostPicked')}
                    </span>
                  )}
                </div>

                <p className="display text-[clamp(2.2rem,4vw,3rem)] leading-none text-[color:var(--ink)] tabular">
                  <span className="text-[color:var(--ink-faint)] text-base mr-2 align-top mt-2 inline-block font-[var(--font-inter)] tracking-wide">
                    {t('currency')}
                  </span>
                  {t(`${pkg.key}.price`)}
                </p>
                <p className="mt-2 text-[11px] font-[var(--font-plex-mono)] tracking-[0.16em] uppercase text-[color:var(--ink-faint)] tabular">
                  {t('eurApprox')} {t(`${pkg.key}.priceEur`)}
                </p>

                <p className="mt-6 measure text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
                  {t(`${pkg.key}.description`)}
                </p>

                <ul className="mt-8 flex flex-col gap-2.5 border-t border-[color:var(--border-subtle)] pt-6 flex-1">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-baseline gap-3 text-sm text-[color:var(--ink-muted)]">
                      <span className="inline-block w-3 h-[1px] bg-[color:var(--ink)] mt-[9px] shrink-0 opacity-40" aria-hidden />
                      <span>{t(`${pkg.key}.feature${n}`)}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact/start"
                  className="mt-10 inline-flex items-center gap-1.5 text-sm text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors group/link"
                >
                  {t('startCta', { name })}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                </Link>
              </article>
            )
          })}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <Link href="/services" className="link-ghost eyebrow">
            {t('compareAll')}
          </Link>
        </div>
      </div>
    </section>
  )
}
