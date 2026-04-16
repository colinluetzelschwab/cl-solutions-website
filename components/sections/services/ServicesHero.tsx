import React from 'react'
import Link from 'next/link'

interface TierSummary {
  id: 'starter' | 'business' | 'pro'
  name: string
  price: string
  delivery: string
  oneLiner: string
}

const tiers: TierSummary[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'CHF 1,500',
    delivery: '3–5 days',
    oneLiner: 'One focused funnel.',
  },
  {
    id: 'business',
    name: 'Business',
    price: 'CHF 3,500',
    delivery: '5–7 days',
    oneLiner: 'The full brand system.',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'from CHF 7,500',
    delivery: 'Scoped',
    oneLiner: 'When off-the-shelf stops scaling.',
  },
]

export default function ServicesHero() {
  return (
    <section className="relative w-full bg-background-primary overflow-hidden">
      {/* Section top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-border-default" aria-hidden />

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-28 md:pt-40 lg:pt-48 pb-0">
        {/* Chapter marker */}
        <div className="flex items-center gap-4 mb-10 md:mb-14">
          <span className="font-mono text-[11px] text-[#C8956C] tracking-[0.3em] uppercase">
            Chapter 01 · Pricing
          </span>
          <span className="flex-1 h-px bg-border-subtle" aria-hidden />
          <span className="hidden sm:inline font-mono text-[11px] text-text-muted tracking-[0.3em] uppercase">
            Last updated · Q2 2026
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-[clamp(2.75rem,8vw,6.5rem)] font-light text-text-primary tracking-[-0.035em] leading-[0.95] max-w-[18ch]">
          Three packages.
          <br />
          <span className="inline-block font-[family-name:var(--font-display)] italic text-[#C8956C] pr-[0.1em]">
            One
          </span>{' '}
          <span className="inline-block font-[family-name:var(--font-display)] italic text-[#C8956C] pr-[0.1em]">
            standard.
          </span>
        </h1>

        {/* Deck */}
        <p className="mt-10 md:mt-14 text-lg md:text-2xl text-text-secondary leading-[1.4] max-w-2xl font-light">
          Every site is hand-built and{' '}
          <span className="font-[family-name:var(--font-display)] italic text-text-primary">
            custom-designed.
          </span>{' '}
          The tiers differ in scope and depth, not quality. Scroll, compare,
          pick one.
        </p>
      </div>

      {/* Tier summary ledger — at-a-glance band */}
      <div className="mt-20 md:mt-28 border-y border-border-default bg-background-surface">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-border-subtle">
            {tiers.map((t, i) => (
              <Link
                key={t.id}
                href={`#package-${t.id}`}
                className={`group block md:px-8 ${i === 0 ? 'md:pl-0' : ''} ${
                  i === tiers.length - 1 ? 'md:pr-0' : ''
                }`}
              >
                {/* Tier index + name */}
                <div className="flex items-baseline gap-3 mb-4">
                  <span className="font-mono text-[11px] text-[#C8956C] tabular-nums tracking-[0.2em]">
                    {`0${i + 1}`}
                  </span>
                  <span className="text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase">
                    Tier
                  </span>
                </div>

                {/* Name */}
                <p className="text-3xl md:text-4xl font-light text-text-primary tracking-[-0.02em] leading-none group-hover:text-[#C8956C] transition-colors">
                  {t.name}
                </p>

                {/* Italic promise */}
                <p className="mt-3 font-[family-name:var(--font-display)] italic text-text-secondary text-base md:text-lg">
                  {t.oneLiner}
                </p>

                {/* Price + delivery — mono readouts */}
                <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm">
                  <dt className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase self-center">
                    Price
                  </dt>
                  <dd className="font-mono text-text-primary tabular-nums">
                    {t.price}
                  </dd>
                  <dt className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase self-center">
                    Delivery
                  </dt>
                  <dd className="font-mono text-text-secondary tabular-nums">
                    {t.delivery}
                  </dd>
                </dl>

                {/* Jump-to hint */}
                <p className="mt-5 font-mono text-[10px] tracking-[0.25em] uppercase text-text-muted group-hover:text-text-primary transition-colors">
                  Read the spread ↓
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
