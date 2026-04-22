import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

// Testimonial — quiet confidence. Left: quote block with hanging mono opener.
// Right: 3-row stats ledger with tabular numbers and micro-rules between rows.

const stats = [
  { value: '3–5',   label: 'day delivery',   sub: 'average ship time' },
  { value: '100%',  label: 'fixed scope',    sub: 'no open-ended bills' },
  { value: '24 h',  label: 'reply window',   sub: 'first written proposal' },
]

export default function SocialProof() {
  return (
    <section className="relative w-full py-28 md:py-40 border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-14 lg:gap-24 items-start">
          {/* Testimonial */}
          <div className="relative">
            <blockquote className="display text-[clamp(1.7rem,3vw,2.6rem)] leading-[1.22] text-[color:var(--ink)] max-w-[32ch] pl-0">
              A premium website that actually feels like our practice —
              delivered in a week, with a{' '}
              <span className="serif-italic text-[color:var(--ink-soft)]">
                CMS we can run ourselves.
              </span>
            </blockquote>

            <figure className="mt-12 flex items-center gap-5">
              <div className="relative h-14 w-14 shrink-0 rounded-full overflow-hidden border border-[color:var(--border-default)] bg-[color:var(--surface-2)]">
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
              className="mt-10 inline-flex items-center gap-1.5 text-sm text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors group link-ghost"
            >
              See the case study
              <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Stats ledger */}
          <div className="lg:pt-3">
            <ul className="flex flex-col">
              {stats.map((s, i) => (
                <li
                  key={s.label}
                  className={`group grid grid-cols-[auto_1fr] items-baseline gap-6 py-7 ${
                    i < stats.length - 1
                      ? 'border-b border-[color:var(--border-subtle)]'
                      : ''
                  } transition-colors`}
                >
                  <div>
                    <p className="display text-[clamp(2.2rem,3.4vw,3.2rem)] leading-none text-[color:var(--ink)] tabular">
                      {s.value}
                    </p>
                    <p className="eyebrow mt-3">{s.sub}</p>
                  </div>
                  <p className="text-right text-[11px] font-[var(--font-plex-mono)] uppercase tracking-[0.22em] text-[color:var(--ink-muted)] self-end pb-1">
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
