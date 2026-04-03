'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface CTABannerProps {
  headline?: string
  subtext?: string
  buttonText?: string
  buttonHref?: string
}

export default function CTABanner({
  headline = 'Ready to get started?',
  subtext = "Tell us about your business. We'll send a proposal within 48 hours.",
  buttonText = 'Get a Quote',
  buttonHref = '/contact',
}: CTABannerProps) {
  return (
    <section className="w-full bg-background-surface py-20 md:py-28 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary mb-4 md:mb-6">
            {headline}
          </h2>
          <p className="text-lg md:text-xl text-text-secondary mb-8 md:mb-10 max-w-2xl mx-auto">
            {subtext}
          </p>
          <Link href={buttonHref}>
            <Button
              size="lg"
              className="bg-accent-blue text-text-primary hover:bg-accent-blue-hover font-medium px-8 h-12 md:h-14 text-base md:text-lg rounded-none transition-all duration-200"
              style={{
                boxShadow: '0 0 60px rgba(65, 105, 255, 0.25)',
              }}
            >
              {buttonText}
            </Button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
