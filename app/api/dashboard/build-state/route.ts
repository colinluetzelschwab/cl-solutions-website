import { NextRequest, NextResponse } from 'next/server'
import { put, list } from '@vercel/blob'

function isAuthed(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'true'
}

const STATE_KEY = 'jarvis/build-state.json'
const HISTORY_KEY = 'jarvis/build-history.json'

/**
 * GET — Read active build + history from Vercel Blob
 * Shared across all devices (phone, desktop, tablet)
 */
export async function GET(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Find state files
    const { blobs } = await list({ prefix: 'jarvis/' })

    let activeBuild = null
    let history: unknown[] = []

    for (const blob of blobs) {
      try {
        const res = await fetch(blob.url)
        if (!res.ok) continue
        const data = await res.json()

        if (blob.pathname === STATE_KEY) {
          activeBuild = data
        } else if (blob.pathname === HISTORY_KEY) {
          history = data
        }
      } catch { /* skip */ }
    }

    return NextResponse.json({ activeBuild, history })
  } catch {
    return NextResponse.json({ activeBuild: null, history: [] })
  }
}

/**
 * PUT — Save active build state (or clear it)
 * Body: { activeBuild: ActiveBuild | null }
 */
export async function PUT(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { activeBuild } = await request.json()

    if (activeBuild) {
      await put(STATE_KEY, JSON.stringify(activeBuild), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true,
      })
    } else {
      // Clear by writing null
      await put(STATE_KEY, JSON.stringify(null), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Build state save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

/**
 * POST — Add entry to build history
 * Body: { entry: BuildHistoryEntry }
 */
export async function POST(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { entry } = await request.json()

    // Read existing history
    let history: unknown[] = []
    try {
      const { blobs } = await list({ prefix: 'jarvis/' })
      const historyBlob = blobs.find(b => b.pathname === HISTORY_KEY)
      if (historyBlob) {
        const res = await fetch(historyBlob.url)
        if (res.ok) history = await res.json()
      }
    } catch { /* start fresh */ }

    // Prepend new entry, keep last 20
    history.unshift(entry)
    history = history.slice(0, 20)

    await put(HISTORY_KEY, JSON.stringify(history), {
      access: 'public',
      contentType: 'application/json',
      allowOverwrite: true,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('History save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
