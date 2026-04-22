import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight, Minus } from 'lucide-react'

interface Page { name: string; description: string }
interface IncludedExtra { text: string }
interface ProcessStep { n: string; label: string }
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
  chapter: string
  name: string
  price: string
  delivery: string
  revisions: string
  bestFor: string
  bestForLong: string
  pages: Page[]
  pageNote: string
  design: { label: string; description: string }
  extras?: IncludedExtra[]
  notIncluded: string[]
  process: ProcessStep[]
  reference?: Reference
  isHighlight?: boolean
}

const packages: Package[] = [
  {
    id: 'starter',
    chapter: 'I',
    name: 'Starter',
    price: 'CHF 1,500',
    delivery: '3–5 business days',
    revisions: '1 round',
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
    design: {
      label: 'Light brand system',
      description:
        'Deliberate palette (2–3 tones), one display + one body font, spacing scale, mobile-first. Clean, modular — not templated.',
    },
    notIncluded: [
      'Content management (CMS) — copy edits go through us',
      'Scroll animations beyond subtle fades',
      'Multilingual (DE + EN)',
      'Third-party integrations',
    ],
    process: [
      { n: '01', label: 'Brief' },
      { n: '02', label: 'Design' },
      { n: '03', label: 'Build' },
      { n: '04', label: 'Review' },
      { n: '05', label: 'Launch' },
    ],
  },
  {
    id: 'business',
    chapter: 'II',
    name: 'Business',
    price: 'CHF 3,500',
    delivery: '5–7 business days',
    revisions: '1 round',
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
    design: {
      label: 'Full brand system',
      description:
        'Custom palette, type-pairing, spacing and motion tokens. Scroll-driven reveals and micro-interactions that match the industry — medical feels different from gastronomy feels different from architecture.',
    },
    extras: [
      { text: 'Sanity CMS — edit text, images, team, blog' },
      { text: 'Scroll animations + micro-interactions' },
      { text: 'Structured data (JSON-LD) for rich results' },
      { text: 'Open Graph + Twitter cards on every page' },
      { text: 'Privacy-friendly analytics dashboard' },
      { text: 'Partial copywriting assistance' },
      { text: 'Lighthouse 90+ guarantee' },
    ],
    notIncluded: [
      'Multilingual (add CHF 400–800)',
      'E-commerce / product pages',
      'Custom integrations beyond standard (booking, CRM)',
    ],
    process: [
      { n: '01', label: 'Brief' },
      { n: '02', label: 'Design' },
      { n: '03', label: 'Build' },
      { n: '04', label: 'CMS' },
      { n: '05', label: 'Review' },
      { n: '06', label: 'Launch' },
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
    chapter: 'III',
    name: 'Pro',
    price: 'From CHF 7,500',
    delivery: 'Scoped per project',
    revisions: '2 rounds',
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
    design: {
      label: 'Custom design direction',
      description:
        'We research your industry and propose a design system that is yours alone. Custom illustration and photography direction, bespoke motion, typography hand-picked — not a template that works.',
    },
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
    notIncluded: [
      'Photoshoots (we direct; external photographer bills separately)',
      'Legal counsel (we wire cookie banners; you confirm wording)',
      'Paid ads / SEA management',
    ],
    process: [
      { n: '01', label: 'Discovery' },
      { n: '02', label: 'Strategy' },
      { n: '03', label: 'Design' },
      { n: '04', label: 'Build' },
      { n: '05', label: 'Content' },
      { n: '06', label: 'Integrations' },
      { n: '07', label: 'Review' },
      { n: '08', label: 'Launch' },
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-10 border-t border-[color:var(--border-subtle)] pt-10">
      <p className="eyebrow">{label}</p>
      <div>{children}</div>
    </div>
  )
}

function DetailBlock({ pkg, index }: { pkg: Package; index: number }) {
  const accent = pkg.isHighlight
  const isFirst = index === 0

  return (
    <article
      id={`package-${pkg.id}`}
      className={`scroll-mt-28 py-14 md:py-20 ${isFirst ? '' : 'border-t border-[color:var(--border-subtle)]'}`}
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Chapter masthead */}
        <div className="mb-10 md:mb-14 flex items-baseline gap-5">
          <span
            className={`serif-italic text-5xl md:text-6xl lg:text-7xl leading-none ${
              accent ? 'text-[color:var(--accent)]' : 'text-[color:var(--ink-faint)]/70'
            }`}
          >
            {pkg.chapter}
          </span>
          <span className="flex-1 divider-gradient" aria-hidden />
          <span className={`eyebrow ${accent ? 'text-[color:var(--accent)]' : ''}`}>
            {accent ? 'Most picked' : `Tier · ${pkg.id}`}
          </span>
        </div>

        {/* Identity band — editorial two-col */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h2 className="display text-5xl md:text-6xl lg:text-7xl text-[color:var(--ink)]">
              {pkg.name}
            </h2>
            <p className="mt-6 md:mt-8 text-lg md:text-xl text-[color:var(--ink-muted)] leading-[1.5] max-w-xl">
              {pkg.bestForLong}
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="border-y border-[color:var(--border-default)] py-6">
              <p className="eyebrow mb-2">Investment</p>
              <p className="display text-4xl md:text-5xl text-[color:var(--ink)]">
                {pkg.price}
              </p>

              <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-sm border-t border-[color:var(--border-subtle)] pt-5">
                <dt className="eyebrow self-center">Delivery</dt>
                <dd className="text-[color:var(--ink-muted)]">{pkg.delivery}</dd>
                <dt className="eyebrow self-center">Revisions</dt>
                <dd className="text-[color:var(--ink-muted)]">{pkg.revisions}</dd>
                <dt className="eyebrow self-center">Best for</dt>
                <dd className="text-[color:var(--ink-muted)] leading-snug">{pkg.bestFor}</dd>
              </dl>
            </div>

            <Link
              href={`/contact/start?package=${pkg.id}`}
              className="mt-7 btn btn-primary w-full justify-between"
            >
              Start {pkg.name} brief
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="space-y-10 md:space-y-12">
          <Row label="Typical pages">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {pkg.pages.map((p, i) => (
                <li key={p.name} className="flex items-baseline gap-4 py-4 border-t border-[color:var(--border-subtle)]">
                  <span className="eyebrow !tracking-[0.18em] text-[color:var(--accent)] tabular shrink-0 mt-0.5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-base md:text-lg text-[color:var(--ink)] font-medium">{p.name}</p>
                    <p className="text-sm text-[color:var(--ink-muted)] mt-1 leading-relaxed">{p.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-[color:var(--ink-faint)] italic">{pkg.pageNote}</p>
          </Row>

          <Row label="Design level">
            <p className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">
              <span className="serif-italic text-[color:var(--accent)]">{pkg.design.label}</span>
            </p>
            <p className="text-base text-[color:var(--ink-muted)] leading-[1.65] measure">
              {pkg.design.description}
            </p>
          </Row>

          {pkg.extras && pkg.extras.length > 0 && (
            <Row label={pkg.id === 'pro' ? 'Beyond Business' : 'Beyond Starter'}>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {pkg.extras.map((e) => (
                  <li key={e.text} className="flex items-start gap-3 text-sm text-[color:var(--ink-muted)] leading-relaxed">
                    <span className="mt-2 inline-block w-3 h-[2px] bg-[color:var(--accent)] shrink-0" aria-hidden />
                    <span>{e.text}</span>
                  </li>
                ))}
              </ul>
            </Row>
          )}

          <Row label="Not included">
            <ul className="space-y-2.5">
              {pkg.notIncluded.map((n) => (
                <li key={n} className="flex items-start gap-3 text-sm text-[color:var(--ink-faint)] leading-relaxed">
                  <Minus className="mt-1 h-3 w-3 text-[color:var(--ink-faint)]/60 shrink-0" aria-hidden />
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </Row>

          <Row label="Process">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              {pkg.process.map((step, i) => (
                <React.Fragment key={step.n}>
                  <div className="flex items-baseline gap-2">
                    <span className="eyebrow !tracking-[0.18em] text-[color:var(--accent)] tabular">{step.n}</span>
                    <span className="text-sm md:text-base text-[color:var(--ink)]">{step.label}</span>
                  </div>
                  {i < pkg.process.length - 1 && (
                    <span className="text-[color:var(--ink-faint)]/40 text-xs" aria-hidden>→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </Row>

          {pkg.reference && (
            <Row label="Live reference">
              <a
                href={pkg.reference.href}
                target={pkg.reference.external ? '_blank' : undefined}
                rel={pkg.reference.external ? 'noopener noreferrer' : undefined}
                className="group block"
              >
                {pkg.reference.image && (
                  <div className={`${pkg.reference.imageSwap ? 'dual-img ' : ''}relative aspect-[16/9] mb-6 overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)]`}>
                    <Image
                      src={pkg.reference.image}
                      alt={pkg.reference.client}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className={`${pkg.reference.imageSwap ? 'dual-img__base ' : ''}object-cover`}
                    />
                    {pkg.reference.imageSwap && (
                      <Image
                        src={pkg.reference.imageSwap}
                        alt=""
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="dual-img__swap object-cover"
                        aria-hidden
                        loading="lazy"
                      />
                    )}
                  </div>
                )}
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0 flex-1">
                    <p className="display text-2xl md:text-3xl text-[color:var(--ink)] leading-tight">{pkg.reference.client}</p>
                    <p className="mt-1 eyebrow">{pkg.reference.sector}</p>
                    <p className="mt-4 text-sm md:text-base text-[color:var(--ink-muted)] leading-relaxed max-w-xl">
                      {pkg.reference.note}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[color:var(--ink)] shrink-0 pt-2">
                    <span className="eyebrow group-hover:text-[color:var(--accent)] transition-colors">Visit</span>
                    <ArrowUpRight className="h-5 w-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.5} />
                  </div>
                </div>
              </a>
            </Row>
          )}
        </div>
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
