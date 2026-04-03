'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { StepDesign as StepData } from '@/lib/onboarding-types'
import { AESTHETIC_OPTIONS } from '@/lib/onboarding-constants'

interface Props {
  data: StepData
  onChange: (data: StepData) => void
  errors: Record<string, string>
}

export default function StepDesign({ data, onChange, errors }: Props) {
  const update = (field: keyof StepData, value: string | boolean) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Design preferences</h2>
        <p className="text-text-secondary">Help us understand the look and feel you want.</p>
      </div>

      {/* Colors */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">Brand colours</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Primary <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <input
                type="color"
                value={data.primaryColor || '#4169FF'}
                onChange={(e) => update('primaryColor', e.target.value)}
                className="w-10 h-10 border border-border-default cursor-pointer bg-transparent"
              />
              <Input
                value={data.primaryColor}
                onChange={(e) => update('primaryColor', e.target.value)}
                placeholder="#4169FF or 'blue'"
                className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Secondary</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={data.secondaryColor || '#09090B'}
                onChange={(e) => update('secondaryColor', e.target.value)}
                className="w-10 h-10 border border-border-default cursor-pointer bg-transparent"
              />
              <Input
                value={data.secondaryColor}
                onChange={(e) => update('secondaryColor', e.target.value)}
                placeholder="#09090B or 'dark'"
                className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Accent</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={data.accentColor || '#22C55E'}
                onChange={(e) => update('accentColor', e.target.value)}
                className="w-10 h-10 border border-border-default cursor-pointer bg-transparent"
              />
              <Input
                value={data.accentColor}
                onChange={(e) => update('accentColor', e.target.value)}
                placeholder="#22C55E or 'green'"
                className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-text-muted mb-1.5">Text colour</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={data.textColor || '#333333'}
                onChange={(e) => update('textColor', e.target.value)}
                className="w-10 h-10 border border-border-default cursor-pointer bg-transparent"
              />
              <Input
                value={data.textColor}
                onChange={(e) => update('textColor', e.target.value)}
                placeholder="#333333 or 'charcoal'"
                className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
              />
            </div>
          </div>
        </div>
        {errors.primaryColor && <p className="text-sm text-red-500 mt-2">{errors.primaryColor}</p>}
      </div>

      {/* Aesthetic */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Aesthetic <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {AESTHETIC_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => update('aesthetic', opt.value)}
              className={`p-3 border-2 text-left transition-all ${
                data.aesthetic === opt.value
                  ? 'border-accent-blue bg-accent-blue-glow'
                  : 'border-border-default hover:border-text-muted bg-background-surface'
              }`}
            >
              <p className="text-sm font-medium text-text-primary">{opt.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
        {errors.aesthetic && <p className="text-sm text-red-500 mt-2">{errors.aesthetic}</p>}
      </div>

      {/* Dark mode */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={data.darkMode}
            onChange={(e) => update('darkMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-background-elevated border border-border-default peer-checked:bg-accent-blue rounded-full peer-focus:ring-2 peer-focus:ring-accent-blue/50 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
        </label>
        <span className="text-sm text-text-primary">Dark mode</span>
        <span className="text-xs text-text-muted">(light mode recommended for most businesses)</span>
      </div>

      {/* Reference sites */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Reference sites you like
          </label>
          <Textarea
            value={data.referenceLiked}
            onChange={(e) => update('referenceLiked', e.target.value)}
            placeholder="URLs of websites you like the design of..."
            rows={3}
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">
            Reference sites you dislike
          </label>
          <Textarea
            value={data.referenceDisliked}
            onChange={(e) => update('referenceDisliked', e.target.value)}
            placeholder="URLs of websites you don't like..."
            rows={3}
            className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
          />
        </div>
      </div>
    </div>
  )
}
