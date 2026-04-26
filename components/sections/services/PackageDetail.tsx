import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight } from 'lucide-react'

// Layout-only metadata for each tier — actual copy lives in
// `messages/{en,de,fi}.json` under `ServicesPage.Detail.{id}.*`. Keeping
// the page list as stable IDs lets the translation files own the
// `name` + `description` for each row.
type TierId = 'starter' | 'business' | 'pro'

interface TierLayout {
  id: TierId
  pageIds: readonly string[]
  extraIds: readonly string[]
  isHighlight?: boolean
  reference?: {
    href: string
    image?: string
    external?: boolean
  }
}

const tiers: readonly TierLayout[] = [
  {
    id: 'starter',
    pageIds: ['home', 'about', 'services', 'contact'],
    extraIds: [],
  },
  {
    id: 'business',
    pageIds: ['home', 'about', 'services', 'team', 'blog', 'contact'],
    extraIds: ['cms', 'animations', 'jsonLd', 'openGraph', 'analytics', 'copywriting', 'lighthouse'],
    isHighlight: true,
    reference: {
      href: 'https://coremedical.ch',
      image: '/work/core-medical.jpg',
      external: true,
    },
  },
  {
    id: 'pro',
    pageIds: ['custom', 'multilingual', 'booking', 'protected'],
    extraIds: ['multilingual', 'ecommerce', 'integrations', 'revisions', 'copywriting', 'photography', 'retainer', 'discovery'],
    reference: {
      href: 'https://www.veloscout.ch',
      image: '/work/veloscout.png',
      external: true,
    },
  },
] as const

function DetailBlock({ tier, index }: { tier: TierLayout; index: number }) {
  // `useTranslations` accessor scoped to the tier-specific subtree so
  // page lookups are short: t(`pages.${id}.name`).
  const tDetail = useTranslations(`ServicesPage.Detail.${tier.id}`)
  const tShared = useTranslations('ServicesPage.Detail')
  const tHero = useTranslations('ServicesPage.Hero')
  const isFirst = index === 0
  const tierName = tHero(`tier.${tier.id}.name`)
  const tierPrice = tHero(`tier.${tier.id}.price`)

  return (
    <article
      id={`package-${tier.id}`}
      className={`scroll-mt-28 py-20 md:py-28 ${isFirst ? '' : 'border-t border-[color:var(--border-subtle)]'}`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Identity band — `relative` so the highlight chip can absolute-
            position in the top-right of THIS band, keeping Business's
            body copy at the same y as Starter / Pro. Previously the
            "— most picked" inline subtitle pushed Business's body down
            and broke vertical rhythm across the three tier spreads. */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 md:mb-20">
          {tier.isHighlight && (
            <span className="absolute -top-2 right-0 inline-flex items-center gap-1.5 chip chip-accent !text-[10px]">
              <span className="dot-live" aria-hidden /> {tShared('mostPicked').replace(/^—\s*/, '')}
            </span>
          )}
          <div className="lg:col-span-7">
            <h2 className="display text-5xl md:text-6xl lg:text-7xl text-[color:var(--ink)] leading-[1.0]">
              {tierName}
            </h2>
            <p className="mt-8 text-xl md:text-2xl text-[color:var(--ink-muted)] leading-[1.5] max-w-2xl">
              {tDetail('bestForLong')}
            </p>
          </div>

          <div className="lg:col-span-5 lg:pl-10 lg:border-l border-[color:var(--border-subtle)] flex flex-col justify-center">
            <p
              className="display text-4xl md:text-5xl text-[color:var(--ink)]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {tierPrice}
            </p>
            <p className="mt-4 text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
              {tDetail('delivery')} · {tDetail('revisions')}
            </p>
            <p className="mt-1 text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
              {tDetail('bestFor')}
            </p>

            <Link
              href={`/contact/start?package=${tier.id}`}
              className="mt-10 btn btn-primary w-full justify-between"
            >
              {tShared('startBriefCta', { name: tierName })}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* What's in it */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 md:mb-20">
          <p className="lg:col-span-5 text-lg md:text-xl text-[color:var(--ink-muted)] leading-[1.6]">
            {tDetail('designDescription')}
          </p>

          <div className="lg:col-span-7 lg:border-l lg:pl-10 border-[color:var(--border-subtle)]">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {tier.pageIds.map((pid) => (
                <li key={pid}>
                  <p className="text-lg md:text-xl text-[color:var(--ink)]">
                    {tDetail(`pages.${pid}.name`)}
                  </p>
                  <p className="mt-1 text-sm md:text-base text-[color:var(--ink-muted)] leading-relaxed">
                    {tDetail(`pages.${pid}.description`)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm md:text-base text-[color:var(--ink-muted)]">
              {tDetail('pageNote')}
            </p>

            {tier.extraIds.length > 0 && (
              <ul className="mt-10 pt-10 border-t border-[color:var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                {tier.extraIds.map((eid) => (
                  <li
                    key={eid}
                    className="text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed"
                  >
                    {tDetail(`extras.${eid}`)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Live reference */}
        {tier.reference && (
          <div className="border-t border-[color:var(--border-subtle)] pt-16 md:pt-20">
            <a
              href={tier.reference.href}
              target={tier.reference.external ? '_blank' : undefined}
              rel={tier.reference.external ? 'noopener noreferrer' : undefined}
              className="group block"
            >
              {tier.reference.image && (
                <div className="relative aspect-[16/9] mb-8 overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)]">
                  <Image
                    src={tier.reference.image}
                    alt={tDetail('reference.client')}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <p className="display text-2xl md:text-3xl text-[color:var(--ink)] leading-tight">
                    {tDetail('reference.client')}
                  </p>
                  <p className="mt-2 text-base md:text-lg text-[color:var(--ink-muted)]">
                    {tDetail('reference.sector')}
                  </p>
                  <p className="mt-4 text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed max-w-2xl">
                    {tDetail('reference.note')}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-6 w-6 text-[color:var(--ink)] shrink-0 mt-2 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform"
                  strokeWidth={1.5}
                />
              </div>
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

export default function PackageDetail() {
  return (
    <section id="package-detail" className="relative w-full">
      {tiers.map((tier, i) => (
        <DetailBlock key={tier.id} tier={tier} index={i} />
      ))}
    </section>
  )
}
