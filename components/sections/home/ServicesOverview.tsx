'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal'

const packages = [
  {
    name: 'Starter',
    price: '1,500',
    description: 'A clean, fast website that gets straight to the point.',
    features: ['Up to 4 pages', 'Mobile-optimized', '1 revision round', '3–5 day delivery'],
  },
  {
    name: 'Business',
    price: '3,500',
    description: 'The full package — design, content management, animations, SEO.',
    features: ['Up to 6 pages', 'CMS included', 'Custom animations', 'SEO optimized'],
    popular: true,
  },
  {
    name: 'Pro',
    price: '7,500+',
    description: 'Custom scope for businesses that need more.',
    features: ['Custom page count', 'Multilingual', 'E-commerce ready', 'Retainer option'],
  },
]

export default function ServicesOverview() {
  return (
    <section className="w-full bg-background-primary py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <ScrollReveal className="mb-16 md:mb-24">
          <p className="text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-4">Packages</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary tracking-[-0.02em] leading-[1.1]">
            Three options.
            <br />
            <span className="font-[family-name:var(--font-display)] italic text-text-secondary">Zero surprises.</span>
          </h2>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border-subtle" staggerDelay={0.1}>
          {packages.map((pkg) => (
            <StaggerItem key={pkg.name}>
              <div className="bg-background-primary p-8 lg:p-10 flex flex-col h-full group">
                {pkg.popular && (
                  <span className="text-[9px] tracking-[0.2em] uppercase text-[#C8956C] font-medium mb-4">Most popular</span>
                )}
                {!pkg.popular && <div className="mb-4" />}

                <p className="text-[10px] text-text-muted tracking-[0.2em] uppercase mb-3">{pkg.name}</p>

                <p className="text-3xl md:text-4xl font-light text-text-primary tracking-tight mb-4">
                  CHF {pkg.price}
                </p>

                <p className="text-sm text-text-secondary leading-relaxed mb-8">{pkg.description}</p>

                <div className="h-px bg-border-subtle mb-6" />

                <div className="space-y-2.5 mb-8 flex-1">
                  {pkg.features.map((f) => (
                    <p key={f} className="text-sm text-text-secondary flex items-center gap-2.5">
                      <span className="w-1 h-1 bg-text-muted rounded-full shrink-0" />
                      {f}
                    </p>
                  ))}
                </div>

                <Link
                  href="/contact"
                  className="inline-flex items-center text-sm text-text-muted hover:text-text-primary transition-colors group/link"
                >
                  Get started
                  <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
