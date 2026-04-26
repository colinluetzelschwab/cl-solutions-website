import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

// Layout-only structure for add-ons. Copy lives in
// `messages/{en,de,fi}.json` under `ServicesPage.Extras.addOns.{id}.*`.
// `href` is included for the logo row that links out to the sister
// studio Aariviiva — that card replaces the price with a link label.
type AddOnId = 'copywriting' | 'extraPage' | 'extraRevision' | 'logo' | 'multilingual'

interface AddOnLayout {
  id: AddOnId
  href?: string
}

const addOns: readonly AddOnLayout[] = [
  { id: 'copywriting' },
  { id: 'extraPage' },
  { id: 'extraRevision' },
  { id: 'logo', href: 'https://aariviiva.vercel.app' },
  { id: 'multilingual' },
] as const

type MaintenanceId = 'basic' | 'fullService'
interface MaintenanceLayout {
  id: MaintenanceId
  highlight?: boolean
  /** Stable URL slug for ?hosting=… query — must NOT be translated. */
  slug: string
}

const maintenance: readonly MaintenanceLayout[] = [
  { id: 'basic', slug: 'basic' },
  { id: 'fullService', slug: 'full-service', highlight: true },
] as const

export default function Extras() {
  const t = useTranslations('ServicesPage.Extras')
  const tAddOn = useTranslations('ServicesPage.Extras.addOns')
  const tMaint = useTranslations('ServicesPage.Extras.Maintenance')

  return (
    <section className="relative w-full border-t border-[color:var(--border-subtle)]">
      {/* Header */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pt-24 md:pt-32 pb-12 md:pb-16">
        <h2 className="display text-[clamp(2.4rem,5.6vw,4.4rem)] text-[color:var(--ink)] max-w-[18ch] leading-[1.02]">
          {t('heading')}
        </h2>
        <p className="mt-6 md:mt-8 measure text-lg md:text-xl text-[color:var(--ink-muted)] leading-relaxed">
          {t('lead')}
        </p>
      </div>

      {/* Add-ons — uniform card grid. Each card has identical structure
          (eyebrow name, description, price-or-link CTA at the bottom) so
          the prices line up at the same y across columns regardless of
          how long the description above wraps. The price column used to
          be inline in an editorial menu list, but per-row `auto`-sized
          grid cells were shifting different add-ons left and right
          based on price-string width — cards remove that entirely. */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-24 md:pb-28">
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {addOns.map((a) => {
            const name = tAddOn(`${a.id}.name`)
            const description = tAddOn(`${a.id}.description`)
            const price = a.href ? null : tAddOn(`${a.id}.price`)
            const hrefLabel = a.href ? tAddOn(`${a.id}.hrefLabel`) : null

            const cardInner = (
              <article className="card-surface card-floating group relative h-full flex flex-col p-6 md:p-7">
                <p className="eyebrow text-[color:var(--ink-muted)] mb-4">{name}</p>
                <p className="text-[15px] md:text-base text-[color:var(--ink-muted)] leading-relaxed flex-1">
                  {description}
                </p>
                <div className="mt-6 pt-5 border-t border-[color:var(--border-subtle)] flex items-baseline justify-between gap-3">
                  {a.href ? (
                    <span className="display text-xl md:text-2xl text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors inline-flex items-baseline gap-1.5">
                      {hrefLabel ?? a.href}
                      <ArrowUpRight className="h-4 w-4 self-center" />
                    </span>
                  ) : (
                    <span
                      className="display text-xl md:text-2xl text-[color:var(--ink)]"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {price}
                    </span>
                  )}
                </div>
              </article>
            )

            return (
              <li key={a.id} className="h-full">
                {a.href ? (
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${name} — ${hrefLabel ?? 'visit'}`}
                    className="block h-full"
                  >
                    {cardInner}
                  </a>
                ) : (
                  cardInner
                )}
              </li>
            )
          })}
        </ul>
      </div>

      {/* Maintenance — 2-up editorial split */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-28 md:pb-32 border-t border-[color:var(--border-subtle)] pt-20 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-x-10 gap-y-8 mb-16 md:mb-20">
          <div>
            <h3 className="display text-3xl md:text-4xl lg:text-5xl text-[color:var(--ink)] leading-[1.02]">
              {tMaint('heading')}
            </h3>
          </div>
          <p className="measure text-lg md:text-xl text-[color:var(--ink-muted)] leading-relaxed self-end">
            {tMaint('lead')}
          </p>
        </div>

        {/* Basic vs Full Service: kept as a 2-col split, but the highlight
            badge is now ABSOLUTE in the corner instead of an inline
            subtitle, so both cards have the SAME vertical rhythm
            (name → tagline → price → features → CTA). The badge no
            longer pushes Full Service's price + features below Basic's. */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[color:var(--border-subtle)]">
          {maintenance.map((tier, i) => {
            const tierName = tMaint(`${tier.id}.name`)
            return (
              <div
                key={tier.id}
                className={`relative px-0 md:px-10 py-12 md:py-14 ${
                  i === 0 ? 'md:border-r border-b md:border-b-0' : ''
                } border-[color:var(--border-subtle)]`}
              >
                {tier.highlight && (
                  <span className="absolute top-6 right-0 md:right-10 inline-flex items-center gap-1.5 chip chip-accent !text-[10px]">
                    <span className="dot-live" aria-hidden /> {tMaint('mostPicked').replace(/^—\s*/, '')}
                  </span>
                )}
                <p className="display text-4xl md:text-5xl text-[color:var(--ink)]">
                  {tierName}
                </p>
                <p className="mt-3 text-lg md:text-xl text-[color:var(--ink-muted)]">
                  {tMaint(`${tier.id}.tagline`)}
                </p>

                <p
                  className="mt-8 text-3xl md:text-4xl text-[color:var(--ink)]"
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {tMaint(`${tier.id}.price`)}
                  <span className="ml-2 text-base text-[color:var(--ink-muted)]">{tMaint('perMonth')}</span>
                </p>

                <ul className="mt-10 space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <li
                      key={n}
                      className="text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed"
                    >
                      {tMaint(`${tier.id}.f${n}`)}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/contact/start?hosting=${tier.slug}`}
                  className="group mt-10 inline-flex items-center justify-between gap-3 border-t border-[color:var(--border-subtle)] pt-5 text-base font-medium text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors w-full"
                >
                  <span>{tMaint('addCta', { name: tierName })}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
