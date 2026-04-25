import React from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'

interface AddOn { name: string; description: string; price: string }

const addOns: AddOn[] = [
  { name: 'Copywriting',          description: 'One page of copy — research, draft, two revisions.', price: 'CHF 150' },
  { name: 'Extra page',           description: 'Add a page to Starter or Business — designed, built, in style.', price: 'CHF 150' },
  { name: 'Extra revision round', description: 'A full batch of feedback, implemented in one pass.', price: 'CHF 200' },
  { name: 'Logo design · basic',  description: 'Typographic mark + monogram. Three directions, final vector.', price: 'CHF 300' },
  { name: 'Multilingual',         description: 'Translation setup + routing. Starting at DE + EN.', price: 'from CHF 400' },
  { name: 'Photoshoot direction', description: 'We direct · external photographer bills separately.', price: 'from CHF 600' },
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
      {/* Chapter header */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pt-20 md:pt-28 pb-10 md:pb-14">
        <div className="flex items-center gap-4 mb-8 md:mb-12">
          <span className="eyebrow text-[color:var(--accent)]">Chapter · IV</span>
          <span className="flex-1 divider-gradient" aria-hidden />
          <span className="hidden sm:inline eyebrow">Extras &amp; retainers</span>
        </div>
        <h2 className="display text-[clamp(2rem,5vw,4rem)] text-[color:var(--ink)] max-w-[18ch] leading-[1.02]">
          The extras.{' '}
          <span className="serif-italic text-[color:var(--accent)]">Honest prices.</span>
        </h2>
        <p className="mt-6 md:mt-8 measure text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
          Everything priced up front. No &ldquo;contact us for a quote&rdquo; games.
        </p>
      </div>

      {/* Add-ons — editorial menu list */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-24">
        <p className="eyebrow mb-5">Add-ons</p>
        <ul className="border-t border-[color:var(--border-default)]">
          {addOns.map((a) => (
            <li
              key={a.name}
              className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_2fr_auto] items-baseline gap-x-6 md:gap-x-10 py-5 md:py-6 border-b border-[color:var(--border-subtle)] group transition-colors hover:bg-[color:var(--surface-1)]/50"
            >
              <p className="display text-lg md:text-xl text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">
                {a.name}
              </p>
              <p className="hidden md:block text-sm text-[color:var(--ink-muted)] leading-relaxed measure">
                {a.description}
              </p>
              <p className="tabular text-base md:text-lg text-[color:var(--ink)] whitespace-nowrap">
                {a.price}
              </p>
              <p className="md:hidden text-xs text-[color:var(--ink-muted)] col-span-2 leading-relaxed">
                {a.description}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Maintenance — 2-up editorial split */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-28 md:pb-32 border-t border-[color:var(--border-subtle)] pt-16 md:pt-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-x-10 gap-y-8 mb-12 md:mb-16">
          <div>
            <p className="eyebrow mb-5">Retainer · Optional</p>
            <h3 className="display text-3xl md:text-4xl lg:text-5xl text-[color:var(--ink)] leading-[1.02]">
              Hosting &amp;{' '}
              <span className="serif-italic text-[color:var(--accent)]">maintenance.</span>
            </h3>
          </div>
          <p className="measure text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed self-end">
            Month to month. Cancel with 30 days notice. You keep the code regardless.
            We bill in CHF, VAT excluded.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[color:var(--border-default)]">
          {maintenance.map((tier, i) => (
            <div
              key={tier.name}
              className={`px-0 md:px-8 py-10 md:py-12 ${
                i === 0 ? 'md:border-r border-b md:border-b-0' : ''
              } border-[color:var(--border-subtle)] ${tier.highlight ? 'md:bg-[color:var(--surface-1)]' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-4 mb-4">
                <p className="eyebrow text-[color:var(--accent)] tabular">
                  Tier · {String(i + 1).padStart(2, '0')}
                </p>
                <p className="eyebrow">Monthly</p>
              </div>

              <p className="display text-4xl md:text-5xl text-[color:var(--ink)] mb-2">
                {tier.name}
              </p>
              <p className="serif-italic text-lg md:text-xl text-[color:var(--ink-muted)] mb-8">
                {tier.tagline}
              </p>

              <div className="flex items-baseline gap-3 border-t border-b border-[color:var(--border-subtle)] py-5 mb-8">
                <p className="tabular text-3xl md:text-4xl text-[color:var(--ink)]">{tier.price}</p>
                <p className="eyebrow">/ month</p>
              </div>

              <ul className="space-y-3 mb-10">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[color:var(--ink-muted)] leading-relaxed">
                    <span className="mt-2 inline-block w-3 h-[2px] bg-[color:var(--accent)] shrink-0" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/contact/start?hosting=${tier.name.toLowerCase().replace(' ', '-')}`}
                className="group inline-flex items-center justify-between gap-3 border-t border-[color:var(--border-subtle)] pt-5 text-sm font-medium text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors w-full"
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
