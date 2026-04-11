'use client'

import React from 'react'
import ScrollReveal, { StaggerContainer, StaggerItem } from '@/components/ui/scroll-reveal'

const steps = [
  { n: '01', title: 'Brief', text: 'You tell us about your business, your goals, and your timeline.' },
  { n: '02', title: 'Plan', text: 'We map out every page and section before writing a single line of code.' },
  { n: '03', title: 'Build', text: 'Your site is built in 3–5 days. You get progress updates along the way.' },
  { n: '04', title: 'Launch', text: 'We connect your domain, go live, and hand over the keys.' },
]

export default function Process() {
  return (
    <section className="w-full bg-background-surface py-28 md:py-40">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <ScrollReveal className="mb-16 md:mb-24">
          <p className="text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-4">Process</p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary tracking-[-0.02em] leading-[1.1]">
            From brief to launch
            <br />
            <span className="font-[family-name:var(--font-display)] italic text-text-secondary">in four steps.</span>
          </h2>
        </ScrollReveal>

        <StaggerContainer className="space-y-0" staggerDelay={0.08}>
          {steps.map((step, i) => (
            <StaggerItem key={step.n}>
              <div className={`flex items-start gap-6 md:gap-10 py-8 md:py-10 ${i < steps.length - 1 ? 'border-b border-border-subtle' : ''}`}>
                <span className="text-xs text-text-muted tracking-wider tabular-nums font-mono shrink-0 pt-1">{step.n}</span>
                <div>
                  <h3 className="text-xl md:text-2xl font-light text-text-primary mb-2">{step.title}</h3>
                  <p className="text-sm md:text-base text-text-secondary leading-relaxed max-w-md">{step.text}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
