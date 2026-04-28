import { NextRequest, NextResponse } from 'next/server'
import { put, list, del } from '@vercel/blob'
import { crmCreate } from '@/app/jarvis/lib/crm-store'
import type { Mockup } from '@/app/jarvis/lib/crm-types'

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

    // ── Auto-link Mockup to lead (step 9) ────────────────────
    // If the brief carries a leadId AND the build completed successfully,
    // write a Mockup record. Best-effort — failures here must not break
    // the history write or the ntfy notification below.
    if (entry.status === 'complete' && entry.briefId && entry.deployUrl) {
      try {
        // Fetch the brief blob to discover its leadId (if any).
        const briefPath = `briefs/${entry.briefId}.json`
        const briefList = await list({ prefix: briefPath, limit: 1 })
        const briefBlob = briefList.blobs.find(b => b.pathname === briefPath)
        if (briefBlob) {
          const briefRes = await fetch(briefBlob.url, { cache: 'no-store' })
          if (briefRes.ok) {
            const brief = await briefRes.json()
            if (brief?.leadId && typeof brief.leadId === 'string') {
              const mockup: Omit<Mockup, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'> = {
                leadId: brief.leadId,
                url: entry.deployUrl,
                status: 'ready',
                sent: false,
                buildSlug: entry.slug,
              }
              await crmCreate('mockups', { ...mockup, createdBy: 'system' })
            }
          }
        }
      } catch (linkErr) {
        console.error('Mockup auto-link error:', linkErr)
      }
    }

    // Push ntfy notification on build completion or failure
    if (entry.status === 'complete' || entry.status === 'failed') {
      const ntfyTopic = process.env.NTFY_TOPIC || 'clsolutions-briefs'
      const isComplete = entry.status === 'complete'
      const durationStr = entry.duration != null
        ? `${Math.round(entry.duration / 60)}m ${entry.duration % 60}s`
        : null
      try {
        await fetch(`https://ntfy.sh/${ntfyTopic}`, {
          method: 'POST',
          headers: {
            'Title': isComplete
              ? `Build fertig: ${entry.clientName}`
              : `Build fehlgeschlagen: ${entry.clientName}`,
            'Tags': isComplete ? 'white_check_mark,rocket' : 'x,warning',
            'Priority': isComplete ? '4' : '5',
            'Click': 'https://clsolutions.dev/jarvis',
          },
          body: isComplete
            ? [entry.deployUrl, durationStr].filter(Boolean).join(' · ')
            : entry.slug,
        })
      } catch (ntfyErr) {
        console.error('ntfy build notification error:', ntfyErr)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('History save error:', error)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}

/**
 * DELETE — remove one history entry by slug, OR clear the whole history.
 * Body: { slug: string } — remove that one entry.
 *       { clearAll: true } — wipe history.
 */
export async function DELETE(request: NextRequest) {
  if (!isAuthed(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))

    if (body.clearAll === true) {
      // Wipe history blob entirely (delete + write empty so future POSTs work).
      try {
        const { blobs } = await list({ prefix: 'jarvis/' })
        const historyBlob = blobs.find(b => b.pathname === HISTORY_KEY)
        if (historyBlob) await del(historyBlob.url)
      } catch { /* skip */ }
      await put(HISTORY_KEY, JSON.stringify([]), {
        access: 'public', contentType: 'application/json', allowOverwrite: true,
      })
      return NextResponse.json({ success: true, cleared: true })
    }

    const { slug } = body
    if (!slug) {
      return NextResponse.json({ error: 'slug or clearAll required' }, { status: 400 })
    }

    // Read history, filter out matching slug, write back.
    let history: { slug?: string }[] = []
    try {
      const { blobs } = await list({ prefix: 'jarvis/' })
      const historyBlob = blobs.find(b => b.pathname === HISTORY_KEY)
      if (historyBlob) {
        const res = await fetch(historyBlob.url)
        if (res.ok) history = await res.json()
      }
    } catch { /* nothing to delete from */ }

    const next = history.filter(e => e.slug !== slug)
    if (next.length === history.length) {
      return NextResponse.json({ success: true, removed: 0 })
    }

    await put(HISTORY_KEY, JSON.stringify(next), {
      access: 'public', contentType: 'application/json', allowOverwrite: true,
    })

    return NextResponse.json({ success: true, removed: history.length - next.length })
  } catch (error) {
    console.error('History delete error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
