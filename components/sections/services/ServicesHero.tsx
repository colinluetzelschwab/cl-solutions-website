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

// Editorial services hero — matches homepage word-reveal DNA.
type Token =
  | { kind: 'word'; text: string }
  | { kind: 'italic'; text: string }
  | { kind: 'underline'; text: string }

const headlineTokens: Token[] = [
  { kind: 'word',      text: 'Three' },
  { kind: 'word',      text: 'options.' },
  { kind: 'underline', text: 'One standard.' },
]

export default function ServicesHero() {
  const wordStride = 0.085

  return (
    <section className="relative w-full overflow-hidden">
      <div aria-hidden className="grid-noise" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pt-36 md:pt-44 pb-14 md:pb-20">
        <div className="fade-up flex items-center gap-4 mb-10 md:mb-14">
          <span className="eyebrow">Chapter · Pricing</span>
          <span className="flex-1 divider-gradient" aria-hidden />
          <span className="hidden sm:inline eyebrow">Updated · Q2 2026</span>
        </div>

        <h1 className="display text-[clamp(2.6rem,7.4vw,6.4rem)] leading-[0.98] max-w-[16ch]">
          {headlineTokens.map((tok, i) => {
            const delay = `${0.2 + i * wordStride}s`
            if (tok.kind === 'italic') {
              return (
                <React.Fragment key={i}>
                  <span
                    className="word-reveal serif-italic text-[color:var(--ink-soft)]"
                    style={{ ['--word-delay' as string]: delay }}
                  >
                    {tok.text}
                  </span>{' '}
                </React.Fragment>
              )
            }
            if (tok.kind === 'underline') {
              return (
                <span
                  key={i}
                  className="word-reveal serif-italic text-[color:var(--accent)] relative inline-block"
                  style={{ ['--word-delay' as string]: delay }}
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
                </span>
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

        <p
          className="fade-up mt-10 md:mt-14 measure-wide text-lg md:text-xl leading-[1.55] text-[color:var(--ink-muted)]"
          style={{ ['--fade-delay' as string]: '0.9s' }}
        >
          Every site is hand-built and{' '}
          <span className="serif-italic text-[color:var(--ink)]">custom-designed</span>.
          The tiers differ in scope and depth, not quality.
        </p>
      </div>

      {/* Tier ledger — flat editorial row, no cards */}
      <div className="divider-gradient" />
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 py-10 md:py-14">
        <div
          className="fade-up grid grid-cols-1 md:grid-cols-3"
          style={{ ['--fade-delay' as string]: '1.1s' }}
        >
          {tiers.map((t, i) => (
            <Link
              key={t.id}
              href={`#package-${t.id}`}
              className={`group block px-0 md:px-8 py-8 md:py-4 ${
                i < tiers.length - 1 ? 'md:border-r border-b md:border-b-0' : ''
              } border-[color:var(--border-subtle)] ${i === 0 ? 'md:pl-0' : ''} ${
                i === tiers.length - 1 ? 'md:pr-0' : ''
              }`}
            >
              <div className="flex items-baseline gap-3 mb-5">
                <span className="eyebrow text-[color:var(--accent)] tabular">{`0${i + 1}`}</span>
                <span className="eyebrow">Tier</span>
                {t.highlight && (
                  <span className="ml-auto chip chip-accent !px-2 !py-0.5 !text-[9px]">
                    <span className="dot-live" aria-hidden /> Most picked
                  </span>
                )}
              </div>

              <p className="display text-3xl md:text-[2.2rem] leading-none text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">
                {t.name}
              </p>
              <p className="mt-3 serif-italic text-[color:var(--ink-muted)] text-base md:text-lg">
                {t.oneLiner}
              </p>

              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-sm border-t border-[color:var(--border-subtle)] pt-4">
                <dt className="eyebrow self-center">Price</dt>
                <dd className="text-[color:var(--ink)] tabular">{t.price}</dd>
                <dt className="eyebrow self-center">Delivery</dt>
                <dd className="text-[color:var(--ink-muted)] tabular">{t.delivery}</dd>
              </dl>

              <p className="mt-6 eyebrow !tracking-[0.25em] text-[color:var(--ink-muted)] group-hover:text-[color:var(--accent)] transition-colors">
                Read the spread ↓
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className="divider-gradient" />
    </section>
  )
}
