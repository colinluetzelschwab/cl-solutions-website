import React from 'react'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'

export const metadata: Metadata = {
  title: 'Start a Project',
  description:
    'Tell us about your project. Fill in your brief and we respond within 24 hours with a plan.',
}

type Token = { kind: 'word'; text: string } | { kind: 'underline'; text: string }

const headlineTokens: Token[] = [
  { kind: 'word',      text: 'Start' },
  { kind: 'word',      text: 'your' },
  { kind: 'underline', text: 'project.' },
]

export default function StartProjectPage() {
  const wordStride = 0.1
  return (
    <>
      <Navigation />

      <section className="relative w-full pt-36 md:pt-44 pb-6 md:pb-8 overflow-hidden">
        <div aria-hidden className="grid-noise" />

        <div className="relative mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
          <div className="fade-up mb-10 md:mb-14">
            <span className="eyebrow">Brief · 6 steps · ~ 4 minutes</span>
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
            Fill in your brief. We&apos;ll review it and send you a plan within 24 hours.
          </p>
        </div>
      </section>

      <section className="w-full pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
          <Suspense>
            <OnboardingWizard />
          </Suspense>
        </div>
      </section>

      <Footer />
    </>
  )
}
