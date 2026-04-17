import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface Page {
  name: string
  description: string
}

interface IncludedExtra {
  text: string
}

interface ProcessStep {
  n: string
  label: string
}

interface Reference {
  client: string
  sector: string
  note: string
  href: string
  image?: string
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
  design: {
    label: string
    description: string
  }
  extras?: IncludedExtra[]
  notIncluded: string[]
  process: ProcessStep[]
  reference?: Reference
  isHighlight?: boolean
}

const packages: Package[] = [
  {
    id: 'starter',
    chapter: 'II',
    name: 'Starter',
    price: 'CHF 1,500',
    delivery: '3–5 business days',
    revisions: '1 round',
    bestFor: 'Freelancers · Landing pages · New ventures',
    bestForLong:
      'A focused brochure site that converts — one well-crafted funnel, nothing that looks cheap, nothing you don’t need.',
    pages: [
      { name: 'Home', description: 'Hero · services snapshot · contact prompt' },
      { name: 'About', description: 'Story · approach · why you' },
      { name: 'Services', description: 'What you offer, one clear block each' },
      { name: 'Contact', description: 'Form · email · location · legal' },
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
    chapter: 'III',
    name: 'Business',
    price: 'CHF 3,500',
    delivery: '5–7 business days',
    revisions: '1 round',
    bestFor: 'KMU · Clinics · Studios · Agencies',
    bestForLong:
      'The sweet spot for most Swiss SMEs. A real brand system, editable content, SEO that ranks, animation that carries meaning — not decoration.',
    pages: [
      { name: 'Home', description: 'Hero · services · proof · team · contact' },
      { name: 'About', description: 'Story · values · team' },
      { name: 'Services', description: 'Detailed offering with sub-services' },
      { name: 'Team', description: 'CMS-managed bios + photos' },
      { name: 'Blog / News', description: 'CMS-managed, SEO-ready' },
      { name: 'Contact', description: 'Form · email · map · legal' },
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
    chapter: 'IV',
    name: 'Pro',
    price: 'From CHF 7,500',
    delivery: 'Scoped per project',
    revisions: '2 rounds',
    bestFor: 'Larger SMEs · E-commerce · Multilingual · Integrations',
    bestForLong:
      'When off-the-shelf stops scaling. Custom design direction, multi-language, real integrations (Supabase, Stripe, booking, CRM), production e-commerce, retainer-ready.',
    pages: [
      { name: 'Custom page count', description: 'No artificial cap' },
      { name: 'Multilingual', description: 'DE + EN standard, more as add-on' },
      { name: 'Product / booking', description: 'Stripe · calendar · reservations' },
      { name: 'Protected areas', description: 'Member logins, dashboards, admin' },
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
      image: '/work/core-medical.jpg', // placeholder; no veloscout image yet
      external: true,
    },
  },
]

function DetailBlock({ pkg, index }: { pkg: Package; index: number }) {
  const accent = pkg.isHighlight
  const isFirst = index === 0

  return (
    <article
      id={`package-${pkg.id}`}
      className={`scroll-mt-24 py-16 md:py-24 ${
        isFirst ? '' : 'border-t border-border-default'
      }`}
    >
      {/* Chapter masthead */}
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 mb-10 md:mb-14">
        <div className="flex items-baseline gap-4">
          <span
            className={`font-[family-name:var(--font-display)] italic text-5xl md:text-6xl lg:text-7xl leading-none ${
              accent ? 'text-[#C8956C]' : 'text-text-primary/30'
            }`}
          >
            {pkg.chapter}
          </span>
          <span className="flex-1 h-px bg-border-subtle" aria-hidden />
          <span
            className={`font-mono text-[11px] tracking-[0.3em] uppercase ${
              accent ? 'text-[#C8956C]' : 'text-text-muted'
            }`}
          >
            {accent ? 'Most popular' : `Tier · ${pkg.id}`}
          </span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 lg:items-start">
          {/* LEFT — identity + price + CTA. Natural flow: sticky created a
              ~1250px "hanging" window where the left column froze while the
              right column scrolled past, which felt like the page was stuck. */}
          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-light text-text-primary tracking-[-0.03em] leading-[0.95]">
              {pkg.name}
            </h2>

            <p className="text-lg md:text-xl text-text-secondary leading-[1.45] font-light max-w-sm">
              {pkg.bestForLong}
            </p>

            {/* Price panel — editorial ledger */}
            <div className="border-t border-b border-border-default py-6 space-y-4">
              <div>
                <p className="font-mono text-[10px] text-text-muted tracking-[0.3em] uppercase mb-1.5">
                  Investment
                </p>
                <p className="text-4xl md:text-5xl font-light text-text-primary tracking-[-0.025em]">
                  {pkg.price}
                </p>
              </div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 text-sm border-t border-border-subtle pt-4">
                <dt className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase self-center">
                  Delivery
                </dt>
                <dd className="text-text-secondary text-sm">{pkg.delivery}</dd>
                <dt className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase self-center">
                  Revisions
                </dt>
                <dd className="text-text-secondary text-sm">{pkg.revisions}</dd>
                <dt className="font-mono text-[10px] text-text-muted tracking-[0.2em] uppercase self-center">
                  Best for
                </dt>
                <dd className="text-text-secondary text-sm leading-snug">
                  {pkg.bestFor}
                </dd>
              </dl>
            </div>

            {/* CTA */}
            <Link
              href={`/contact/start?package=${pkg.id}`}
              className={`group inline-flex w-full items-center justify-between gap-3 px-6 py-5 transition-all duration-200 ${
                accent
                  ? 'bg-accent-blue text-white hover:bg-accent-blue-hover'
                  : 'bg-text-primary text-background-primary hover:bg-text-primary/90'
              }`}
            >
              <span className="text-sm font-medium tracking-wide">
                Start {pkg.name} brief
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* RIGHT — detail */}
          <div className="lg:col-span-8 space-y-14">
            {/* Typical pages */}
            <ScrollReveal>
              <div>
                <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-6">
                  Typical pages
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                  {pkg.pages.map((p, i) => (
                    <li
                      key={p.name}
                      className="flex items-baseline gap-4 py-4 border-t border-border-subtle"
                    >
                      <span className="font-mono text-[11px] text-text-muted tabular-nums shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-base md:text-lg text-text-primary font-medium">
                          {p.name}
                        </p>
                        <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-text-muted italic">
                  {pkg.pageNote}
                </p>
              </div>
            </ScrollReveal>

            {/* Design level */}
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-10 border-t border-border-subtle pt-10">
                <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase">
                  Design level
                </p>
                <div>
                  <p className="text-xl md:text-2xl font-light text-text-primary tracking-[-0.01em] mb-3">
                    <span className="font-[family-name:var(--font-display)] italic text-[#C8956C]">
                      {pkg.design.label}
                    </span>
                  </p>
                  <p className="text-base text-text-secondary leading-[1.65] max-w-2xl">
                    {pkg.design.description}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Beyond previous tier */}
            {pkg.extras && pkg.extras.length > 0 && (
              <ScrollReveal>
                <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-10 border-t border-border-subtle pt-10">
                  <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase">
                    {pkg.id === 'pro' ? 'Beyond Business' : 'Beyond Starter'}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                    {pkg.extras.map((e) => (
                      <li
                        key={e.text}
                        className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed"
                      >
                        <span
                          className="mt-2 inline-block w-3 h-[1px] bg-[#C8956C] shrink-0"
                          aria-hidden
                        />
                        <span>{e.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            )}

            {/* Not included */}
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-10 border-t border-border-subtle pt-10">
                <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase">
                  Not included
                </p>
                <ul className="space-y-2.5">
                  {pkg.notIncluded.map((n) => (
                    <li
                      key={n}
                      className="flex items-start gap-3 text-sm text-text-muted leading-relaxed"
                    >
                      <span
                        className="mt-2 inline-block w-2 h-[1px] bg-text-muted/60 shrink-0"
                        aria-hidden
                      />
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>

            {/* Process */}
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-4 md:gap-10 border-t border-border-subtle pt-10">
                <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase">
                  Process
                </p>
                <div className="flex flex-wrap items-baseline gap-x-5 gap-y-3">
                  {pkg.process.map((step, i) => (
                    <React.Fragment key={step.n}>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono text-[11px] text-[#C8956C] tabular-nums">
                          {step.n}
                        </span>
                        <span className="text-sm md:text-base text-text-primary">
                          {step.label}
                        </span>
                      </div>
                      {i < pkg.process.length - 1 && (
                        <span
                          className="text-text-muted/40 text-xs"
                          aria-hidden
                        >
                          →
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Live reference — with image */}
            {pkg.reference && (
              <ScrollReveal>
                <div className="border-t border-border-subtle pt-10">
                  <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-6">
                    Live reference · In production
                  </p>
                  <a
                    href={pkg.reference.href}
                    target={pkg.reference.external ? '_blank' : undefined}
                    rel={
                      pkg.reference.external
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="group block"
                  >
                    {pkg.reference.image && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-background-elevated mb-5 border border-border-default">
                        <Image
                          src={pkg.reference.image}
                          alt={pkg.reference.client}
                          fill
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.03]"
                        />
                        {/* Corner tick */}
                        <span
                          className="absolute top-0 right-0 w-8 h-[2px] bg-[#C8956C] origin-right scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                          aria-hidden
                        />
                        <span
                          className="absolute top-0 right-0 h-8 w-[2px] bg-[#C8956C] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
                          aria-hidden
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-6">
                      <div className="min-w-0 flex-1">
                        <p className="text-2xl md:text-3xl font-light text-text-primary tracking-[-0.02em] leading-tight">
                          {pkg.reference.client}
                        </p>
                        <p className="mt-1 font-mono text-[11px] md:text-xs text-text-muted tracking-[0.15em] uppercase">
                          {pkg.reference.sector}
                        </p>
                        <p className="mt-4 text-sm md:text-base text-text-secondary leading-relaxed max-w-xl">
                          {pkg.reference.note}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-text-primary shrink-0">
                        <span className="text-xs md:text-sm font-mono uppercase tracking-wider transition-transform duration-200 group-hover:-translate-y-0.5">
                          Visit
                        </span>
                        <ArrowUpRight
                          className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={1.25}
                        />
                      </div>
                    </div>
                  </a>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function PackageDetail() {
  return (
    <section
      id="package-detail"
      className="w-full bg-background-primary"
    >
      {packages.map((pkg, i) => (
        <DetailBlock key={pkg.id} pkg={pkg} index={i} />
      ))}
    </section>
  )
}
