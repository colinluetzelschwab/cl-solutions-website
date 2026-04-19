'use client'

import React from 'react'
import { STEPS } from '@/lib/onboarding-constants'

interface StepIndicatorProps {
  currentStep: number
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  const progress = ((currentStep + 1) / STEPS.length) * 100

  return (
    <div className="w-full mb-10">
      {/* Header row — label + counter */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-[color:var(--accent)] text-[10px] tabular text-[color:var(--accent-bright)] shadow-[0_0_14px_var(--accent-glow)] relative shrink-0">
            <span className="absolute inset-0 rounded-full bg-[color:var(--accent)]/15" aria-hidden />
            <span className="relative">{currentStep + 1}</span>
          </span>
          <span className="eyebrow text-[color:var(--ink)] truncate">{STEPS[currentStep]}</span>
        </div>
        <span className="eyebrow tabular shrink-0">
          {currentStep + 1} / {STEPS.length}
        </span>
      </div>

      {/* Step dots rail */}
      <div className="hidden sm:flex items-center gap-1.5 mb-4">
        {STEPS.map((_, i) => {
          const done = i < currentStep
          const active = i === currentStep
          return (
            <React.Fragment key={i}>
              <span
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  active
                    ? 'bg-[color:var(--accent-bright)] shadow-[0_0_8px_var(--accent-glow)]'
                    : done
                    ? 'bg-[color:var(--accent-muted)]'
                    : 'bg-[color:var(--surface-3)]'
                }`}
                aria-hidden
              />
              {i < STEPS.length - 1 && (
                <span
                  className={`flex-1 h-px transition-colors ${
                    i < currentStep ? 'bg-[color:var(--accent-muted)]/60' : 'bg-[color:var(--border-subtle)]'
                  }`}
                  aria-hidden
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Progress rail */}
      <div className="w-full h-[2px] rounded-full bg-[color:var(--surface-2)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[color:var(--accent-2)] via-[color:var(--accent)] to-[color:var(--accent-bright)] shadow-[0_0_12px_var(--accent-glow)] transition-all duration-[600ms] ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
