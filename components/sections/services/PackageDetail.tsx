import React from 'react'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight } from 'lucide-react'

interface Page { name: string; description: string }
interface IncludedExtra { text: string }
interface Reference {
  client: string
  sector: string
  note: string
  href: string
  image?: string
  imageSwap?: string
  external?: boolean
}
interface Package {
  id: 'starter' | 'business' | 'pro'
  name: string
  price: string
  delivery: string
  revisions: string
  bestFor: string
  bestForLong: string
  pages: Page[]
  pageNote: string
  designDescription: string
  extras?: IncludedExtra[]
  reference?: Reference
  isHighlight?: boolean
}

const packages: Package[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'CHF 1,500',
    delivery: '3–5 business days',
    revisions: '1 revision round',
    bestFor: 'Freelancers · Landing pages · New ventures',
    bestForLong:
      'A focused brochure site that converts — one well-crafted funnel, nothing that looks cheap, nothing you don’t need.',
    pages: [
      { name: 'Home',     description: 'Hero · services snapshot · contact prompt' },
      { name: 'About',    description: 'Story · approach · why you' },
      { name: 'Services', description: 'What you offer, one clear block each' },
      { name: 'Contact',  description: 'Form · email · location · legal' },
    ],
    pageNote: 'Up to 4 pages. Add more for CHF 150 each.',
    designDescription:
      'A light brand system — deliberate palette, one display + one body font, spacing scale, mobile-first. Clean and modular, not templated.',
  },
  {
    id: 'business',
    name: 'Business',
    price: 'CHF 3,500',
    delivery: '5–7 business days',
    revisions: '1 revision round',
    bestFor: 'KMU · Clinics · Studios · Agencies',
    bestForLong:
      'The sweet spot for most Swiss SMEs. A real brand system, editable content, SEO that ranks, animation that carries meaning — not decoration.',
    pages: [
      { name: 'Home',       description: 'Hero · services · proof · team · contact' },
      { name: 'About',      description: 'Story · values · team' },
      { name: 'Services',   description: 'Detailed offering with sub-services' },
      { name: 'Team',       description: 'CMS-managed bios + photos' },
      { name: 'Blog / News',description: 'CMS-managed, SEO-ready' },
      { name: 'Contact',    description: 'Form · email · map · legal' },
    ],
    pageNote: 'Up to 6 pages. Structure tuned to your business.',
    designDescription:
      'A full brand system — custom palette, type-pairing, spacing and motion tokens. Scroll-driven reveals and micro-interactions that match the industry.',
    extras: [
      { text: 'Sanity CMS — edit text, images, team, blog' },
      { text: 'Scroll animations + micro-interactions' },
      { text: 'Structured data (JSON-LD) for rich results' },
      { text: 'Open Graph + Twitter cards on every page' },
      { text: 'Privacy-friendly analytics dashboard' },
      { text: 'Partial copywriting assistance' },
      { text: 'Lighthouse 90+ guarantee' },
    ],
    reference: {
      client: 'Core Medical',
      sector: 'Private health management · Zürich',
      note: 'Single-page with anchor nav, Sanity CMS, founders module, Resend contact, bilingual-ready.',
      href: 'https://coremedical.ch',
      image: '/work/core-medical.jpg',
      external: true,
    },
    isHighlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'From CHF 7,500',
    delivery: 'Scoped per project',
    revisions: '2 revision rounds',
    bestFor: 'Larger SMEs · E-commerce · Multilingual · Integrations',
    bestForLong:
      'When off-the-shelf stops scaling. Custom design direction, multi-language, real integrations (Supabase, Stripe, booking, CRM), production e-commerce, retainer-ready.',
    pages: [
      { name: 'Custom page count',  description: 'No artificial cap' },
      { name: 'Multilingual',       description: 'DE + EN standard, more as add-on' },
      { name: 'Product / booking',  description: 'Stripe · calendar · reservations' },
      { name: 'Protected areas',    description: 'Member logins, dashboards, admin' },
    ],
    pageNote: 'Scope defined during the discovery phase.',
    designDescription:
      'A custom design direction — we research your industry and propose a design system that is yours alone. Bespoke motion, typography hand-picked, not a template that works.',
    extras: [
      { text: 'Multilingual engine (DE + EN baseline)' },
      { text: 'E-commerce ready (Stripe / Stripe Connect)' },
      { text: 'Custom integrations (booking, CRM, calendars, APIs)' },
      { text: '2 revision rounds (Business has 1)' },
      { text: 'Full copywriting assistance' },
      { text: 'Custom photography direction' },
      { text: 'Retainer option for ongoing work' },
      { text: 'Discovery + strategy phase before build' },
    ],
    reference: {
      client: 'Veloscout',
      sector: 'Swiss cycling marketplace',
      note: 'Supabase auth + Stripe Connect escrow, preview gate, listings CRUD, transactional email, cron payout webhook, Pro-Shop industrial design.',
      href: 'https://www.veloscout.ch',
      image: '/work/veloscout.png',
      external: true,
    },
  },
]

function DetailBlock({ pkg, index }: { pkg: Package; index: number }) {
  const isFirst = index === 0

  return (
    <article
      id={`package-${pkg.id}`}
      className={`scroll-mt-28 py-20 md:py-28 ${isFirst ? '' : 'border-t border-[color:var(--border-subtle)]'}`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Identity band */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <h2 className="display text-5xl md:text-6xl lg:text-7xl text-[color:var(--ink)] leading-[1.0]">
              {pkg.name}
            </h2>
            {pkg.isHighlight && (
              <p className="mt-3 text-base md:text-lg text-[color:var(--ink-muted)]">
                — most picked
              </p>
            )}
            <p className="mt-8 text-xl md:text-2xl text-[color:var(--ink-muted)] leading-[1.5] max-w-2xl">
              {pkg.bestForLong}
            </p>
          </div>

          <div className="lg:col-span-5 lg:pl-10 lg:border-l border-[color:var(--border-subtle)] flex flex-col justify-center">
            <p
              className="display text-4xl md:text-5xl text-[color:var(--ink)]"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {pkg.price}
            </p>
            <p className="mt-4 text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
              {pkg.delivery} · {pkg.revisions}
            </p>
            <p className="mt-1 text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
              {pkg.bestFor}
            </p>

            <Link
              href={`/contact/start?package=${pkg.id}`}
              className="mt-10 btn btn-primary w-full justify-between"
            >
              Start {pkg.name} brief
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* What's in it */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-16 md:mb-20">
          <p className="lg:col-span-5 text-lg md:text-xl text-[color:var(--ink-muted)] leading-[1.6]">
            {pkg.designDescription}
          </p>

          <div className="lg:col-span-7 lg:border-l lg:pl-10 border-[color:var(--border-subtle)]">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
              {pkg.pages.map((p) => (
                <li key={p.name}>
                  <p className="text-lg md:text-xl text-[color:var(--ink)]">{p.name}</p>
                  <p className="mt-1 text-sm md:text-base text-[color:var(--ink-muted)] leading-relaxed">
                    {p.description}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm md:text-base text-[color:var(--ink-muted)]">
              {pkg.pageNote}
            </p>

            {pkg.extras && pkg.extras.length > 0 && (
              <ul className="mt-10 pt-10 border-t border-[color:var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
                {pkg.extras.map((e) => (
                  <li
                    key={e.text}
                    className="text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed"
                  >
                    {e.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Live reference */}
        {pkg.reference && (
          <div className="border-t border-[color:var(--border-subtle)] pt-16 md:pt-20">
            <a
              href={pkg.reference.href}
              target={pkg.reference.external ? '_blank' : undefined}
              rel={pkg.reference.external ? 'noopener noreferrer' : undefined}
              className="group block"
            >
              {pkg.reference.image && (
                <div className="relative aspect-[16/9] mb-8 overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)]">
                  <Image
                    src={pkg.reference.image}
                    alt={pkg.reference.client}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 flex-1">
                  <p className="display text-2xl md:text-3xl text-[color:var(--ink)] leading-tight">
                    {pkg.reference.client}
                  </p>
                  <p className="mt-2 text-base md:text-lg text-[color:var(--ink-muted)]">
                    {pkg.reference.sector}
                  </p>
                  <p className="mt-4 text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed max-w-2xl">
                    {pkg.reference.note}
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
      {packages.map((pkg, i) => (
        <DetailBlock key={pkg.id} pkg={pkg} index={i} />
      ))}
    </section>
  )
}
