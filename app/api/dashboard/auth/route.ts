import { NextRequest, NextResponse } from 'next/server'

/**
 * Dashboard authentication API
 *
 * Environment variables required:
 * - DASHBOARD_PASSWORD: The password to access the dashboard
 *
 * POST: Validate password, set httpOnly cookie (24h expiry)
 * DELETE: Clear the auth cookie (logout)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { password: string }
    const { password } = body

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    const dashboardPassword = process.env.DASHBOARD_PASSWORD
    if (!dashboardPassword) {
      console.error('DASHBOARD_PASSWORD environment variable is not set')
      return NextResponse.json(
        { error: 'Dashboard not configured' },
        { status: 500 }
      )
    }

    if (password !== dashboardPassword) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('dashboard_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('dashboard_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
