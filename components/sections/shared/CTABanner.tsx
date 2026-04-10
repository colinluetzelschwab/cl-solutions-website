'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface CTABannerProps {
  headline?: string
  subtext?: string
  buttonText?: string
  buttonHref?: string
}

export default function CTABanner({
  headline = "Let's build something great.",
  subtext = "Fill out our brief — we'll get back to you within 24 hours with a proposal.",
  buttonText = 'Start Your Project',
  buttonHref = '/contact',
}: CTABannerProps) {
  return (
    <section className="w-full bg-background-surface py-20 md:py-28 lg:py-32 relative overflow-hidden">
      {/* Subtle radial glow behind content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-accent-blue/[0.04] rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <ScrollReveal>
          <p className="text-[11px] md:text-xs text-accent-blue uppercase tracking-[0.25em] mb-5">
            Let&apos;s talk
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary mb-4 md:mb-6 tracking-[-0.02em]">
            {headline}
          </h2>
          <p className="text-lg md:text-xl text-text-secondary mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed">
            {subtext}
          </p>
          <Link href={buttonHref}>
            <Button
              size="lg"
              className="bg-accent-blue text-text-primary hover:bg-accent-blue-hover font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none transition-all duration-300 glow-pulse group"
            >
              {buttonText}
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
