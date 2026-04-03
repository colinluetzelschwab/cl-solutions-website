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
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Tell us about your business</h2>
        <p className="text-text-secondary">Basic information so we can understand who you are.</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Business name <span className="text-red-500">*</span>
          </label>
          <Input
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g. Core Medical AG"
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Email <span className="text-red-500">*</span>
          </label>
          <Input
            type="email"
            value={data.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@company.ch"
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Phone <span className="text-text-muted">(optional)</span>
          </label>
          <Input
            type="tel"
            value={data.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+41 79 123 45 67"
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Business type <span className="text-red-500">*</span>
          </label>
          <select
            value={data.businessType}
            onChange={(e) => {
              update('businessType', e.target.value)
              if (e.target.value !== 'other') {
                onChange({ ...data, businessType: e.target.value, businessTypeOther: '' })
              }
            }}
            className="w-full h-10 px-3 bg-background-surface border border-border-default text-text-primary text-sm rounded-none focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select your industry</option>
            {BUSINESS_TYPES.map((bt) => (
              <option key={bt.value} value={bt.value}>{bt.label}</option>
            ))}
          </select>
          {errors.businessType && <p className="text-sm text-red-500 mt-1">{errors.businessType}</p>}

          {data.businessType === 'other' && (
            <div className="mt-3">
              <Input
                value={data.businessTypeOther}
                onChange={(e) => update('businessTypeOther', e.target.value)}
                placeholder="Describe your business type..."
                className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
              />
              {errors.businessTypeOther && <p className="text-sm text-red-500 mt-1">{errors.businessTypeOther}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
