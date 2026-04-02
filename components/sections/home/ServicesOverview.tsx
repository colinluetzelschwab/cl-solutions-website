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
    price: 'CHF 900',
    description: 'For businesses that need a clean, professional web presence. Fast.',
    features: ['4 pages', '1 revision', '3–5 days'],
  },
  {
    name: 'Business',
    price: 'CHF 1,900',
    description: 'For businesses that want design that actually stands out.',
    features: ['6 pages', 'CMS included', 'Animations'],
    isPopular: true,
  },
  {
    name: 'Pro',
    price: 'From CHF 3,500',
    description: 'Custom scope. Integrations. Ongoing partnership.',
    features: ['Custom', 'Multilingual', 'Retainer option'],
  },
]

export default function ServicesOverview() {
  return (
    <section className="w-full bg-background-primary py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal className="text-center mb-12 md:mb-16">
          <p className="text-sm md:text-base text-text-muted uppercase tracking-wide mb-3">
            What we build
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary">
            One agency. Three packages.
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
                className={`relative bg-background-surface border transition-all duration-300 p-6 lg:p-8 flex flex-col h-full ${
                  pkg.isPopular
                    ? 'border-accent-blue border-2 hover:shadow-[0_0_40px_rgba(65,105,255,0.15)]'
                    : 'border-border-default hover:border-border-subtle'
                }`}
              >
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-accent-blue text-text-primary text-xs font-medium px-3 py-1 uppercase tracking-wide">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Package Name */}
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-2">
                  {pkg.name}
                </h3>

                {/* Price */}
                <p className="text-2xl md:text-3xl font-semibold text-text-primary mb-4">
                  {pkg.price}
                </p>

                {/* Description */}
                <p className="text-text-secondary mb-6 flex-grow">
                  {pkg.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center text-text-secondary text-sm"
                    >
                      <span className="w-1.5 h-1.5 bg-accent-blue rounded-full mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* CTA Link */}
                <Link
                  href="/services"
                  className="flex items-center text-text-primary hover:text-accent-blue transition-colors duration-200 font-medium group"
                >
                  See details
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
