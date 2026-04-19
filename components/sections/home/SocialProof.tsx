import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

// Editorial testimonial — Tom Carder pattern (real headshot + cinematic quote card)
// plus stats rail on the right.

const stats = [
  { value: '3–5',  label: 'day delivery',  sub: 'average ship time' },
  { value: '100%', label: 'fixed scope',   sub: 'no open-ended bills' },
  { value: 'CH',   label: 'Swiss-built',   sub: 'Zurich studio' },
]

export default function SocialProof() {
  return (
    <section className="relative w-full py-28 md:py-40">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-14 lg:gap-20 items-start">
          {/* Editorial testimonial */}
          <div>
            <p className="eyebrow mb-8">Recent work · Core Medical</p>

            <blockquote className="display text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.3] text-[color:var(--ink)] max-w-[28ch]">
              <span className="serif-italic text-[color:var(--accent)]">“A premium website</span>{' '}
              that actually feels like our practice — delivered in a week, with a{' '}
              <span className="serif-italic">CMS we can run ourselves.”</span>
            </blockquote>

            <figure className="mt-10 flex items-center gap-5">
              <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)]">
                <Image
                  src="/work/core-medical.jpg"
                  alt="Kreetta Lützelschwab portrait"
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <figcaption>
                <p className="text-[15px] text-[color:var(--ink)] font-medium">
                  Kreetta Lützelschwab
                </p>
                <p className="eyebrow mt-1">Founder · Core Medical · Zurich</p>
              </figcaption>
            </figure>

            <Link
              href="/work"
              className="mt-10 inline-flex items-center gap-1.5 text-sm text-[color:var(--ink-muted)] hover:text-[color:var(--accent)] transition-colors group"
            >
              See the case study
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Stats rail — ledger-style, no cards */}
          <div className="lg:pt-3">
            <ul className="flex flex-col">
              {stats.map((s, i) => (
                <li
                  key={s.label}
                  className={`flex items-baseline justify-between gap-4 py-6 ${
                    i < stats.length - 1 ? 'border-b border-[color:var(--border-subtle)]' : ''
                  }`}
                >
                  <div>
                    <p className="display text-[clamp(2rem,3vw,2.8rem)] leading-none text-[color:var(--ink)] tabular">
                      {s.value}
                    </p>
                    <p className="eyebrow mt-3">{s.sub}</p>
                  </div>
                  <p className="text-[11px] text-[color:var(--ink-muted)] uppercase tracking-[0.22em] text-right">
                    {s.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
