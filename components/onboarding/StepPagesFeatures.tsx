'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import type { StepPagesFeatures as StepData } from '@/lib/onboarding-types'
import { PAGE_OPTIONS, FEATURE_OPTIONS } from '@/lib/onboarding-constants'

interface Props {
  data: StepData
  onChange: (data: StepData) => void
}

function TogglePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border transition-all ${
        active
          ? 'border-accent-blue bg-accent-blue text-text-primary'
          : 'border-border-default bg-background-surface text-text-secondary hover:border-text-muted'
      }`}
    >
      {label}
    </button>
  )
}

export default function StepPagesFeatures({ data, onChange }: Props) {
  const togglePage = (page: string) => {
    const pages = data.pages.includes(page)
      ? data.pages.filter(p => p !== page)
      : [...data.pages, page]
    onChange({ ...data, pages })
  }

  const toggleFeature = (feature: string) => {
    const features = data.features.includes(feature)
      ? data.features.filter(f => f !== feature)
      : [...data.features, feature]
    onChange({ ...data, features })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Pages & features</h2>
        <p className="text-text-secondary">Select which pages and features your website needs.</p>
      </div>

      {/* Pages */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Pages <span className="text-text-muted">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {PAGE_OPTIONS.map((page) => (
            <TogglePill
              key={page}
              label={page}
              active={data.pages.includes(page)}
              onClick={() => togglePage(page)}
            />
          ))}
        </div>
        <div className="mt-3">
          <Input
            value={data.otherPages}
            onChange={(e) => onChange({ ...data, otherPages: e.target.value })}
            placeholder="Other pages not listed above..."
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Features */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Features <span className="text-text-muted">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {FEATURE_OPTIONS.map((feature) => (
            <TogglePill
              key={feature}
              label={feature}
              active={data.features.includes(feature)}
              onClick={() => toggleFeature(feature)}
            />
          ))}
        </div>
        <div className="mt-3">
          <Input
            value={data.otherFeatures}
            onChange={(e) => onChange({ ...data, otherFeatures: e.target.value })}
            placeholder="Other features not listed above..."
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>

      <div className="text-sm text-text-muted">
        Selected: {data.pages.length} pages, {data.features.length} features
      </div>
    </div>
  )
}
