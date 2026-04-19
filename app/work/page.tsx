import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ProjectGrid from '@/components/work/ProjectGrid'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'Recent website projects for Swiss businesses. Custom-built, never from a template.',
}

type Token =
  | { kind: 'word'; text: string }
  | { kind: 'underline'; text: string }

const headlineTokens: Token[] = [
  { kind: 'word',      text: 'Selected' },
  { kind: 'underline', text: 'work.' },
]

export default function WorkPage() {
  const wordStride = 0.11
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: 'https://clsolutions.dev' },
          { name: 'Work', url: 'https://clsolutions.dev/work' },
        ]}
      />
      <Navigation />

      <section className="relative w-full pt-36 md:pt-44 pb-16 md:pb-24 overflow-hidden">
        <div aria-hidden className="grid-noise" />

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
          <div className="fade-up flex items-center gap-4 mb-10 md:mb-14">
            <span className="eyebrow">Portfolio · Live</span>
            <span className="flex-1 divider-gradient" aria-hidden />
            <span className="hidden sm:inline eyebrow">3 case studies</span>
          </div>

          <h1 className="display text-[clamp(2.8rem,7vw,5.4rem)] text-[color:var(--ink)] leading-[0.98]">
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
                <span
                  key={i}
                  className="word-reveal"
                  style={{ ['--word-delay' as string]: delay }}
                >
                  {tok.text}
                </span>
              )
            })}
          </h1>

          <p
            className="fade-up mt-8 md:mt-10 measure text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed"
            style={{ ['--fade-delay' as string]: '0.7s' }}
          >
            Every project is designed from scratch for its industry.{' '}
            <span className="serif-italic text-[color:var(--ink)]">No templates, no shortcuts.</span>
          </p>
        </div>
      </section>

      <ProjectGrid />

      {/* Editorial sendoff — lighter than a full CTABanner */}
      <section className="relative w-full py-24 md:py-32 border-t border-[color:var(--border-subtle)]">
        <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16 text-center">
          <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]">
            Like what{' '}
            <span className="serif-italic text-[color:var(--accent)]">you see?</span>
          </h2>
          <p className="mt-6 md:mt-8 measure mx-auto text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
            Tell us about your business — we&apos;ll show you what we can build.
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
            <Link href="/contact/start" className="btn btn-primary">
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
