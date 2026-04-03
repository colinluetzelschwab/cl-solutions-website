'use client'

import React from 'react'
import { Sparkles } from 'lucide-react'
import FileDropzone from './FileDropzone'
import type { StepUpload as StepData } from '@/lib/onboarding-types'
import type { UploadedFile } from '@/lib/onboarding-types'
import { FILE_LIMITS, LOGO_GENERATION_PRICE } from '@/lib/onboarding-constants'

interface Props {
  data: StepData
  onChange: (data: StepData) => void
  errors: Record<string, string>
}

export default function StepUpload({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-1">Upload your assets</h2>
        <p className="text-text-secondary">Share your logo, photos, and any content documents.</p>
      </div>

      <FileDropzone
        label="Logo"
        category="logo"
        accept={FILE_LIMITS.logo.accept}
        maxSize={FILE_LIMITS.logo.maxSize}
        required
        files={data.logo ? [data.logo] : []}
        onUpload={(files: UploadedFile[]) => onChange({ ...data, logo: files[0], requestLogoGeneration: false })}
        onRemove={() => onChange({ ...data, logo: null })}
      />
      {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}

      {/* AI Logo Generation Option */}
      {!data.logo && (
        <button
          type="button"
          onClick={() => onChange({ ...data, requestLogoGeneration: !data.requestLogoGeneration })}
          className={`w-full p-4 border-2 text-left transition-all flex items-start gap-3 ${
            data.requestLogoGeneration
              ? 'border-accent-blue bg-accent-blue-glow'
              : 'border-dashed border-border-default hover:border-text-muted bg-background-surface'
          }`}
        >
          <Sparkles className="w-5 h-5 text-accent-blue mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-text-primary">
              No logo yet? We&apos;ll create one for you
            </p>
            <p className="text-xs text-text-secondary mt-1">
              We&apos;ll design an AI-generated logo tailored to your brand as part of your project.
              Additional CHF {LOGO_GENERATION_PRICE} will be added to your total.
            </p>
            {data.requestLogoGeneration && (
              <p className="text-xs text-accent-blue mt-2 font-medium">
                Logo generation selected (+CHF {LOGO_GENERATION_PRICE})
              </p>
            )}
          </div>
        </button>
      )}

      <FileDropzone
        label="Photos"
        category="photo"
        accept={FILE_LIMITS.photo.accept}
        maxSize={FILE_LIMITS.photo.maxSize}
        multiple
        files={data.photos}
        onUpload={(files: UploadedFile[]) => onChange({ ...data, photos: [...data.photos, ...files] })}
        onRemove={(i: number) => onChange({ ...data, photos: data.photos.filter((_, idx) => idx !== i) })}
      />

      <FileDropzone
        label="Text content / brief document"
        category="document"
        accept={FILE_LIMITS.document.accept}
        maxSize={FILE_LIMITS.document.maxSize}
        files={data.document ? [data.document] : []}
        onUpload={(files: UploadedFile[]) => onChange({ ...data, document: files[0] })}
        onRemove={() => onChange({ ...data, document: null })}
      />
    </div>
  )
}
