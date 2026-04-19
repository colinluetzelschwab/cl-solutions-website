import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface Pkg {
  name: string
  price: string
  description: string
  features: string[]
  popular?: boolean
}

const packages: Pkg[] = [
  {
    name: 'Starter',
    price: '1,500',
    description: 'A clean, fast website that gets straight to the point.',
    features: ['Up to 4 pages', 'Mobile-optimized', '1 revision round', '3–5 day delivery'],
  },
  {
    name: 'Business',
    price: '3,500',
    description: 'The full package — design, content management, animations, SEO.',
    features: ['Up to 6 pages', 'CMS included', 'Custom animations', 'SEO optimized'],
    popular: true,
  },
  {
    name: 'Pro',
    price: '7,500+',
    description: 'Custom scope for businesses that need more.',
    features: ['Custom page count', 'Multilingual', 'E-commerce ready', 'Retainer option'],
  },
]

export default function ServicesOverview() {
  return (
    <section id="packages" className="relative w-full py-24 md:py-32 border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Chapter I · Packages</p>
            <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]">
              Three options.{' '}
              <span className="serif-italic text-[color:var(--accent)]">Zero surprises.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:col-start-9 self-end">
            <p className="measure text-[color:var(--ink-muted)] text-base leading-relaxed">
              Fixed scope, fixed pricing, fixed timeline. You know exactly what you’re
              getting before we write a single line of code.
            </p>
          </div>
        </div>

        {/* Editorial ledger cards — flat, typographic, minimal ornament */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[color:var(--border-default)]">
          {packages.map((pkg, i) => (
            <article
              key={pkg.name}
              className={`group flex flex-col px-6 md:px-8 py-10 md:py-12 ${
                i < packages.length - 1 ? 'md:border-r border-[color:var(--border-subtle)]' : ''
              } ${i < packages.length - 1 ? 'border-b md:border-b-0' : ''} border-[color:var(--border-subtle)] ${
                pkg.popular ? 'bg-[color:var(--surface-1)]' : ''
              }`}
            >
              <div className="flex items-baseline gap-3 mb-6">
                <span className="eyebrow text-[color:var(--accent)] tabular">
                  {`0${i + 1}`}
                </span>
                <span className="eyebrow">{pkg.name}</span>
                {pkg.popular && (
                  <span className="ml-auto chip chip-accent !px-2 !py-0.5 !text-[9px]">
                    <span className="dot-live" aria-hidden /> Most picked
                  </span>
                )}
              </div>

              <p className="display text-[clamp(2.2rem,4vw,3rem)] leading-none text-[color:var(--ink)] tabular">
                <span className="text-[color:var(--ink-faint)] text-base mr-2 align-top mt-2 inline-block font-[var(--font-inter)] tracking-wide">
                  CHF
                </span>
                {pkg.price}
              </p>

              <p className="mt-6 measure text-[15px] leading-relaxed text-[color:var(--ink-muted)]">
                {pkg.description}
              </p>

              <ul className="mt-8 flex flex-col gap-2.5 border-t border-[color:var(--border-subtle)] pt-6 flex-1">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-baseline gap-3 text-sm text-[color:var(--ink-muted)]">
                    <span className="inline-block w-3 h-[1px] bg-[color:var(--accent)] mt-[9px] shrink-0" aria-hidden />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/contact/start"
                className="mt-10 inline-flex items-center gap-1.5 text-sm text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors group/link"
              >
                Start {pkg.name}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <Link href="/services" className="link-ghost eyebrow">
            Compare all packages →
          </Link>
        </div>
      </div>
    </section>
  )
}
