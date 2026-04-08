'use client'

import React from 'react'
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal'

interface Step {
  number: number
  title: string
  description: string
}

const steps: Step[] = [
  {
    number: 1,
    title: 'Brief',
    description: 'Fill in the intake form. Tell us about your business and goals.',
  },
  {
    number: 2,
    title: 'Plan',
    description: 'We plan the full site before writing a single line of code.',
  },
  {
    number: 3,
    title: 'Build',
    description: 'Built in 3–5 days with live preview updates throughout.',
  },
  {
    number: 4,
    title: 'Launch',
    description: 'Domain connected, hosting live, full handoff to you.',
  },
]

export default function Process() {
  return (
    <section className="w-full bg-background-surface py-20 md:py-28 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline */}
        <ScrollReveal>
          <div className="text-center mb-14 md:mb-20">
            <p className="text-[11px] md:text-xs text-accent-blue uppercase tracking-[0.25em] mb-4">
              Process
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary tracking-[-0.02em]">
              How it works.
            </h2>
          </div>
        </ScrollReveal>

        {/* Steps - Desktop Horizontal */}
        <StaggerContainer
          className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-12 relative"
          staggerDelay={0.15}
        >
          {/* Connecting Line — animated gradient */}
          <div className="absolute top-6 left-[12.5%] right-[12.5%] h-px animated-line opacity-40 -z-10" />

          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="relative flex flex-col items-center text-center group">
                {/* Step Number */}
                <div className="w-12 h-12 bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue font-semibold text-lg mb-5 relative z-10 transition-all duration-300 group-hover:bg-accent-blue/20 group-hover:border-accent-blue/40"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  {step.number}
                </div>

                {/* Step Title */}
                <h3 className="text-lg font-semibold text-text-primary mb-2 tracking-[-0.01em]">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-text-secondary text-sm leading-relaxed max-w-[200px]">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Steps - Mobile Vertical */}
        <StaggerContainer className="md:hidden space-y-6 relative" staggerDelay={0.12}>
          {/* Connecting Line */}
          <div className="absolute left-[23px] top-0 bottom-0 w-px bg-gradient-to-b from-accent-blue/30 via-accent-blue/10 to-transparent -z-10" />

          {steps.map((step) => (
            <StaggerItem key={step.number} direction="left">
              <div className="relative flex gap-5">
                {/* Step Number */}
                <div className="w-12 h-12 bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue font-semibold text-lg flex-shrink-0 relative z-10">
                  {step.number}
                </div>

                <div className="flex-1 pt-2">
                  <h3 className="text-lg font-semibold text-text-primary mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
