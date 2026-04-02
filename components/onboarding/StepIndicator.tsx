'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { STEPS } from '@/lib/onboarding-constants'

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Desktop */}
      <div className="hidden md:flex items-center justify-between">
        {STEPS.map((step, i) => (
          <React.Fragment key={step}>
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center text-sm font-medium transition-colors ${
                  i < currentStep
                    ? 'bg-accent-blue text-text-primary'
                    : i === currentStep
                    ? 'bg-accent-blue text-text-primary'
                    : 'bg-background-surface text-text-muted border border-border-default'
                }`}
              >
                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium ${
                  i <= currentStep ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-px mx-3 ${
                  i < currentStep ? 'bg-accent-blue' : 'bg-border-default'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <span className="text-sm text-text-secondary">{STEPS[currentStep]}</span>
        </div>
        <div className="w-full bg-background-surface h-1">
          <div
            className="h-full bg-accent-blue transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
