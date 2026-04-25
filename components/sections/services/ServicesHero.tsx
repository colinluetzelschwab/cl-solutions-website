import React from 'react'
import { Link } from '@/i18n/navigation'

interface TierSummary {
  id: 'starter' | 'business' | 'pro'
  name: string
  price: string
  delivery: string
  oneLiner: string
  highlight?: boolean
}

const tiers: TierSummary[] = [
  { id: 'starter',  name: 'Starter',  price: 'CHF 1,500',      delivery: '3–5 days', oneLiner: 'One focused funnel.' },
  { id: 'business', name: 'Business', price: 'CHF 3,500',      delivery: '5–7 days', oneLiner: 'The full brand system.', highlight: true },
  { id: 'pro',      name: 'Pro',      price: 'from CHF 7,500', delivery: 'Scoped',  oneLiner: 'When off-the-shelf stops scaling.' },
]

const headlineWords = ['Three', 'options.', 'One', 'standard.']

export default function ServicesHero() {
  const wordStride = 0.085

  return (
    <section className="relative w-full overflow-hidden">
      <div aria-hidden className="grid-noise" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pt-36 md:pt-44 pb-20 md:pb-28">
        <h1 className="display text-[clamp(2.6rem,7.4vw,6.4rem)] leading-[0.98] max-w-[16ch]">
          {headlineWords.map((word, i) => (
            <React.Fragment key={i}>
              <span
                className="word-reveal"
                style={{ ['--word-delay' as string]: `${0.2 + i * wordStride}s` }}
              >
                {word}
              </span>{' '}
            </React.Fragment>
          ))}
        </h1>

        <p
          className="fade-up mt-10 md:mt-14 measure-wide text-lg md:text-xl leading-[1.55] text-[color:var(--ink-muted)]"
          style={{ ['--fade-delay' as string]: '0.9s' }}
        >
          Every site is hand-built and custom-designed. The tiers differ in scope and depth,
          not quality.
        </p>
      </div>

      {/* Tier ledger — flat editorial row, no chrome */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-20 md:pb-28">
        <div
          className="fade-up grid grid-cols-1 md:grid-cols-3 border-t border-[color:var(--border-subtle)]"
          style={{ ['--fade-delay' as string]: '1.1s' }}
        >
          {tiers.map((t, i) => (
            <Link
              key={t.id}
              href={`/contact/start?package=${t.id}`}
              className={`group block px-0 md:px-8 py-10 md:py-12 ${
                i < tiers.length - 1 ? 'md:border-r border-b md:border-b-0' : ''
              } border-[color:var(--border-subtle)] ${i === 0 ? 'md:pl-0' : ''} ${
                i === tiers.length - 1 ? 'md:pr-0' : ''
              }`}
            >
              <p className="display text-3xl md:text-[2.4rem] leading-none text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">
                {t.name}
              </p>
              {t.highlight && (
                <p className="mt-2 text-sm md:text-base text-[color:var(--ink-muted)]">
                  — most picked
                </p>
              )}
              <p className="mt-3 text-base md:text-lg text-[color:var(--ink-muted)]">
                {t.oneLiner}
              </p>

              <p
                className="mt-8 text-xl md:text-2xl text-[color:var(--ink)]"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {t.price}
              </p>
              <p className="mt-1 text-sm md:text-base text-[color:var(--ink-muted)]">
                {t.delivery}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
