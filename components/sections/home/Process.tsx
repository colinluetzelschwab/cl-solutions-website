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
    <section className="w-full bg-background-surface py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Headline */}
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary text-center mb-12 md:mb-16">
            How it works.
          </h2>
        </ScrollReveal>

        {/* Steps - Desktop Horizontal */}
        <StaggerContainer
          className="hidden md:grid md:grid-cols-4 gap-8 lg:gap-12 relative"
          staggerDelay={0.15}
        >
          {/* Connecting Line */}
          <div className="absolute top-6 left-0 right-0 h-px bg-border-default -z-10" />

          {steps.map((step, index) => (
            <StaggerItem key={index}>
              <div className="relative flex flex-col items-center text-center">
                {/* Step Number Circle */}
                <div className="w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center text-text-primary font-semibold text-lg mb-4 relative z-10">
                  {step.number}
                </div>

                {/* Step Title */}
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  {step.title}
                </h3>

                {/* Step Description */}
                <p className="text-text-secondary text-sm">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Steps - Mobile Vertical */}
        <StaggerContainer className="md:hidden space-y-8 relative" staggerDelay={0.12}>
          {/* Connecting Line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border-default -z-10" />

          {steps.map((step, index) => (
            <StaggerItem key={index} direction="left">
              <div className="relative flex gap-6">
                {/* Step Number Circle */}
                <div className="w-12 h-12 rounded-full bg-accent-blue flex items-center justify-center text-text-primary font-semibold text-lg flex-shrink-0 relative z-10">
                  {step.number}
                </div>

                <div className="flex-1 pt-2">
                  {/* Step Title */}
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {step.title}
                  </h3>

                  {/* Step Description */}
                  <p className="text-text-secondary text-sm">{step.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
