import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface CTABannerProps {
  headline?: React.ReactNode
  subtext?: string
}

export default function CTABanner({ headline, subtext }: CTABannerProps) {
  return (
    <section className="relative w-full py-28 md:py-40 border-t border-[color:var(--border-subtle)] overflow-hidden">
      <div aria-hidden className="absolute inset-0 gradient-mesh-subtle" />
      <div aria-hidden className="grid-noise" />

      <div className="relative mx-auto max-w-4xl px-6 sm:px-10 lg:px-16 text-center">
        <p className="eyebrow mb-8">Ready when you are</p>
        <h2 className="display text-[clamp(2.4rem,5.4vw,4.6rem)] leading-[1.02]">
          {headline ? (
            headline
          ) : (
            <>
              Let’s build something{' '}
              <span className="serif-italic text-[color:var(--accent)]">worth keeping.</span>
            </>
          )}
        </h2>
        <p className="mt-8 md:mt-10 measure mx-auto text-base md:text-lg text-[color:var(--ink-muted)] leading-relaxed">
          {subtext ?? "Fill out our brief — we'll get back within 24 hours with a written proposal."}
        </p>
        <div className="mt-10 flex items-center justify-center gap-3 flex-wrap">
          <Link href="/contact/start" className="btn btn-primary">
            Start your project
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/services" className="btn btn-ghost">
            Browse packages
          </Link>
        </div>
      </div>
    </section>
  )
}
