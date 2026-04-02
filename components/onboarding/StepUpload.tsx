'use client'

import React from 'react'
import FileDropzone from './FileDropzone'
import type { StepUpload as StepData } from '@/lib/onboarding-types'
import type { UploadedFile } from '@/lib/onboarding-types'
import { FILE_LIMITS } from '@/lib/onboarding-constants'

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
        onUpload={(files: UploadedFile[]) => onChange({ ...data, logo: files[0] })}
        onRemove={() => onChange({ ...data, logo: null })}
      />
      {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}

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
