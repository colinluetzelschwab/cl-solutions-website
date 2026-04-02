'use client'

import React from 'react'
import { Clock, Tag, Sparkles, MapPin } from 'lucide-react'
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal'

interface Differentiator {
  icon: React.ReactNode
  title: string
  description: string
}

const differentiators: Differentiator[] = [
  {
    icon: <Clock className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Fast delivery',
    description: 'Most sites live in 3–5 days. Not weeks.',
  },
  {
    icon: <Tag className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Fixed pricing',
    description: 'No hourly billing. No surprises. One price, full scope.',
  },
  {
    icon: <Sparkles className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Premium design',
    description: 'Custom every time. No Wix, no templates, no shortcuts.',
  },
  {
    icon: <MapPin className="w-6 h-6 md:w-8 md:h-8" />,
    title: 'Swiss-based',
    description: 'We understand the Swiss market, the language, the standards.',
  },
]

export default function WhyCL() {
  return (
    <section className="w-full bg-background-primary py-12 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline */}
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary text-center mb-12 md:mb-16">
            Built different.
          </h2>
        </ScrollReveal>

        {/* Differentiators Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-subtle"
          staggerDelay={0.12}
        >
          {differentiators.map((item, index) => (
            <StaggerItem key={index}>
              <div className="bg-background-surface p-8 lg:p-12 flex flex-col items-start h-full">
                <div className="text-accent-blue mb-4">{item.icon}</div>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3">
                  {item.title}
                </h3>
                <p className="text-text-secondary">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
