'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Check, Sparkles } from 'lucide-react'
import type { StepPackage as StepData } from '@/lib/onboarding-types'
import { PACKAGES, HOSTING_PLANS, COUPON_CODE } from '@/lib/onboarding-constants'

interface Props {
  data: StepData
  onChange: (data: StepData) => void
  errors: Record<string, string>
}

export default function StepPackage({ data, onChange, errors }: Props) {
  const [couponMessage, setCouponMessage] = useState('')

  const selectPackage = (id: typeof data.selectedPackage) => {
    onChange({ ...data, selectedPackage: id })
  }

  const selectHosting = (id: typeof data.hostingPlan) => {
    onChange({ ...data, hostingPlan: id })
  }

  useEffect(() => {
    if (data.couponCode.trim() === '') {
      setCouponMessage('')
      onChange({ ...data, couponValid: false })
      return
    }
    const isValid = data.couponCode.toLowerCase().trim() === COUPON_CODE
    setCouponMessage(isValid ? '100% discount applied' : 'Invalid coupon code')
    onChange({ ...data, couponValid: isValid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.couponCode])

  const selectedPkg = PACKAGES.find(p => p.id === data.selectedPackage)
  const selectedHosting = HOSTING_PLANS.find(p => p.id === data.hostingPlan)
  const finalPrice = data.couponValid ? 0 : (selectedPkg?.price ?? 0)

  return (
    <div className="space-y-12">
      {/* Intro */}
      <div>
        <h2 className="display text-2xl md:text-3xl text-[color:var(--ink)] mb-2">
          Choose your <span className="serif-italic text-[color:var(--accent)]">package</span>
        </h2>
        <p className="text-[color:var(--ink-muted)] text-base">
          Pick the tier that matches your scope. You can adjust later — nothing is locked in.
        </p>
      </div>

      {/* Package cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {PACKAGES.map((pkg) => {
          const isSelected = data.selectedPackage === pkg.id
          const isPopular = 'isPopular' in pkg && pkg.isPopular
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => selectPackage(pkg.id)}
              aria-pressed={isSelected}
              className={`group relative text-left flex flex-col rounded-2xl p-6 md:p-7 transition-all duration-300 ease-out
                ${isSelected
                  ? 'bg-[color:var(--surface-1)] border-2 border-[color:var(--accent)] shadow-[0_0_0_4px_var(--accent-glow),0_24px_60px_-20px_var(--accent-glow)] -translate-y-0.5'
                  : 'bg-[color:var(--surface-1)] border border-[color:var(--border-subtle)] hover:border-[color:var(--ink-muted)] hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-24px_rgba(0,0,0,0.2)]'
                }
              `}
            >
              {/* Popular badge */}
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap bg-[color:var(--accent)] text-white text-[10px] font-medium px-3 py-1 rounded-full uppercase tracking-[0.18em] shadow-[0_8px_20px_-6px_var(--accent-glow)]">
                    <Sparkles className="h-3 w-3" strokeWidth={2.2} />
                    Most popular
                  </span>
                </div>
              )}

              {/* Selected check */}
              <span
                aria-hidden
                className={`absolute top-5 right-5 inline-flex items-center justify-center h-7 w-7 rounded-full border transition-all duration-300
                  ${isSelected
                    ? 'border-[color:var(--accent)] bg-[color:var(--accent)] text-white scale-100'
                    : 'border-[color:var(--border-default)] bg-transparent text-transparent scale-90 group-hover:scale-100'
                  }
                `}
              >
                <Check className="h-3.5 w-3.5" strokeWidth={2.6} />
              </span>

              {/* Name */}
              <p className="eyebrow text-[color:var(--ink-muted)] mb-3">{pkg.name}</p>

              {/* Price */}
              <div className="flex items-baseline gap-1.5 mb-4">
                <span className="text-[11px] font-[var(--font-plex-mono)] uppercase tracking-[0.2em] text-[color:var(--ink-faint)]">
                  CHF
                </span>
                <span className="display text-4xl md:text-5xl leading-none text-[color:var(--ink)] tabular">
                  {pkg.price.toLocaleString()}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-[color:var(--ink-muted)] mb-6 leading-relaxed">
                {pkg.description}
              </p>

              {/* Divider */}
              <div className="h-px bg-[color:var(--border-subtle)] mb-5" />

              {/* Features */}
              <ul className="space-y-2.5 flex-grow">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-[color:var(--ink-soft)]">
                    <Check
                      className={`h-4 w-4 mt-0.5 shrink-0 transition-colors ${
                        isSelected ? 'text-[color:var(--accent)]' : 'text-[color:var(--ink-faint)]'
                      }`}
                      strokeWidth={2}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </button>
          )
        })}
      </div>
      {errors.selectedPackage && (
        <p className="text-sm text-[color:var(--destructive)] -mt-6">{errors.selectedPackage}</p>
      )}

      {/* Hosting addon */}
      <div>
        <div className="flex items-baseline justify-between mb-5">
          <div>
            <h3 className="display text-xl text-[color:var(--ink)]">Monthly hosting</h3>
            <p className="text-sm text-[color:var(--ink-muted)] mt-1">
              Optional — managed hosting and ongoing maintenance.
            </p>
          </div>
          <span className="eyebrow hidden md:inline">Add-on</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOSTING_PLANS.map((plan) => {
            const isSelected = data.hostingPlan === plan.id
            const isRecommended = 'isPopular' in plan && plan.isPopular
            return (
              <button
                key={plan.id}
                type="button"
                onClick={() => selectHosting(plan.id)}
                aria-pressed={isSelected}
                className={`relative text-left rounded-xl p-5 transition-all duration-300
                  ${isSelected
                    ? 'bg-[color:var(--surface-1)] border-2 border-[color:var(--accent)] shadow-[0_0_0_3px_var(--accent-glow)]'
                    : 'bg-[color:var(--surface-1)] border border-[color:var(--border-subtle)] hover:border-[color:var(--ink-muted)]'
                  }
                `}
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="eyebrow">{plan.name}</p>
                  {isRecommended && (
                    <span className="text-[9px] font-[var(--font-plex-mono)] uppercase tracking-[0.16em] text-[color:var(--accent)] shrink-0">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  {plan.price === 0 ? (
                    <span className="display text-2xl text-[color:var(--ink)]">—</span>
                  ) : (
                    <>
                      <span className="display text-2xl text-[color:var(--ink)] tabular">
                        CHF {plan.price}
                      </span>
                      <span className="text-xs text-[color:var(--ink-muted)]">/ month</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-[color:var(--ink-muted)] mb-3">{plan.description}</p>
                {plan.features.length > 0 && (
                  <ul className="space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="text-xs text-[color:var(--ink-soft)] flex items-center gap-1.5">
                        <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Coupon + total */}
      <div className="flex flex-col sm:flex-row gap-6 sm:items-end pt-6 border-t border-[color:var(--border-subtle)]">
        <div className="flex-1">
          <label className="eyebrow block mb-2">
            Coupon code <span className="text-[color:var(--ink-faint)] normal-case tracking-normal">(optional)</span>
          </label>
          <Input
            value={data.couponCode}
            onChange={(e) => onChange({ ...data, couponCode: e.target.value })}
            placeholder="Enter code"
            className="bg-[color:var(--surface-1)] border-[color:var(--border-default)] text-[color:var(--ink)] placeholder:text-[color:var(--ink-faint)]"
          />
          {couponMessage && (
            <p
              className={`text-xs mt-1.5 font-[var(--font-plex-mono)] uppercase tracking-[0.14em] ${
                data.couponValid ? 'text-[color:var(--accent)]' : 'text-[color:var(--destructive)]'
              }`}
            >
              {couponMessage}
            </p>
          )}
        </div>
        {data.selectedPackage && (
          <div className="text-right">
            <p className="eyebrow mb-1">One-time</p>
            <p
              className={`display text-4xl leading-none tabular ${
                data.couponValid ? 'text-[color:var(--accent)]' : 'text-[color:var(--ink)]'
              }`}
            >
              CHF {finalPrice.toLocaleString()}
            </p>
            {data.couponValid && (
              <p className="text-xs text-[color:var(--ink-faint)] line-through mt-1 tabular">
                CHF {selectedPkg?.price.toLocaleString()}
              </p>
            )}
            {selectedHosting && selectedHosting.price > 0 && (
              <p className="text-xs text-[color:var(--ink-muted)] mt-1.5 tabular">
                + CHF {selectedHosting.price}/month hosting
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
