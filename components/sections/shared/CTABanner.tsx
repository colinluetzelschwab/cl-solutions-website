'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface CTABannerProps {
  headline?: string
  subtext?: string
}

export default function CTABanner({ headline, subtext }: CTABannerProps) {
  return (
    <section className="w-full bg-background-primary py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <ScrollReveal>
          <p className="text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-4">Ready?</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-text-primary tracking-[-0.02em] leading-[1.05] mb-6 md:mb-8">
            {headline ? headline : (<>Let&apos;s build something<br /><span className="font-[family-name:var(--font-display)] italic text-[#C8956C]">great.</span></>)}
          </h2>
          <p className="text-base md:text-lg text-text-secondary max-w-md leading-relaxed mb-10 md:mb-14">
            {subtext ?? "Fill out our brief — we'll get back to you within 24 hours with a proposal."}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium bg-text-primary text-background-primary hover:bg-text-primary/90 transition-colors group"
          >
            Start your project
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
