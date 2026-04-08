'use client'

import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Pencil } from 'lucide-react'
import { PACKAGES, HOSTING_PLANS, LOGO_GENERATION_PRICE } from '@/lib/onboarding-constants'
import type { OnboardingBrief } from '@/lib/onboarding-types'

interface Props {
  brief: Omit<OnboardingBrief, 'id' | 'createdAt' | 'totalPrice'>
  onNotesChange: (notes: string) => void
  onEditStep: (step: number) => void
}

function SectionHeader({ title, step, onEdit }: { title: string; step: number; onEdit: (s: number) => void }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium text-text-muted uppercase tracking-wide">{title}</p>
      <button
        type="button"
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blue-hover transition-colors"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>
    </div>
  )
}

export default function StepNotes({ brief, onNotesChange, onEditStep }: Props) {
  const pkg = PACKAGES.find(p => p.id === brief.package.selectedPackage)
  const hosting = HOSTING_PLANS.find(p => p.id === brief.package.hostingPlan)
  const basePrice = brief.package.couponValid ? 0 : (pkg?.price ?? 0)
  const logoPrice = brief.uploads.requestLogoGeneration ? LOGO_GENERATION_PRICE : 0
  const totalPrice = basePrice + logoPrice

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Review & submit</h2>
        <p className="text-text-secondary">Check your details and add any final notes.</p>
      </div>

      {/* Summary */}
      <div className="bg-background-surface border border-border-subtle divide-y divide-border-subtle">
        {/* Business Info */}
        <div className="p-5">
          <SectionHeader title="Business" step={0} onEdit={onEditStep} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text-muted text-xs">Name</p>
              <p className="text-text-primary font-medium">{brief.businessInfo.name}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Email</p>
              <p className="text-text-primary font-medium">{brief.businessInfo.email}</p>
            </div>
            {brief.businessInfo.phone && (
              <div>
                <p className="text-text-muted text-xs">Phone</p>
                <p className="text-text-primary">{brief.businessInfo.phone}</p>
              </div>
            )}
            <div>
              <p className="text-text-muted text-xs">Type</p>
              <p className="text-text-primary capitalize">
                {brief.businessInfo.businessType === 'other'
                  ? brief.businessInfo.businessTypeOther || 'Other'
                  : brief.businessInfo.businessType.replace('-', ' ')}
              </p>
            </div>
          </div>
        </div>

        {/* Package & Hosting */}
        <div className="p-5">
          <SectionHeader title="Package & Hosting" step={1} onEdit={onEditStep} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text-muted text-xs">Package</p>
              <p className="text-text-primary font-medium">{pkg?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-text-muted text-xs">One-time price</p>
              <p className={`font-bold text-lg ${basePrice === 0 ? 'text-green-500' : 'text-text-primary'}`}>
                CHF {basePrice.toLocaleString()}
                {brief.package.couponValid && (
                  <span className="text-xs text-green-500 ml-2">Coupon applied</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-text-muted text-xs">Hosting</p>
              <p className="text-text-primary">
                {hosting && hosting.price > 0
                  ? `${hosting.name} (CHF ${hosting.price}/mt)`
                  : 'No managed hosting'}
              </p>
            </div>
            {brief.uploads.requestLogoGeneration && (
              <div>
                <p className="text-text-muted text-xs">Logo generation</p>
                <p className="text-text-primary">+CHF {LOGO_GENERATION_PRICE}</p>
              </div>
            )}
          </div>
          {(logoPrice > 0 || (hosting && hosting.price > 0)) && (
            <div className="mt-3 pt-3 border-t border-border-subtle text-sm">
              <p className="text-text-muted text-xs">Total one-time</p>
              <p className="text-text-primary font-bold text-xl">CHF {totalPrice.toLocaleString()}</p>
              {hosting && hosting.price > 0 && (
                <p className="text-text-muted text-xs mt-1">+ CHF {hosting.price}/mt recurring</p>
              )}
            </div>
          )}
        </div>

        {/* Design */}
        <div className="p-5">
          <SectionHeader title="Design" step={2} onEdit={onEditStep} />
          <div className="space-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-3">
              {[brief.design.primaryColor, brief.design.secondaryColor, brief.design.accentColor, brief.design.textColor].filter(Boolean).map((color, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-5 h-5 border border-border-default rounded-sm" style={{ backgroundColor: color }} />
                  <span className="text-text-secondary text-xs">{color}</span>
                </div>
              ))}
            </div>
            {brief.design.designPreferences && brief.design.designPreferences.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {brief.design.designPreferences.map((p: string) => (
                  <span key={p} className="px-2 py-0.5 bg-accent-blue/10 text-accent-blue text-xs rounded-full">{p}</span>
                ))}
              </div>
            )}
            <div className="flex gap-3 text-xs text-text-secondary">
              <span>Font: {brief.design.fontPreference || 'no preference'}</span>
              <span>·</span>
              <span>Language: {brief.design.language || 'de'}</span>
              <span>·</span>
              <span>{brief.design.darkMode ? 'Dark mode' : 'Light mode'}</span>
            </div>
          </div>
        </div>

        {/* Pages & Features */}
        <div className="p-5">
          <SectionHeader title="Pages & Features" step={3} onEdit={onEditStep} />
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-text-muted text-xs mb-1">Pages</p>
              <div className="flex flex-wrap gap-1">
                {brief.pagesFeatures.pages.map(p => (
                  <span key={p} className="px-2 py-0.5 bg-background-elevated text-text-secondary text-xs">
                    {p}
                  </span>
                ))}
                {brief.pagesFeatures.pages.length === 0 && (
                  <span className="text-text-muted">None selected</span>
                )}
              </div>
            </div>
            <div>
              <p className="text-text-muted text-xs mb-1">Features</p>
              <div className="flex flex-wrap gap-1">
                {brief.pagesFeatures.features.map(f => (
                  <span key={f} className="px-2 py-0.5 bg-background-elevated text-text-secondary text-xs">
                    {f}
                  </span>
                ))}
                {brief.pagesFeatures.features.length === 0 && (
                  <span className="text-text-muted">None selected</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Assets */}
        <div className="p-5">
          <SectionHeader title="Assets" step={4} onEdit={onEditStep} />
          <div className="text-sm space-y-1">
            <p className="text-text-secondary">
              <span className="text-text-muted">Logo:</span>{' '}
              {brief.uploads.logo
                ? brief.uploads.logo.name
                : brief.uploads.requestLogoGeneration
                  ? 'AI-generated (requested)'
                  : 'Not uploaded'}
            </p>
            <p className="text-text-secondary">
              <span className="text-text-muted">Photos:</span> {brief.uploads.photos.length} uploaded
            </p>
            <p className="text-text-secondary">
              <span className="text-text-muted">Document:</span> {brief.uploads.document ? brief.uploads.document.name : 'None'}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-text-primary mb-1.5">
          Additional notes <span className="text-text-muted">(optional)</span>
        </label>
        <Textarea
          value={brief.notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Anything else we should know? Special requests, deadlines, inspiration..."
          rows={4}
          className="bg-background-surface border-border-default text-text-primary placeholder:text-text-muted"
        />
      </div>
    </div>
  )
}
