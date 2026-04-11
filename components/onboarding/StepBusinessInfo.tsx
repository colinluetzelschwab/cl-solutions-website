'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import type { StepBusinessInfo as StepData } from '@/lib/onboarding-types'
import { BUSINESS_TYPES } from '@/lib/onboarding-constants'

interface Props {
  data: StepData
  onChange: (data: StepData) => void
  errors: Record<string, string>
}

export default function StepBusinessInfo({ data, onChange, errors }: Props) {
  const update = (field: keyof StepData, value: string) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-light text-text-primary mb-1">Tell us about your business</h2>
        <p className="text-sm text-text-muted">Basic information so we can understand who you are.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-text-muted mb-2">
            Business name <span className="text-accent-blue">*</span>
          </label>
          <Input
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Core Medical AG"
            className="bg-transparent border-0 border-b border-border-default rounded-none px-0 text-text-primary placeholder:text-text-muted/50 focus-visible:ring-0 focus-visible:border-text-primary transition-colors"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-text-muted mb-2">
            Email <span className="text-accent-blue">*</span>
          </label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@company.ch"
            className="bg-transparent border-0 border-b border-border-default rounded-none px-0 text-text-primary placeholder:text-text-muted/50 focus-visible:ring-0 focus-visible:border-text-primary transition-colors"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-text-muted mb-2">
            Phone <span className="text-text-muted/50">(optional)</span>
          </label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+41 79 123 45 67"
            className="bg-transparent border-0 border-b border-border-default rounded-none px-0 text-text-primary placeholder:text-text-muted/50 focus-visible:ring-0 focus-visible:border-text-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] tracking-[0.1em] uppercase text-text-muted mb-2">
            Business type <span className="text-accent-blue">*</span>
          </label>
          <select
            value={data.businessType}
            onChange={(e) => {
              update('businessType', e.target.value)
              if (e.target.value !== 'other') {
                onChange({ ...data, businessType: e.target.value, businessTypeOther: '' })
              }
            }}
            className="w-full h-10 px-0 bg-transparent border-0 border-b border-border-default text-text-primary text-sm rounded-none focus:outline-none focus:border-text-primary transition-colors"
          >
            <option value="">Select your industry</option>
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt.value} value={bt.value}>{bt.label}</option>
            ))}
          </select>
          {errors.businessType && <p className="text-xs text-red-500 mt-1.5">{errors.businessType}</p>}

          {data.businessType === 'other' && (
            <div className="mt-4">
              <Input
                value={data.businessTypeOther}
                onChange={(e) => update('businessTypeOther', e.target.value)}
                placeholder="Describe your business type..."
                className="bg-transparent border-0 border-b border-border-default rounded-none px-0 text-text-primary placeholder:text-text-muted/50 focus-visible:ring-0 focus-visible:border-text-primary transition-colors"
              />
              {errors.businessTypeOther && <p className="text-xs text-red-500 mt-1.5">{errors.businessTypeOther}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
