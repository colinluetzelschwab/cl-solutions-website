'use client'

import React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { PACKAGES } from '@/lib/onboarding-constants'
import type { OnboardingBrief } from '@/lib/onboarding-types'

interface Props {
  brief: Omit<OnboardingBrief, 'id' | 'createdAt' | 'totalPrice'>
  onNotesChange: (notes: string) => void
}

export default function StepNotes({ brief, onNotesChange }: Props) {
  const pkg = PACKAGES.find(p => p.id === brief.package.selectedPackage)
  const price = brief.package.couponValid ? 0 : (pkg?.price ?? 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Review & submit</h2>
        <p className="text-text-secondary">Check your details and add any final notes.</p>
      </div>

      {/* Summary */}
      <div className="bg-background-surface border border-border-subtle p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-text-muted">Business</p>
            <p className="text-text-primary font-medium">{brief.businessInfo.name}</p>
          </div>
          <div>
            <p className="text-text-muted">Email</p>
            <p className="text-text-primary font-medium">{brief.businessInfo.email}</p>
          </div>
          <div>
            <p className="text-text-muted">Package</p>
            <p className="text-text-primary font-medium">{pkg?.name ?? '—'}</p>
          </div>
          <div>
            <p className="text-text-muted">Total</p>
            <p className={`font-bold text-lg ${price === 0 ? 'text-green-500' : 'text-text-primary'}`}>
              CHF {price.toLocaleString()}
              {brief.package.couponValid && (
                <span className="text-xs text-green-500 ml-2">Coupon applied</span>
              )}
            </p>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-4 text-sm">
          <p className="text-text-muted mb-1">Pages</p>
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

        <div className="border-t border-border-subtle pt-4 text-sm">
          <p className="text-text-muted mb-1">Features</p>
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

        <div className="border-t border-border-subtle pt-4 text-sm">
          <p className="text-text-muted mb-1">Design</p>
          <div className="flex items-center gap-4">
            {brief.design.primaryColor && (
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 border border-border-default" style={{ backgroundColor: brief.design.primaryColor }} />
                <span className="text-text-secondary text-xs">{brief.design.primaryColor}</span>
              </div>
            )}
            {brief.design.aesthetic && (
              <span className="text-text-secondary capitalize">{brief.design.aesthetic}</span>
            )}
            <span className="text-text-secondary">{brief.design.darkMode ? 'Dark mode' : 'Light mode'}</span>
          </div>
        </div>

        <div className="border-t border-border-subtle pt-4 text-sm">
          <p className="text-text-muted mb-1">Assets</p>
          <p className="text-text-secondary">
            Logo: {brief.uploads.logo ? brief.uploads.logo.name : 'Not uploaded'} |
            Photos: {brief.uploads.photos.length} |
            Document: {brief.uploads.document ? brief.uploads.document.name : 'None'}
          </p>
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
