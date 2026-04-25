import React from 'react'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Mail, MapPin, Clock } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with CL Solutions. Premium websites for founders anywhere.',
}

type Token =
  | { kind: 'word'; text: string }
  | { kind: 'underline'; text: string }

const headlineTokens: Token[] = [
  { kind: 'word',      text: 'Get' },
  { kind: 'word',      text: 'in' },
  { kind: 'underline', text: 'touch.' },
]

export default function ContactPage() {
  const wordStride = 0.1

  const rows: Array<{ label: string; value: string; href?: string; icon: typeof Mail }> = [
    { label: 'Email',    value: 'colin@clsolutions.dev', href: 'mailto:colin@clsolutions.dev', icon: Mail },
    { label: 'Studio',   value: 'Zurich · Helsinki', icon: MapPin },
    { label: 'Response', value: 'Within 24 hours', icon: Clock },
  ]

  return (
    <>
      <Navigation />

      <section className="relative w-full pt-36 md:pt-44 pb-24 md:pb-32 overflow-hidden">
        <div aria-hidden className="grid-noise" />

        <div className="relative mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
          <div className="fade-up mb-10 md:mb-14">
            <span className="eyebrow">Contact · Available now</span>
          </div>

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
            Have a question or want to discuss a project? Reach out directly — no forms, no funnels.
          </p>

          {/* Editorial hairline-divided list */}
          <ul className="mt-14 md:mt-20 border-t border-[color:var(--border-default)]">
            {rows.map((row) => {
              const Tag: React.ElementType = row.href ? 'a' : 'div'
              return (
                <li key={row.label} className="border-b border-[color:var(--border-subtle)]">
                  <Tag
                    href={row.href}
                    className="group grid grid-cols-[28px_140px_1fr_auto] md:grid-cols-[32px_160px_1fr_auto] items-center gap-4 md:gap-6 py-5 md:py-6"
                  >
                    <row.icon className="h-4 w-4 text-[color:var(--ink-muted)] group-hover:text-[color:var(--accent)] transition-colors" />
                    <p className="eyebrow">{row.label}</p>
                    <p className="text-[15px] md:text-base text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">
                      {row.value}
                    </p>
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
              Ready to start? Fill in your brief and we&apos;ll send you a plan within 24 hours.
            </p>
            <Link href="/contact/start" className="btn btn-primary shrink-0">
              Start a project
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
