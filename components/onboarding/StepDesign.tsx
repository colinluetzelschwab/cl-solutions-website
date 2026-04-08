'use client'

import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { StepDesign as StepData } from '@/lib/onboarding-types'
import { DESIGN_PREFERENCES, FONT_OPTIONS, LANGUAGE_OPTIONS } from '@/lib/onboarding-constants'

interface Props {
  data: StepData
  onChange: (data: StepData) => void
  errors: Record<string, string>
}

export default function StepDesign({ data, onChange, errors }: Props) {
  const update = (field: keyof StepData, value: string | boolean | string[]) => {
    onChange({ ...data, [field]: value })
  }

  const togglePreference = (pref: string) => {
    const current = data.designPreferences || []
    const updated = current.includes(pref)
      ? current.filter(p => p !== pref)
      : current.length < 4 ? [...current, pref] : current
    update('designPreferences', updated)
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Design preferences</h2>
        <p className="text-text-secondary">Help us understand the look and feel you want.</p>
      </div>

      {/* ── Language ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Website language
        </label>
        <div className="flex gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <button
              key={lang.value}
              type="button"
              onClick={() => update('language', lang.value)}
              className={`px-4 py-2 text-sm border transition-all ${
                data.language === lang.value
                  ? 'border-accent-blue bg-accent-blue text-text-primary'
                  : 'border-border-default bg-background-surface text-text-secondary hover:border-text-muted'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Colors ── */}
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

      {/* ── Design Preferences — Multi-select chips ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1">
          Design style <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-text-muted mb-3">Choose up to 4 that best describe your vision.</p>
        <div className="flex flex-wrap gap-2">
          {DESIGN_PREFERENCES.map((pref) => {
            const isActive = (data.designPreferences || []).includes(pref)
            return (
              <button
                key={pref}
                type="button"
                onClick={() => togglePreference(pref)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  isActive
                    ? 'bg-accent-blue text-text-primary'
                    : 'bg-background-surface border border-border-default text-text-secondary hover:border-text-muted'
                }`}
              >
                {pref}
              </button>
            )
          })}
        </div>
        {(data.designPreferences || []).length > 0 && (
          <p className="text-xs text-text-muted mt-2">
            {(data.designPreferences || []).length}/4 selected
          </p>
        )}
        {errors.designPreferences && <p className="text-sm text-red-500 mt-2">{errors.designPreferences}</p>}
      </div>

      {/* ── Font Preference — Visual cards ── */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-3">
          Font style
        </label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.value}
              type="button"
              onClick={() => update('fontPreference', font.value)}
              className={`p-4 border-2 text-left transition-all ${
                data.fontPreference === font.value
                  ? 'border-accent-blue bg-accent-blue-glow'
                  : 'border-border-default hover:border-text-muted bg-background-surface'
              }`}
            >
              {font.preview && (
                <p className="text-lg mb-2 text-text-primary" style={{
                  fontFamily: font.value === 'serif' ? 'Georgia, serif'
                    : font.value === 'display' ? 'system-ui'
                    : 'system-ui, sans-serif',
                  fontStyle: font.value === 'serif' ? 'italic' : 'normal',
                  fontWeight: font.value === 'display' ? 600 : 400,
                  letterSpacing: font.value === 'display' ? '-0.03em' : undefined,
                }}>
                  Aa
                </p>
              )}
              <p className="text-sm font-medium text-text-primary">{font.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{font.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Dark mode ── */}
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

      {/* ── Reference sites ── */}
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
