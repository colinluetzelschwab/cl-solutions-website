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
    icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />,
    title: 'Fast delivery',
    description: 'Your site goes live in 3–5 working days. Not weeks, not months.',
  },
  {
    icon: <Tag className="w-5 h-5 md:w-6 md:h-6" />,
    title: 'Fixed pricing',
    description: 'You know the price before we start. No hourly surprises.',
  },
  {
    icon: <Sparkles className="w-5 h-5 md:w-6 md:h-6" />,
    title: 'Premium design',
    description: 'Every site is custom-built. No templates. No shortcuts.',
  },
  {
    icon: <MapPin className="w-5 h-5 md:w-6 md:h-6" />,
    title: 'Swiss-based',
    description: 'Based in Switzerland. We understand the market, the language, the expectations.',
  },
]

export default function WhyCL() {
  return (
    <section className="w-full bg-background-primary py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline */}
        <ScrollReveal>
          <div className="text-center mb-14 md:mb-20">
            <p className="text-[11px] md:text-xs text-accent-blue uppercase tracking-[0.25em] mb-4">
              The CL difference
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary tracking-[-0.02em]">
              Why businesses choose us.
            </h2>
          </div>
        </ScrollReveal>

        {/* Differentiators Grid */}
        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border-subtle"
          staggerDelay={0.12}
        >
          {differentiators.map((item, index) => (
            <StaggerItem key={index}>
              <div className="bg-background-surface p-8 lg:p-12 flex flex-col items-start h-full card-glow border border-transparent group cursor-default">
                <div className="text-accent-blue mb-5 p-2.5 bg-accent-blue/[0.07] border border-accent-blue/10 transition-colors duration-300 group-hover:bg-accent-blue/[0.12] group-hover:border-accent-blue/20">
                  {item.icon}
                </div>
                <h3 className="text-xl md:text-2xl font-semibold text-text-primary mb-3 tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">{item.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
