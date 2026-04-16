import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface AddOn {
  name: string
  description: string
  price: string
}

const addOns: AddOn[] = [
  {
    name: 'Copywriting',
    description: 'One page of copy — research, draft, two revisions.',
    price: 'CHF 150',
  },
  {
    name: 'Extra page',
    description: 'Add a page to Starter or Business — designed, built, in style.',
    price: 'CHF 150',
  },
  {
    name: 'Extra revision round',
    description: 'A full batch of feedback, implemented in one pass.',
    price: 'CHF 200',
  },
  {
    name: 'Logo design · basic',
    description: 'Typographic mark + monogram. Three directions, final vector.',
    price: 'CHF 300',
  },
  {
    name: 'Multilingual',
    description: 'Translation setup + routing. Starting at DE + EN.',
    price: 'from CHF 400',
  },
  {
    name: 'Photoshoot direction',
    description: 'We direct · external photographer bills separately.',
    price: 'from CHF 600',
  },
]

interface MaintenanceTier {
  name: string
  price: string
  tagline: string
  features: string[]
}

const maintenance: MaintenanceTier[] = [
  {
    name: 'Basic',
    price: 'CHF 49',
    tagline: 'Keep the lights on.',
    features: [
      'Vercel hosting · SSL',
      'Uptime monitoring',
      '99.9% uptime SLA',
      'Quarterly dependency updates',
    ],
  },
  {
    name: 'Full Service',
    price: 'CHF 149',
    tagline: 'Your retainer, your team.',
    features: [
      'Everything in Basic',
      'Monthly text + image changes',
      'Priority support within 24h',
      'Monthly performance report',
    ],
  },
]

export default function Extras() {
  return (
    <section className="w-full bg-background-surface border-t border-border-default">
      {/* Chapter header */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pt-20 md:pt-28 pb-10 md:pb-14">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-8 md:mb-12">
            <span className="font-mono text-[11px] text-[#C8956C] tracking-[0.3em] uppercase">
              Chapter · V
            </span>
            <span className="flex-1 h-px bg-border-subtle" aria-hidden />
            <span className="hidden sm:inline font-mono text-[11px] text-text-muted tracking-[0.3em] uppercase">
              Extras & retainers
            </span>
          </div>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-light text-text-primary tracking-[-0.025em] leading-[1.0] max-w-[18ch]">
            The extras.
            <br />
            <span className="font-[family-name:var(--font-display)] italic text-[#C8956C]">
              Honest prices.
            </span>
          </h2>
          <p className="mt-6 md:mt-8 text-base md:text-lg text-text-secondary max-w-xl leading-relaxed">
            Everything priced up front. No &ldquo;contact us for a quote&rdquo;
            games.
          </p>
        </ScrollReveal>
      </div>

      {/* Add-ons — editorial menu list */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 md:pb-24">
        <ScrollReveal>
          <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-6">
            Add-ons
          </p>
          <ul className="border-t border-border-default">
            {addOns.map((a) => (
              <li
                key={a.name}
                className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_2fr_auto] items-baseline gap-x-6 md:gap-x-10 py-5 md:py-6 border-b border-border-subtle hover:border-text-primary/40 transition-colors group"
              >
                <p className="text-lg md:text-xl font-light text-text-primary tracking-[-0.01em] col-span-1 group-hover:text-[#C8956C] transition-colors">
                  {a.name}
                </p>
                <p className="hidden md:block text-sm text-text-secondary leading-relaxed max-w-md">
                  {a.description}
                </p>
                <p className="font-mono text-base md:text-lg text-text-primary tabular-nums tracking-tight whitespace-nowrap">
                  {a.price}
                </p>
                {/* Mobile description below */}
                <p className="md:hidden text-xs text-text-secondary col-span-2 leading-relaxed">
                  {a.description}
                </p>
              </li>
            ))}
          </ul>
        </ScrollReveal>
      </div>

      {/* Maintenance retainers */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-24 md:pb-32 border-t border-border-default pt-16 md:pt-20">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-x-10 gap-y-8 mb-12 md:mb-16">
            <div>
              <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-4">
                Retainer · Optional
              </p>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary tracking-[-0.025em] leading-[1.0]">
                Hosting &
                <br />
                <span className="font-[family-name:var(--font-display)] italic text-[#C8956C]">
                  maintenance.
                </span>
              </h3>
            </div>
            <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-md self-end">
              Month to month. Cancel with 30 days notice. You keep the code
              regardless. We bill in CHF, VAT excluded.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-px bg-border-default">
          {maintenance.map((tier, i) => (
            <ScrollReveal key={tier.name} className="h-full">
              <div
                className={`h-full bg-background-primary p-8 md:p-10 flex flex-col ${
                  i === 1 ? 'md:border-l-0' : ''
                }`}
              >
                <div className="flex items-baseline justify-between gap-4 mb-4">
                  <p className="font-mono text-[10px] md:text-[11px] text-[#C8956C] tracking-[0.3em] uppercase">
                    Tier · {String(i + 1).padStart(2, '0')}
                  </p>
                  <p className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase">
                    Monthly
                  </p>
                </div>

                <p className="text-4xl md:text-5xl font-light text-text-primary tracking-[-0.025em] leading-none mb-2">
                  {tier.name}
                </p>

                <p className="font-[family-name:var(--font-display)] italic text-lg md:text-xl text-text-secondary mb-8">
                  {tier.tagline}
                </p>

                {/* Price row */}
                <div className="flex items-baseline gap-3 border-t border-b border-border-subtle py-5 mb-8">
                  <p className="font-mono text-3xl md:text-4xl text-text-primary tabular-nums tracking-tight">
                    {tier.price}
                  </p>
                  <p className="font-mono text-xs text-text-muted tracking-wider uppercase">
                    / month
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-10 flex-grow">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed"
                    >
                      <span
                        className="mt-2 inline-block w-3 h-[1px] bg-[#C8956C] shrink-0"
                        aria-hidden
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact/start?hosting=${tier.name.toLowerCase().replace(' ', '-')}`}
                  className="group inline-flex items-center justify-between gap-3 border-t border-border-default pt-5 text-sm font-medium text-text-primary hover:text-[#C8956C] transition-colors"
                >
                  <span>Add {tier.name}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
