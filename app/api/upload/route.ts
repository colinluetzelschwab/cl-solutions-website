import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

const MAX_SIZES: Record<string, number> = {
  logo: 5 * 1024 * 1024,
  photo: 10 * 1024 * 1024,
  document: 20 * 1024 * 1024,
}

const ALLOWED_TYPES: Record<string, string[]> = {
  logo: ['image/svg+xml', 'image/png', 'image/jpeg'],
  photo: ['image/jpeg', 'image/png', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = formData.get('category') as string | null

    if (!file || !category) {
      return NextResponse.json(
        { success: false, error: 'File and category are required' },
        { status: 400 }
      )
    }

    if (!MAX_SIZES[category]) {
      return NextResponse.json(
        { success: false, error: 'Invalid file category' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZES[category]) {
      const maxMB = MAX_SIZES[category] / (1024 * 1024)
      return NextResponse.json(
        { success: false, error: `File too large. Maximum ${maxMB}MB for ${category}` },
        { status: 400 }
      )
    }

    const allowedTypes = ALLOWED_TYPES[category]
    if (allowedTypes && !allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: `File type ${file.type} not allowed for ${category}` },
        { status: 400 }
      )
    }

    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const pathname = `onboarding/${category}/${timestamp}-${safeName}`

    const blob = await put(pathname, file, {
      access: 'public',
    })

    return NextResponse.json({
      success: true,
      url: blob.url,
      name: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Upload failed' },
      { status: 500 }
    )
  }
}
