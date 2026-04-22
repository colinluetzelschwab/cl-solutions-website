'use client'

import React, { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight, Send, Loader2, Check } from 'lucide-react'
import StepIndicator from './StepIndicator'
import StepBusinessInfo from './StepBusinessInfo'
import StepPackage from './StepPackage'
import StepDesign from './StepDesign'
import StepPagesFeatures from './StepPagesFeatures'
import StepUpload from './StepUpload'
import StepNotes from './StepNotes'
import type {
  StepBusinessInfo as BusinessInfoData,
  StepPackage as PackageData,
  StepDesign as DesignData,
  StepPagesFeatures as PagesFeaturesData,
  StepUpload as UploadData,
} from '@/lib/onboarding-types'

export default function OnboardingWizard() {
  const searchParams = useSearchParams()
  const preselectedPackage = searchParams.get('package') as PackageData['selectedPackage'] | null

  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{ success: boolean; briefId?: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [businessInfo, setBusinessInfo] = useState<BusinessInfoData>({
    name: '', email: '', phone: '', businessType: '', businessTypeOther: '',
  })

  const [packageData, setPackageData] = useState<PackageData>({
    selectedPackage: preselectedPackage || '',
    couponCode: '',
    couponValid: false,
    hostingPlan: 'none',
  })

  const [design, setDesign] = useState<DesignData>({
    primaryColor: '', secondaryColor: '', accentColor: '', textColor: '',
    designPreferences: [], fontPreference: 'no-preference', language: 'de',
    darkMode: false, referenceLiked: '', referenceDisliked: '',
  })

  const [pagesFeatures, setPagesFeatures] = useState<PagesFeaturesData>({
    pages: ['Home', 'Contact'], features: ['Contact form'],
    otherPages: '', otherFeatures: '',
  })

  const [uploads, setUploads] = useState<UploadData>({
    logo: null, photos: [], document: null, requestLogoGeneration: false,
  })

  const [notes, setNotes] = useState('')

  const validateStep = useCallback((): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!packageData.selectedPackage) newErrors.selectedPackage = 'Please select a package'
    }

    if (step === 1) {
      if (!businessInfo.name.trim()) newErrors.name = 'Business name is required'
      if (!businessInfo.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessInfo.email)) newErrors.email = 'Invalid email'
      if (!businessInfo.businessType) newErrors.businessType = 'Please select a business type'
      if (businessInfo.businessType === 'other' && !businessInfo.businessTypeOther.trim()) {
        newErrors.businessTypeOther = 'Please describe your business type'
      }
    }

    if (step === 2) {
      if (!design.designPreferences || design.designPreferences.length === 0) newErrors.designPreferences = 'Please select at least one design preference'
      if (!design.primaryColor.trim()) newErrors.primaryColor = 'Please choose a primary colour'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [step, businessInfo, packageData, design])

  const nextStep = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, 5))
    }
  }

  const prevStep = () => setStep(s => Math.max(s - 1, 0))

  const goToStep = (s: number) => setStep(s)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setErrors({})

    try {
      const brief = {
        id: '',
        createdAt: '',
        businessInfo,
        package: packageData,
        design,
        pagesFeatures,
        uploads,
        notes,
        totalPrice: 0,
      }

      const res = await fetch('/api/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brief),
      })

      const data = await res.json()

      if (data.success) {
        setSubmitResult({ success: true, briefId: data.data.briefId })
      } else {
        setErrors({ submit: data.error || 'Something went wrong' })
      }
    } catch {
      setErrors({ submit: 'Failed to submit. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitResult?.success) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <div className="relative mx-auto mb-8 inline-flex items-center justify-center h-16 w-16 rounded-full bg-[color:var(--surface-1)] border border-[color:var(--accent)]/40">
          <span className="absolute inset-0 rounded-full bg-[color:var(--accent)]/10 blur-md" aria-hidden />
          <Check className="relative h-7 w-7 text-[color:var(--accent-bright)]" strokeWidth={2.4} />
        </div>
        <h2 className="display text-3xl md:text-4xl text-[color:var(--ink)] mb-4">
          Brief <span className="italic text-gradient">submitted.</span>
        </h2>
        <p className="text-lg text-[color:var(--ink-muted)] mb-2">
          Thank you, {businessInfo.name}. We&apos;ve received your project brief.
        </p>
        <p className="text-[color:var(--ink-muted)] mb-10 measure mx-auto">
          We&apos;ll review everything and get back to you within 24 hours with a plan.
        </p>
        <p className="text-sm text-[color:var(--ink-faint)]">
          Brief ID:{' '}
          <code className="bg-[color:var(--surface-2)] text-[color:var(--ink)] px-2 py-1 rounded-[6px] border border-[color:var(--border-subtle)] font-mono text-xs">
            {submitResult.briefId}
          </code>
        </p>
      </div>
    )
  }

  return (
    <div className="card-surface p-6 md:p-10">
      <StepIndicator currentStep={step} />

      <div className="min-h-[400px]">
        {step === 0 && <StepPackage data={packageData} onChange={setPackageData} errors={errors} />}
        {step === 1 && <StepBusinessInfo data={businessInfo} onChange={setBusinessInfo} errors={errors} />}
        {step === 2 && <StepDesign data={design} onChange={setDesign} errors={errors} />}
        {step === 3 && <StepPagesFeatures data={pagesFeatures} onChange={setPagesFeatures} businessType={businessInfo.businessType} />}
        {step === 4 && <StepUpload data={uploads} onChange={setUploads} errors={errors} />}
        {step === 5 && (
          <StepNotes
            brief={{ businessInfo, package: packageData, design, pagesFeatures, uploads, notes }}
            onNotesChange={setNotes}
            onEditStep={goToStep}
          />
        )}
      </div>

      {errors.submit && (
        <p className="mt-4 text-sm text-[color:var(--destructive)]">{errors.submit}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[color:var(--border-subtle)]">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 0}
          className="inline-flex items-center gap-2 text-sm text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors disabled:opacity-0 disabled:pointer-events-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {step < 5 ? (
          <button type="button" onClick={nextStep} className="btn btn-primary">
            Next
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="btn btn-primary btn-glow disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Submit Brief
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
