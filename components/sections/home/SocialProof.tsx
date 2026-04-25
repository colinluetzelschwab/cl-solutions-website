'use client'

import React, { useEffect, useRef, useState, type CSSProperties } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

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

export default function SocialProof() {
  const t = useTranslations('Proof')
  const [quoteRef, quoteIn] = useInView<HTMLDivElement>(0.18)
  const [statsRef, statsIn] = useInView<HTMLUListElement>(0.18)

  const stats = [
    { value: t('stat1Value'), label: t('stat1Label'), sub: t('stat1Sub') },
    { value: t('stat2Value'), label: t('stat2Label'), sub: t('stat2Sub') },
    { value: t('stat3Value'), label: t('stat3Label'), sub: t('stat3Sub') },
  ]

  return (
    <section className="relative w-full py-28 md:py-40 border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-24 items-start">
          {/* Testimonial — slides in from the left */}
          <div
            ref={quoteRef}
            data-in={quoteIn ? 'true' : 'false'}
            className="proof-quote relative"
          >
            <blockquote className="display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.22] text-[color:var(--ink)] max-w-[32ch] pl-0">
              {t('quoteLead')}{' '}
              <span className="serif-italic text-[color:var(--ink-soft)]">
                {t('quoteEmphasis')}
              </span>
            </blockquote>

            <figure className="mt-12 flex items-center gap-5">
              <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border border-[color:var(--border-default)] bg-[color:var(--surface-2)]">
                <Image
                  src="/work/core-medical.jpg"
                  alt={t('authorName')}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <figcaption>
                <p className="text-[15px] text-[color:var(--ink)] font-medium">
                  {t('authorName')}
                </p>
                <p className="eyebrow mt-1">{t('authorRole')}</p>
              </figcaption>
            </figure>

            <Link
              href="/work"
              className="mt-10 inline-flex items-center gap-1.5 text-sm text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors group link-ghost"
            >
              {t('caseStudy')}
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Stats ledger — each row slides in from the right with stagger */}
          <div className="lg:pt-3">
            <ul
              ref={statsRef}
              data-in={statsIn ? 'true' : 'false'}
              className="proof-stats flex flex-col"
            >
              {stats.map((s, i) => (
                <li
                  key={s.label}
                  style={{ ['--stat-delay' as string]: `${i * 110}ms` } as CSSProperties}
                  className={`stat-row group grid grid-cols-[auto_1fr] items-baseline gap-6 py-7 ${
                    i < stats.length - 1
                      ? 'border-b border-[color:var(--border-subtle)]'
                      : ''
                  } transition-colors`}
                >
                  <div>
                    <p className="display text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none text-[color:var(--ink)] tabular">
                      {s.value}
                    </p>
                    <p className="eyebrow mt-3">{s.sub}</p>
                  </div>
                  <p className="text-right text-[11px] font-[var(--font-plex-mono)] uppercase tracking-[0.22em] text-[color:var(--ink-muted)] self-end pb-1">
                    {s.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
