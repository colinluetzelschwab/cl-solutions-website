import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const TIER_IDS = ['starter', 'business', 'pro'] as const
const HIGHLIGHT_TIER = 'business'

export default function ServicesHero() {
  const t = useTranslations('ServicesPage.Hero')
  const wordStride = 0.085
  const headlineWords = [
    t('headlineWord1'),
    t('headlineWord2'),
    t('headlineWord3'),
    t('headlineWord4'),
  ]

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
          {t('body')}
        </p>
      </div>

      {/* Tier ledger — flat editorial row, no chrome */}
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pb-20 md:pb-28">
        <div
          className="fade-up grid grid-cols-1 md:grid-cols-3 border-t border-[color:var(--border-subtle)]"
          style={{ ['--fade-delay' as string]: '1.1s' }}
        >
          {TIER_IDS.map((id, i) => (
            <Link
              key={id}
              href={`/contact/start?package=${id}`}
              className={`group relative block px-0 md:px-8 py-10 md:py-12 ${
                i < TIER_IDS.length - 1 ? 'md:border-r border-b md:border-b-0' : ''
              } border-[color:var(--border-subtle)] ${i === 0 ? 'md:pl-0' : ''} ${
                i === TIER_IDS.length - 1 ? 'md:pr-0' : ''
              }`}
            >
              {/* Highlight chip is absolute-positioned in the top-right
                  corner of the cell so all three tier cards have the
                  SAME vertical rhythm (name → oneLiner → price → delivery).
                  Previously the inline "— most picked" subtitle pushed
                  Business's oneLiner + price down, breaking symmetry. */}
              {id === HIGHLIGHT_TIER && (
                <span className="absolute top-10 md:top-12 right-0 md:right-8 inline-flex items-center gap-1.5 chip chip-accent !text-[10px]">
                  <span className="dot-live" aria-hidden /> {t('mostPicked').replace(/^—\s*/, '')}
                </span>
              )}
              <p className="display text-3xl md:text-[2.4rem] leading-none text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">
                {t(`tier.${id}.name`)}
              </p>
              <p className="mt-3 text-base md:text-lg text-[color:var(--ink-muted)]">
                {t(`tier.${id}.oneLiner`)}
              </p>

              <p
                className="mt-8 text-xl md:text-2xl text-[color:var(--ink)]"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {t(`tier.${id}.price`)}
              </p>
              <p className="mt-1 text-base md:text-lg text-[color:var(--ink-muted)]">
                {t(`tier.${id}.delivery`)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
