import { NextRequest, NextResponse } from 'next/server'
import { list, put } from '@vercel/blob'

/* eslint-disable @typescript-eslint/no-explicit-any */

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'true'
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { blobs } = await list({ prefix: 'briefs/' })

    // Separate brief JSONs from status JSONs
    const briefBlobs = blobs.filter(b => b.pathname.endsWith('.json') && !b.pathname.endsWith('.status.json'))
    const statusBlobs = blobs.filter(b => b.pathname.endsWith('.status.json'))

    // Load status files into a map
    const statusMap = new Map<string, string>()
    for (const sb of statusBlobs) {
      try {
        const res = await fetch(sb.url)
        if (res.ok) {
          const data = await res.json()
          statusMap.set(data.briefId, data.status)
        }
      } catch { /* skip */ }
    }

    const briefs: any[] = []

    for (const blob of briefBlobs) {
      try {
        const response = await fetch(blob.url)
        if (!response.ok) continue
        const brief = await response.json()

        briefs.push({
          id: brief.id,
          clientName: brief.businessInfo?.name ?? 'Unknown',
          email: brief.businessInfo?.email ?? '',
          packageId: brief.package?.selectedPackage ?? 'unknown',
          totalPrice: brief.totalPrice ?? 0,
          createdAt: brief.createdAt ?? blob.uploadedAt.toISOString(),
          couponUsed: brief.package?.couponValid ?? false,
          blobUrl: blob.url,
          status: statusMap.get(brief.id) ?? 'new',
          // Design fields for expanded view
          primaryColor: brief.design?.primaryColor ?? null,
          secondaryColor: brief.design?.secondaryColor ?? null,
          accentColor: brief.design?.accentColor ?? null,
          pages: brief.pagesFeatures?.pages ?? [],
          features: brief.pagesFeatures?.features ?? [],
          designPreferences: brief.design?.designPreferences ?? [],
          fontPreference: brief.design?.fontPreference ?? null,
          language: brief.design?.language ?? 'de',
          darkMode: brief.design?.darkMode ?? false,
          notes: brief.notes ?? '',
          businessType: brief.businessInfo?.businessType ?? '',
          hostingPlan: brief.package?.hostingPlan ?? 'none',
        })
      } catch {
        console.error('Failed to parse brief:', blob.pathname)
      }
    }

    briefs.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ briefs })
  } catch (error) {
    console.error('Briefs API error:', error)
    return NextResponse.json({ error: 'Failed to fetch briefs' }, { status: 500 })
  }
}

/** PATCH — update brief status (new → building → built → failed) */
export async function PATCH(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { briefId, status, buildSlug } = await request.json()
    if (!briefId || !status) {
      return NextResponse.json({ error: 'briefId and status required' }, { status: 400 })
    }

    await put(
      `briefs/${briefId}.status.json`,
      JSON.stringify({ briefId, status, buildSlug, updatedAt: new Date().toISOString() }),
      { access: 'public', contentType: 'application/json', allowOverwrite: true }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Brief status update error:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
