'use client'

import React, { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Send, Loader2 } from 'lucide-react'
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
      if (!businessInfo.name.trim()) newErrors.name = 'Business name is required'
      if (!businessInfo.email.trim()) newErrors.email = 'Email is required'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessInfo.email)) newErrors.email = 'Invalid email'
      if (!businessInfo.businessType) newErrors.businessType = 'Please select a business type'
      if (businessInfo.businessType === 'other' && !businessInfo.businessTypeOther.trim()) {
        newErrors.businessTypeOther = 'Please describe your business type'
      }
    }

    if (step === 1) {
      if (!packageData.selectedPackage) newErrors.selectedPackage = 'Please select a package'
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
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <Send className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold text-text-primary mb-4">Brief submitted!</h2>
        <p className="text-lg text-text-secondary mb-2">
          Thank you, {businessInfo.name}. We&apos;ve received your project brief.
        </p>
        <p className="text-text-muted mb-8">
          We&apos;ll review everything and get back to you within 24 hours with a plan.
        </p>
        <p className="text-sm text-text-muted">
          Brief ID: <code className="bg-background-surface px-2 py-1">{submitResult.briefId}</code>
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <StepIndicator currentStep={step} />

      <div className="min-h-[400px]">
        {step === 0 && <StepBusinessInfo data={businessInfo} onChange={setBusinessInfo} errors={errors} />}
        {step === 1 && <StepPackage data={packageData} onChange={setPackageData} errors={errors} />}
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
        <p className="text-red-500 text-sm mt-4">{errors.submit}</p>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border-subtle">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={step === 0}
          className="border-border-default text-text-secondary hover:text-text-primary rounded-none h-11 px-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {step < 5 ? (
          <Button
            type="button"
            onClick={nextStep}
            className="bg-accent-blue text-text-primary hover:bg-accent-blue-hover rounded-none h-11 px-6"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-accent-blue text-text-primary hover:bg-accent-blue-hover rounded-none h-11 px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Brief
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
