'use client'

import React from 'react'
import { STEPS } from '@/lib/onboarding-constants'

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-10">
      {/* Desktop — minimal text labels */}
      <div className="hidden md:block">
        <div className="flex items-center gap-1.5 mb-4">
          {STEPS.map((step, i) => (
            <React.Fragment key={step}>
              <span
                className={`text-[11px] tracking-[0.15em] uppercase transition-colors ${
                  i === currentStep
                    ? 'text-text-primary'
                    : i < currentStep
                    ? 'text-text-secondary'
                    : 'text-text-muted/50'
                }`}
              >
                {step}
              </span>
              {i < STEPS.length - 1 && (
                <span className="text-text-muted/30 text-[11px] mx-1">/</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="w-full bg-border-subtle h-px">
          <div
            className="h-full bg-text-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile — step count + bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] tracking-[0.15em] uppercase text-text-primary">
            {STEPS[currentStep]}
          </span>
          <span className="text-[11px] tracking-[0.15em] text-text-muted">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>
        <div className="w-full bg-border-subtle h-px">
          <div
            className="h-full bg-text-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
