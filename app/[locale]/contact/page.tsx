import React from 'react'
import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Mail, MapPin, Clock } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ContactPage.metadata')
  return {
    title: t('title'),
    description: t('description'),
  }
}

export default function ContactPage() {
  const t = useTranslations('ContactPage')
  const wordStride = 0.1

  // Headline: up to 3 tokens — first two plain, last one underlined italic
  // accent. Empty entries are filtered out so locales that don't fit a
  // 3-word pattern (e.g. Finnish "Ota yhteyttä." which is naturally 2
  // words) can leave a slot blank in `messages/*.json` and still render
  // cleanly without an empty span carrying the underline SVG.
  const headlineTokens = [
    { kind: 'word' as const, text: t('hero.word1') },
    { kind: 'word' as const, text: t('hero.word2') },
    { kind: 'underline' as const, text: t('hero.word3') },
  ].filter((tok) => tok.text.trim().length > 0)

  // Row data — values split between code (literal email/url) and i18n
  // (label + non-link prose). Email value stays code-side because it's
  // a literal address that doesn't translate.
  const rows: Array<{ label: string; value: string; href?: string; icon: typeof Mail }> = [
    { label: t('rows.emailLabel'),    value: 'colin@clsolutions.dev', href: 'mailto:colin@clsolutions.dev', icon: Mail },
    { label: t('rows.studioLabel'),   value: t('rows.studioValue'), icon: MapPin },
    { label: t('rows.responseLabel'), value: t('rows.responseValue'), icon: Clock },
  ]

  return (
    <>
      <Navigation />

      <section className="relative w-full pt-36 md:pt-44 pb-24 md:pb-32 overflow-hidden">
        <div aria-hidden className="grid-noise" />

        <div className="relative mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
          <h1 className="display text-[clamp(2.6rem,6vw,4.6rem)] text-[color:var(--ink)] leading-[0.98]">
            {headlineTokens.map((tok, i) => {
              const delay = `${0.2 + i * wordStride}s`
              if (tok.kind === 'underline') {
                return (
                  <span
                    key={i}
                    className="word-reveal serif-italic text-[color:var(--accent)] relative inline-block ml-[0.2em]"
                    style={{ ['--word-delay' as string]: delay }}
                  >
                    {tok.text}
                    <svg className="draw-underline" viewBox="0 0 600 14" preserveAspectRatio="none" aria-hidden>
                      <path d="M 6 9 C 90 3, 180 13, 280 7 S 480 3, 594 8" />
                    </svg>
                  </span>
                )
              }
              return (
                <React.Fragment key={i}>
                  <span className="word-reveal" style={{ ['--word-delay' as string]: delay }}>
                    {tok.text}
                  </span>{' '}
                </React.Fragment>
              )
            })}
          </h1>

          <p
            className="fade-up mt-8 md:mt-10 measure text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed"
            style={{ ['--fade-delay' as string]: '0.7s' }}
          >
            {t('hero.body')}
          </p>

          {/* Editorial hairline-divided list */}
          {/* Mobile collapses to a 3-col grid (icon · stacked label+value · arrow)
              so long values like the email address aren't clipped by a fixed
              label column; sm+ restores the four-column ledger via `sm:contents`
              promoting the inner pair to direct grid items. */}
          <ul className="mt-14 md:mt-20 border-t border-[color:var(--border-default)]">
            {rows.map((row) => {
              const Tag: React.ElementType = row.href ? 'a' : 'div'
              return (
                <li key={row.label} className="border-b border-[color:var(--border-subtle)]">
                  <Tag
                    href={row.href}
                    className="group grid grid-cols-[24px_1fr_auto] sm:grid-cols-[28px_140px_1fr_auto] md:grid-cols-[32px_160px_1fr_auto] items-center gap-3 sm:gap-4 md:gap-6 py-5 md:py-6"
                  >
                    <row.icon className="h-4 w-4 text-[color:var(--ink-muted)] group-hover:text-[color:var(--accent)] transition-colors" />
                    <div className="flex flex-col gap-0.5 sm:contents">
                      <p className="eyebrow">{row.label}</p>
                      <p className="text-[15px] md:text-base text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors break-words">
                        {row.value}
                      </p>
                    </div>
                    {row.href && (
                      <ArrowUpRight className="h-4 w-4 text-[color:var(--ink-faint)] group-hover:text-[color:var(--accent)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                    )}
                  </Tag>
                </li>
              )
            })}
          </ul>

          <div className="mt-16 md:mt-20 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="measure text-sm text-[color:var(--ink-muted)]">
              {t('footer.body')}
            </p>
            <Link href="/contact/start" className="btn btn-primary shrink-0">
              {t('footer.cta')}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
