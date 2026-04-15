'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/scroll-reveal'

const stats = [
  { value: '3–5', label: 'day delivery' },
  { value: '100%', label: 'fixed scope' },
  { value: 'CH', label: 'built in Switzerland' },
]

export default function SocialProof() {
  return (
    <section className="w-full bg-background-primary py-28 md:py-40 border-t border-border-subtle">
      <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 lg:gap-24 items-start">
          <ScrollReveal>
            <p className="text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-8">
              Recent work
            </p>
            <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light text-text-primary leading-[1.3] tracking-[-0.01em]">
              <span className="font-[family-name:var(--font-display)] italic text-text-secondary">
                &ldquo;
              </span>
              A premium website that actually feels like our practice &mdash;
              delivered in a week, with a CMS we can run ourselves.
              <span className="font-[family-name:var(--font-display)] italic text-text-secondary">
                &rdquo;
              </span>
            </blockquote>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-border-subtle max-w-[60px]" />
              <div>
                <p className="text-sm text-text-primary font-medium">Kreetta L&uuml;tzelschwab</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Founder, Core Medical &mdash; Zurich
                </p>
              </div>
            </div>

            <Link
              href="/work"
              className="mt-10 inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors group"
            >
              See the case study
              <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </ScrollReveal>

          <ScrollReveal className="lg:pt-4">
            <div className="space-y-6">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-baseline justify-between pb-5 border-b border-border-subtle"
                >
                  <span className="text-3xl md:text-4xl font-light text-text-primary tracking-[-0.02em]">
                    {s.value}
                  </span>
                  <span className="text-xs text-text-muted uppercase tracking-[0.2em]">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
