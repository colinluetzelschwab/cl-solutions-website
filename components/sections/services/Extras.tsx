import React from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

interface AddOn {
  name: string
  description: string
  price?: string
  href?: string
  hrefLabel?: string
}

const addOns: AddOn[] = [
  { name: 'Copywriting',          description: 'One page of copy — research, draft, two revisions.', price: 'CHF 150' },
  { name: 'Extra page',           description: 'Add a page to Starter or Business — designed, built, in style.', price: 'CHF 150' },
  { name: 'Extra revision round', description: 'A full batch of feedback, implemented in one pass.', price: 'CHF 200' },
  // Logo design — links out to the sister studio (aariviiva.fi when live,
  // aariviiva.vercel.app for now). No price shown here.
  {
    name: 'Logo design · basic',
    description: 'Typographic mark + monogram by our sister studio Aariviiva.',
    href: 'https://aariviiva.vercel.app',
    hrefLabel: 'aariviiva.fi',
  },
  { name: 'Multilingual',         description: 'Translation setup + routing. Starting at DE + EN.', price: 'from CHF 400' },
]

interface MaintenanceTier {
  name: string
  price: string
  tagline: string
  features: string[]
  highlight?: boolean
}

const maintenance: MaintenanceTier[] = [
  {
    name: 'Basic',
    price: 'CHF 49',
    tagline: 'Keep the lights on.',
    features: ['Vercel hosting · SSL', 'Uptime monitoring', '99.9% uptime SLA', 'Quarterly dependency updates'],
  },
  {
    name: 'Full Service',
    price: 'CHF 149',
    tagline: 'Your retainer, your team.',
    features: ['Everything in Basic', 'Monthly text + image changes', 'Priority support within 24h', 'Monthly performance report'],
    highlight: true,
  },
]

export default function Extras() {
  return (
    <section className="relative w-full border-t border-[color:var(--border-subtle)]">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <h2 className="display text-[clamp(2.4rem,5.6vw,4.4rem)] text-[color:var(--ink)] max-w-[18ch] leading-[1.02]">
          Extras
        </h2>
        <p className="mt-6 md:mt-8 measure text-lg md:text-xl text-[color:var(--ink-muted)] leading-relaxed">
          Everything priced up front. No &ldquo;contact us for a quote&rdquo; games.
        </p>
      </div>

      {/* Add-ons — editorial menu list */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-24 md:pb-28">
        <ul className="border-t border-[color:var(--border-subtle)]">
          {addOns.map((a) => (
            <li
              key={a.name}
              className="relative grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] items-baseline gap-x-10 gap-y-2 py-7 md:py-8 border-b border-[color:var(--border-subtle)] group transition-colors hover:bg-[color:var(--surface-1)]/50"
            >
              {a.href && (
                <a
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${a.name} — ${a.hrefLabel ?? 'visit'}`}
                  className="absolute inset-0 z-[1]"
                />
              )}
              <p className="display text-xl md:text-2xl text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">
                {a.name}
              </p>
              <p className="text-base text-[color:var(--ink-muted)] leading-relaxed">
                {a.description}
              </p>
              {a.href ? (
                <p className="inline-flex items-center gap-1.5 text-base md:text-lg text-[color:var(--ink)] whitespace-nowrap group-hover:text-[color:var(--accent)] transition-colors">
                  {a.hrefLabel ?? a.href}
                  <ArrowUpRight className="h-4 w-4" />
                </p>
              ) : (
                <p
                  className="text-base md:text-lg text-[color:var(--ink)] whitespace-nowrap"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {a.price}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Maintenance — 2-up editorial split */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-28 md:pb-32 border-t border-[color:var(--border-subtle)] pt-20 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-x-10 gap-y-8 mb-16 md:mb-20">
          <div>
            <h3 className="display text-3xl md:text-4xl lg:text-5xl text-[color:var(--ink)] leading-[1.02]">
              Hosting &amp; maintenance
            </h3>
          </div>
          <p className="measure text-lg md:text-xl text-[color:var(--ink-muted)] leading-relaxed self-end">
            Month to month. Cancel with 30 days notice. You keep the code regardless.
            We bill in CHF, VAT excluded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[color:var(--border-subtle)]">
          {maintenance.map((tier, i) => (
            <div
              key={tier.name}
              className={`px-0 md:px-10 py-12 md:py-14 ${
                i === 0 ? 'md:border-r border-b md:border-b-0' : ''
              } border-[color:var(--border-subtle)]`}
            >
              <p className="display text-4xl md:text-5xl text-[color:var(--ink)]">
                {tier.name}
              </p>
              {tier.highlight && (
                <p className="mt-2 text-sm md:text-base text-[color:var(--ink-muted)]">
                  — most picked
                </p>
              )}
              <p className="mt-3 text-lg md:text-xl text-[color:var(--ink-muted)]">
                {tier.tagline}
              </p>

              <p
                className="mt-8 text-3xl md:text-4xl text-[color:var(--ink)]"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {tier.price}
                <span className="ml-2 text-base text-[color:var(--ink-muted)]">/ month</span>
              </p>

              <ul className="mt-10 space-y-3">
                {tier.features.map((f) => (
                  <li
                    key={f}
                    className="text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact/start?hosting=${tier.name.toLowerCase().replace(' ', '-')}`}
                className="group mt-10 inline-flex items-center justify-between gap-3 border-t border-[color:var(--border-subtle)] pt-5 text-base font-medium text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors w-full"
              >
                <span>Add {tier.name}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
