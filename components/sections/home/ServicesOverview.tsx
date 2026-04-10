'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal'

interface ServicePackage {
  name: string
  price: string
  description: string
  features: string[]
  isPopular?: boolean
}

const packages: ServicePackage[] = [
  {
    name: 'Starter',
    price: 'CHF 1,500',
    description: 'A clean, fast website that gets straight to the point.',
    features: ['4 pages', '1 revision round', '3–5 day delivery'],
  },
  {
    name: 'Business',
    price: 'CHF 3,500',
    description: 'The full package — design, CMS, animations, SEO.',
    features: ['6 pages', 'CMS included', 'Custom animations'],
    isPopular: true,
  },
  {
    name: 'Pro',
    price: 'From CHF 7,500',
    description: 'Custom scope for businesses that need more.',
    features: ['Custom scope', 'Multilingual', 'Retainer option'],
  },
]

export default function ServicesOverview() {
  return (
    <section className="w-full bg-background-primary py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-14 md:mb-20">
          <p className="text-[11px] md:text-xs text-accent-blue uppercase tracking-[0.25em] mb-4">
            What we offer
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary tracking-[-0.02em]">
            Three packages. Zero surprises.
          </h2>
        </ScrollReveal>

        {/* Cards Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
          staggerDelay={0.15}
        >
          {packages.map((pkg) => (
            <StaggerItem key={pkg.name}>
              <div
                className={`relative bg-background-surface border transition-all duration-400 p-7 lg:p-9 flex flex-col h-full group ${
                  pkg.isPopular
                    ? 'border-accent-blue/40 hover:border-accent-blue/70 hover:shadow-[0_0_60px_rgba(65,105,255,0.12)] border-t-2 border-t-accent-blue'
                    : 'border-border-default hover:border-border-subtle card-glow'
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-6">
                    <span className="bg-accent-blue text-white text-[10px] font-semibold px-3 py-1 uppercase tracking-[0.15em]">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Package Name */}
                <p className="text-xs text-text-muted uppercase tracking-[0.15em] mb-2">
                  {pkg.name}
                </p>

                {/* Price */}
                <p className="text-4xl md:text-5xl font-semibold text-text-primary mb-1 tracking-[-0.02em]">
                  {pkg.price}
                </p>

                {/* Description */}
                <p className="text-text-secondary text-sm leading-relaxed mb-8 mt-3 flex-grow">
                  {pkg.description}
                </p>

                {/* Divider */}
                <div className="h-px bg-border-subtle mb-6" />

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {pkg.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center text-text-secondary text-sm"
                    >
                      <span className="w-1 h-1 bg-accent-blue mr-3 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Link */}
                <Link
                  href="/services"
                  className="inline-flex items-center text-sm text-text-muted hover:text-accent-blue transition-colors duration-200 font-medium group/link"
                >
                  See details
                  <ArrowRight className="ml-2 w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
