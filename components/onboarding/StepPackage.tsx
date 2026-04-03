'use client'

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Check } from 'lucide-react'
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
    setCouponMessage(isValid ? '100% discount applied!' : 'Invalid coupon code')
    onChange({ ...data, couponValid: isValid })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.couponCode])

  const selectedPkg = PACKAGES.find(p => p.id === data.selectedPackage)
  const selectedHosting = HOSTING_PLANS.find(p => p.id === data.hostingPlan)
  const finalPrice = data.couponValid ? 0 : (selectedPkg?.price ?? 0)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Choose your package</h2>
        <p className="text-text-secondary">All packages include hosting, design, and deployment.</p>
      </div>

      {/* Package Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PACKAGES.map((pkg) => (
          <button
            key={pkg.id}
            type="button"
            onClick={() => selectPackage(pkg.id)}
            className={`relative text-left p-5 border-2 transition-all ${
              data.selectedPackage === pkg.id
                ? 'border-accent-blue bg-accent-blue-glow'
                : 'border-border-default hover:border-text-muted bg-background-surface'
            }`}
          >
            {data.selectedPackage === pkg.id && (
              <div className="absolute top-3 right-3">
                <Check className="w-5 h-5 text-accent-blue" />
              </div>
            )}
            {'isPopular' in pkg && pkg.isPopular && (
              <span className="text-xs font-medium text-accent-blue uppercase tracking-wide">
                Most Popular
              </span>
            )}
            <h3 className="text-lg font-semibold text-text-primary mt-1">{pkg.name}</h3>
            <p className="text-2xl font-bold text-text-primary mt-1">
              CHF {pkg.price.toLocaleString()}
            </p>
            <p className="text-sm text-text-secondary mt-2">{pkg.description}</p>
            <ul className="mt-3 space-y-1">
              {pkg.features.map((f) => (
                <li key={f} className="text-xs text-text-muted flex items-center gap-2">
                  <span className="w-1 h-1 bg-accent-blue rounded-full" />
                  {f}
                </li>
              ))}
            </ul>
          </button>
        ))}
      </div>
      {errors.selectedPackage && <p className="text-sm text-red-500">{errors.selectedPackage}</p>}

      {/* Hosting Selection */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">Monthly hosting</h3>
        <p className="text-sm text-text-secondary mb-4">Optional managed hosting and maintenance.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {HOSTING_PLANS.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => selectHosting(plan.id)}
              className={`relative text-left p-4 border-2 transition-all ${
                data.hostingPlan === plan.id
                  ? 'border-accent-blue bg-accent-blue-glow'
                  : 'border-border-default hover:border-text-muted bg-background-surface'
              }`}
            >
              {data.hostingPlan === plan.id && (
                <div className="absolute top-3 right-3">
                  <Check className="w-4 h-4 text-accent-blue" />
                </div>
              )}
              {'isPopular' in plan && plan.isPopular && (
                <span className="text-xs font-medium text-accent-blue uppercase tracking-wide">
                  Recommended
                </span>
              )}
              <h4 className="text-sm font-semibold text-text-primary mt-1">{plan.name}</h4>
              <p className="text-lg font-bold text-text-primary mt-1">
                {plan.price === 0 ? '—' : `CHF ${plan.price}/mt`}
              </p>
              <p className="text-xs text-text-secondary mt-1">{plan.description}</p>
              {plan.features.length > 0 && (
                <ul className="mt-2 space-y-0.5">
                  {plan.features.map((f) => (
                    <li key={f} className="text-xs text-text-muted flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-accent-blue rounded-full" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Coupon & Total */}
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Coupon code <span className="text-text-muted">(optional)</span>
          </label>
          <Input
            value={data.couponCode}
            onChange={(e) => onChange({ ...data, couponCode: e.target.value })}
            placeholder="Enter coupon code"
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
          {couponMessage && (
            <p className={`text-sm mt-1 ${data.couponValid ? 'text-green-500' : 'text-red-500'}`}>
              {couponMessage}
            </p>
          )}
        </div>
        {data.selectedPackage && (
          <div className="text-right sm:pb-1">
            <p className="text-sm text-text-muted">One-time</p>
            <p className={`text-3xl font-bold ${data.couponValid ? 'text-green-500' : 'text-text-primary'}`}>
              CHF {finalPrice.toLocaleString()}
              {data.couponValid && (
                <span className="text-sm line-through text-text-muted ml-2">
                  CHF {selectedPkg?.price.toLocaleString()}
                </span>
              )}
            </p>
            {selectedHosting && selectedHosting.price > 0 && (
              <p className="text-sm text-text-muted mt-1">
                + CHF {selectedHosting.price}/mt hosting
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
