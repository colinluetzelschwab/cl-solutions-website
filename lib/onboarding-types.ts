export interface StepBusinessInfo {
  name: string
  email: string
  phone: string
  businessType: string
}

export interface StepPackage {
  selectedPackage: 'starter' | 'business' | 'pro' | ''
  couponCode: string
  couponValid: boolean
}

export interface StepDesign {
  primaryColor: string
  secondaryColor: string
  aesthetic: string
  darkMode: boolean
  referenceLiked: string
  referenceDisliked: string
}

export interface StepPagesFeatures {
  pages: string[]
  features: string[]
  otherPages: string
  otherFeatures: string
}

export interface UploadedFile {
  name: string
  url: string
  size: number
  type: string
}

export interface StepUpload {
  logo: UploadedFile | null
  photos: UploadedFile[]
  document: UploadedFile | null
}

export interface StepNotes {
  notes: string
}

export interface OnboardingBrief {
  id: string
  createdAt: string
  businessInfo: StepBusinessInfo
  package: StepPackage
  design: StepDesign
  pagesFeatures: StepPagesFeatures
  uploads: StepUpload
  notes: string
  totalPrice: number
}

export interface ApiResponse {
  success: boolean
  error?: string
  data?: Record<string, unknown>
}

export interface UploadResponse {
  success: boolean
  url?: string
  error?: string
}
