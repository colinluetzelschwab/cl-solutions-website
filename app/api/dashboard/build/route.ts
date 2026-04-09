import { NextRequest, NextResponse } from 'next/server'

const VPS_URL = process.env.VPS_BUILD_URL || 'http://46.225.88.110:3333'
const VPS_TOKEN = process.env.VPS_BUILD_TOKEN || 'cl-build-21cc7b7be633ce72a982f84efda7eee6'

function isAuthed(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'true'
}

/**
 * POST /api/dashboard/build — Proxy build request to VPS
 * Solves CORS/mixed-content: browser → Vercel (HTTPS) → VPS (HTTP)
 */
export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { briefUrl, clientName } = body as { briefUrl: string; clientName: string }

    if (!briefUrl || !clientName) {
      return NextResponse.json({ error: 'briefUrl and clientName required' }, { status: 400 })
    }

    const res = await fetch(`${VPS_URL}/build`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VPS_TOKEN}`,
      },
      body: JSON.stringify({ briefUrl, clientName }),
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (error) {
    console.error('Build proxy error:', error)
    return NextResponse.json({ error: 'VPS nicht erreichbar' }, { status: 502 })
  }
}

/**
 * POST /api/dashboard/build/status — Check build status
 */
export async function PUT(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { slug } = body as { slug: string }

    const res = await fetch(`${VPS_URL}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${VPS_TOKEN}`,
      },
      body: JSON.stringify({ slug }),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'VPS nicht erreichbar' }, { status: 502 })
  }
}
