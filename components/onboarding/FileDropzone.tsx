'use client'

import React, { useCallback, useState, useRef } from 'react'
import { Upload, X, FileText, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { UploadedFile } from '@/lib/onboarding-types'

interface FileDropzoneProps {
  label: string
  category: 'logo' | 'photo' | 'document'
  accept: string
  maxSize: number
  multiple?: boolean
  required?: boolean
  files: UploadedFile[]
  onUpload: (files: UploadedFile[]) => void
  onRemove: (index: number) => void
}

export default function FileDropzone({
  label,
  category,
  accept,
  maxSize,
  multiple = false,
  required = false,
  files,
  onUpload,
  onRemove,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (fileList: FileList) => {
    setError('')
    const filesToUpload = Array.from(fileList)

    for (const file of filesToUpload) {
      if (file.size > maxSize) {
        setError(`${file.name} is too large. Max ${maxSize / (1024 * 1024)}MB`)
        return
      }
    }

    setIsUploading(true)
    const uploaded: UploadedFile[] = []

    for (const file of filesToUpload) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', category)

        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        const data = await res.json()

        if (data.success) {
          uploaded.push({
            name: data.name,
            url: data.url,
            size: data.size,
            type: data.type,
          })
        } else {
          setError(data.error || 'Upload failed')
        }
      } catch {
        setError('Upload failed. Please try again.')
      }
    }

    if (uploaded.length > 0) {
      onUpload(uploaded)
    }
    setIsUploading(false)
  }, [category, maxSize, onUpload])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const isImage = (type: string) => type.startsWith('image/')
  const maxMB = maxSize / (1024 * 1024)

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-none p-6 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-accent-blue bg-accent-blue-glow'
            : 'border-border-default hover:border-text-muted'
        } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
            <p className="text-sm text-text-secondary">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-text-muted" />
            <p className="text-sm text-text-secondary">
              Drag & drop or <span className="text-accent-blue">browse</span>
            </p>
            <p className="text-xs text-text-muted">
              {accept.replace(/\./g, '').toUpperCase()} — Max {maxMB}MB
              {multiple && ' each'}
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {files.length > 0 && (
        <div className="space-y-2 mt-2">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 bg-background-surface border border-border-subtle p-3"
            >
              {isImage(file.type) ? (
                <ImageIcon className="w-5 h-5 text-accent-blue flex-shrink-0" />
              ) : (
                <FileText className="w-5 h-5 text-accent-blue flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text-primary truncate">{file.name}</p>
                <p className="text-xs text-text-muted">
                  {(file.size / 1024).toFixed(0)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onRemove(i) }}
                className="p-1 text-text-muted hover:text-red-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
