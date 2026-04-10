import { NextRequest, NextResponse } from 'next/server'

const VPS_URL = process.env.VPS_BUILD_URL || 'http://46.225.88.110:3333'

function isAuthed(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'true'
}

export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(`${VPS_URL}/health`, { signal: controller.signal })
    clearTimeout(timeout)

    const data = await res.json()
    return NextResponse.json({
      status: 'online',
      uptime: data.uptime ?? 0,
    })
  } catch {
    return NextResponse.json({
      status: 'offline',
      uptime: 0,
      error: 'VPS nicht erreichbar',
    })
  }
}
