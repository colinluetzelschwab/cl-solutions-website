import { NextRequest, NextResponse } from 'next/server'

function isAuthed(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'true'
}

function getVpsConfig(): { url: string; token: string } | NextResponse {
  const url = process.env.VPS_BUILD_URL
  const token = process.env.VPS_BUILD_TOKEN
  if (!url || !token) {
    return NextResponse.json(
      { error: 'VPS build API not configured (VPS_BUILD_URL or VPS_BUILD_TOKEN missing)' },
      { status: 500 }
    )
  }
  return { url, token }
}

/**
 * POST /api/dashboard/build — Proxy build request to VPS
 * Solves CORS/mixed-content: browser → Vercel (HTTPS) → VPS (HTTP)
 */
export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cfg = getVpsConfig()
  if (cfg instanceof NextResponse) return cfg

  try {
    const body = await request.json()
    const { briefUrl, clientName } = body as { briefUrl: string; clientName: string }

    if (!briefUrl || !clientName) {
      return NextResponse.json({ error: 'briefUrl and clientName required' }, { status: 400 })
    }

    const res = await fetch(`${cfg.url}/build`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.token}`,
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

  const cfg = getVpsConfig()
  if (cfg instanceof NextResponse) return cfg

  try {
    const body = await request.json()
    const { slug } = body as { slug: string }

    const res = await fetch(`${cfg.url}/status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.token}`,
      },
      body: JSON.stringify({ slug }),
    })

    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'VPS nicht erreichbar' }, { status: 502 })
  }
}
