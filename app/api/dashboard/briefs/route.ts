import { NextRequest, NextResponse } from 'next/server'
import { list } from '@vercel/blob'

/**
 * Dashboard briefs API — lists briefs stored in Vercel Blob
 *
 * Briefs are stored by the onboarding flow at `briefs/{id}.json`
 */

interface StoredBrief {
  id: string
  createdAt: string
  totalPrice: number
  businessInfo: {
    name: string
    email: string
    phone?: string
    businessType: string
  }
  package: {
    selectedPackage: string
    couponCode: string
    couponValid: boolean
  }
  design: {
    primaryColor: string
    secondaryColor: string
    aesthetic: string
    darkMode: boolean
  }
}

interface BriefSummary {
  id: string
  clientName: string
  email: string
  packageId: string
  totalPrice: number
  createdAt: string
  couponUsed: boolean
  blobUrl: string
}

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'true'
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { blobs } = await list({ prefix: 'briefs/' })

    const briefs: BriefSummary[] = []

    for (const blob of blobs) {
      try {
        const response = await fetch(blob.url)
        if (!response.ok) continue

        const brief = (await response.json()) as StoredBrief
        briefs.push({
          id: brief.id,
          clientName: brief.businessInfo?.name ?? 'Unknown',
          email: brief.businessInfo?.email ?? '',
          packageId: brief.package?.selectedPackage ?? 'unknown',
          totalPrice: brief.totalPrice ?? 0,
          createdAt: brief.createdAt ?? blob.uploadedAt.toISOString(),
          couponUsed: brief.package?.couponValid ?? false,
          blobUrl: blob.url,
        })
      } catch {
        // Skip malformed briefs
        console.error('Failed to parse brief:', blob.pathname)
      }
    }

    // Sort by creation date, newest first
    briefs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ briefs })
  } catch (error) {
    console.error('Briefs API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch briefs' },
      { status: 500 }
    )
  }
}
