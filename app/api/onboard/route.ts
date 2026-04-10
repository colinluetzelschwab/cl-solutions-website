import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { Resend } from 'resend'
import type { OnboardingBrief } from '@/lib/onboarding-types'
import { COUPON_CODE, PACKAGES, HOSTING_PLANS, LOGO_GENERATION_PRICE } from '@/lib/onboarding-constants'

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  return new Resend(apiKey)
}

export async function POST(request: NextRequest) {
  try {
    const brief: OnboardingBrief = await request.json()

    // Validate required fields
    if (!brief.businessInfo?.name || !brief.businessInfo?.email) {
      return NextResponse.json(
        { success: false, error: 'Name and email are required' },
        { status: 400 }
      )
    }

    if (!brief.package?.selectedPackage) {
      return NextResponse.json(
        { success: false, error: 'Please select a package' },
        { status: 400 }
      )
    }

    // Server-side coupon validation
    const isCouponValid = brief.package.couponCode.toLowerCase().trim() === COUPON_CODE
    const selectedPkg = PACKAGES.find(p => p.id === brief.package.selectedPackage)
    const basePrice = selectedPkg?.price ?? 0
    const logoPrice = brief.uploads?.requestLogoGeneration ? LOGO_GENERATION_PRICE : 0
    const totalPrice = isCouponValid ? logoPrice : basePrice + logoPrice

    // Generate brief ID and store
    const briefId = crypto.randomUUID()
    const storedBrief = {
      ...brief,
      id: briefId,
      createdAt: new Date().toISOString(),
      totalPrice,
      package: { ...brief.package, couponValid: isCouponValid },
    }

    // Store brief as JSON in Vercel Blob
    const briefBlob = await put(
      `briefs/${briefId}.json`,
      JSON.stringify(storedBrief, null, 2),
      { access: 'public', contentType: 'application/json' }
    )

    // Build Ruflo prompt for email
    const rufloPrompt = buildRufloPrompt(storedBrief)

    // Send notification email
    const resend = getResendClient()
    const { error: emailError } = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'CL Solutions <colin@clsolutions.dev>',
      to: process.env.OWNER_EMAIL || 'colin@clsolutions.dev',
      subject: `New project brief: ${brief.businessInfo.name} (${selectedPkg?.name ?? 'Unknown'})`,
      html: buildEmailHtml(storedBrief, briefBlob.url, rufloPrompt),
    })

    if (emailError) {
      console.error('Email error:', emailError)
    }

    // Push notification via ntfy (instant iPhone notification)
    const ntfyTopic = process.env.NTFY_TOPIC || 'clsolutions-briefs'
    try {
      await fetch(`https://ntfy.sh/${ntfyTopic}`, {
        method: 'POST',
        headers: {
          'Title': `Neuer Brief: ${brief.businessInfo.name}`,
          'Tags': 'briefcase,moneybag',
          'Priority': '4',
          'Click': 'https://clsolutions.dev/jarvis',
        },
        body: `${selectedPkg?.name ?? 'Unknown'} · CHF ${totalPrice.toLocaleString('de-CH')}\n${brief.businessInfo.email}`,
      })
    } catch (ntfyErr) {
      console.error('ntfy error:', ntfyErr)
    }

    return NextResponse.json({
      success: true,
      data: {
        briefId,
        briefUrl: briefBlob.url,
        totalPrice,
        couponValid: isCouponValid,
      },
    })
  } catch (error) {
    console.error('Onboard error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process brief' },
      { status: 500 }
    )
  }
}

function buildRufloPrompt(brief: OnboardingBrief): string {
  const pkg = PACKAGES.find(p => p.id === brief.package.selectedPackage)
  const hosting = HOSTING_PLANS.find(p => p.id === brief.package.hostingPlan)
  const pages = brief.pagesFeatures.pages.join(', ')
  const features = brief.pagesFeatures.features.join(', ')
  const businessType = brief.businessInfo.businessType === 'other'
    ? brief.businessInfo.businessTypeOther
    : brief.businessInfo.businessType

  return `Read _agency/CLAUDE.md and _agency/MEMORY.md before anything else.

You are building a website for:
- Business: ${brief.businessInfo.name}
- Sector: ${businessType}
- Package: ${pkg?.name ?? 'Unknown'} (CHF ${pkg?.price ?? 0})
- Hosting: ${hosting?.name ?? 'None'} (CHF ${hosting?.price ?? 0}/mt)
- Email: ${brief.businessInfo.email}
- Phone: ${brief.businessInfo.phone || 'Not provided'}

Design preferences:
- Primary colour: ${brief.design.primaryColor || 'Not specified'}
- Secondary colour: ${brief.design.secondaryColor || 'Not specified'}
- Accent colour: ${brief.design.accentColor || 'Not specified'}
- Text colour: ${brief.design.textColor || 'Not specified'}
- Design style: ${(brief.design.designPreferences || []).join(', ') || 'Not specified'}
- Font preference: ${brief.design.fontPreference || 'no-preference'}
- Language: ${brief.design.language || 'de'}
- Dark mode: ${brief.design.darkMode ? 'YES' : 'NO'}
- Reference sites liked: ${brief.design.referenceLiked || 'None'}
- Reference sites disliked: ${brief.design.referenceDisliked || 'None'}

Pages: ${pages || 'Not specified'}
${brief.pagesFeatures.otherPages ? `Other pages: ${brief.pagesFeatures.otherPages}` : ''}

Features: ${features || 'None selected'}
${brief.pagesFeatures.otherFeatures ? `Other features: ${brief.pagesFeatures.otherFeatures}` : ''}

Assets:
- Logo: ${brief.uploads.logo?.url ?? (brief.uploads.requestLogoGeneration ? 'GENERATE AI LOGO — client requested logo generation' : 'Not uploaded')}
- Photos: ${brief.uploads.photos.length > 0 ? brief.uploads.photos.map(p => p.url).join(', ') : 'None'}
- Document: ${brief.uploads.document?.url ?? 'None'}

Additional notes: ${brief.notes || 'None'}

Plan the complete build:
- Page by page, section by section
- Every file with its full path
- Build order — what gets created first
- Any missing information flagged before starting

Write the plan to PLAN.md.
Do not create any other files.
Wait for my approval.`
}

function buildEmailHtml(brief: OnboardingBrief, briefUrl: string, rufloPrompt: string): string {
  const pkg = PACKAGES.find(p => p.id === brief.package.selectedPackage)
  const hosting = HOSTING_PLANS.find(p => p.id === brief.package.hostingPlan)
  const businessType = brief.businessInfo.businessType === 'other'
    ? brief.businessInfo.businessTypeOther
    : brief.businessInfo.businessType

  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
  body { font-family: -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; }
  .header { background: #09090B; color: #FAFAFA; padding: 24px; margin-bottom: 20px; }
  .header h1 { margin: 0; font-size: 22px; }
  .header p { margin: 8px 0 0; opacity: 0.7; font-size: 14px; }
  .section { background: #f5f5f5; padding: 16px 20px; margin-bottom: 12px; border-radius: 4px; }
  .section h2 { margin: 0 0 10px; font-size: 16px; color: #333; }
  .field { margin-bottom: 8px; }
  .label { font-weight: 600; color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
  .value { color: #333; }
  .price { font-size: 28px; font-weight: 700; color: ${brief.totalPrice === 0 ? '#22c55e' : '#333'}; }
  .coupon { background: #22c55e; color: white; padding: 2px 8px; border-radius: 4px; font-size: 13px; }
  .prompt-box { background: #1e1e1e; color: #d4d4d4; padding: 16px; font-family: monospace; font-size: 12px; white-space: pre-wrap; border-radius: 4px; overflow-x: auto; margin-top: 12px; }
  .file-link { color: #4169FF; text-decoration: none; }
  .file-link:hover { text-decoration: underline; }
  a.btn { display: inline-block; background: #4169FF; color: white; padding: 10px 24px; text-decoration: none; margin-top: 12px; }
</style></head><body>
<div class="header">
  <h1>New Project Brief: ${brief.businessInfo.name}</h1>
  <p>Package: ${pkg?.name} | Brief ID: ${brief.id}</p>
</div>

<div class="section">
  <h2>Client</h2>
  <div class="field"><span class="label">Name:</span> <span class="value">${brief.businessInfo.name}</span></div>
  <div class="field"><span class="label">Email:</span> <span class="value"><a href="mailto:${brief.businessInfo.email}">${brief.businessInfo.email}</a></span></div>
  <div class="field"><span class="label">Phone:</span> <span class="value">${brief.businessInfo.phone || '—'}</span></div>
  <div class="field"><span class="label">Business type:</span> <span class="value">${businessType}</span></div>
</div>

<div class="section">
  <h2>Package & Hosting</h2>
  <div class="field"><span class="label">Package:</span> <span class="value">${pkg?.name}</span></div>
  <div class="field"><span class="label">Hosting:</span> <span class="value">${hosting?.name ?? 'None'} ${hosting && hosting.price > 0 ? `(CHF ${hosting.price}/mt)` : ''}</span></div>
  ${brief.uploads?.requestLogoGeneration ? `<div class="field"><span class="label">Logo generation:</span> <span class="value">+CHF ${LOGO_GENERATION_PRICE}</span></div>` : ''}
  <div class="price">CHF ${brief.totalPrice.toLocaleString()}</div>
  ${hosting && hosting.price > 0 ? `<div class="field" style="margin-top:4px"><span class="label">Monthly:</span> <span class="value">CHF ${hosting.price}/mt</span></div>` : ''}
  ${brief.package.couponValid ? '<span class="coupon">Coupon: hetschgern (100% off)</span>' : ''}
</div>

<div class="section">
  <h2>Design</h2>
  <div class="field"><span class="label">Primary colour:</span> <span class="value">${brief.design.primaryColor || '—'} ${brief.design.primaryColor ? `<span style="display:inline-block;width:16px;height:16px;background:${brief.design.primaryColor};vertical-align:middle;border:1px solid #ccc;"></span>` : ''}</span></div>
  <div class="field"><span class="label">Secondary colour:</span> <span class="value">${brief.design.secondaryColor || '—'} ${brief.design.secondaryColor ? `<span style="display:inline-block;width:16px;height:16px;background:${brief.design.secondaryColor};vertical-align:middle;border:1px solid #ccc;"></span>` : ''}</span></div>
  <div class="field"><span class="label">Accent colour:</span> <span class="value">${brief.design.accentColor || '—'} ${brief.design.accentColor ? `<span style="display:inline-block;width:16px;height:16px;background:${brief.design.accentColor};vertical-align:middle;border:1px solid #ccc;"></span>` : ''}</span></div>
  <div class="field"><span class="label">Text colour:</span> <span class="value">${brief.design.textColor || '—'} ${brief.design.textColor ? `<span style="display:inline-block;width:16px;height:16px;background:${brief.design.textColor};vertical-align:middle;border:1px solid #ccc;"></span>` : ''}</span></div>
  <div class="field"><span class="label">Design style:</span> <span class="value">${(brief.design.designPreferences || []).join(', ') || '—'}</span></div>
  <div class="field"><span class="label">Font:</span> <span class="value">${brief.design.fontPreference || '—'}</span></div>
  <div class="field"><span class="label">Language:</span> <span class="value">${brief.design.language || 'de'}</span></div>
  <div class="field"><span class="label">Dark mode:</span> <span class="value">${brief.design.darkMode ? 'Yes' : 'No'}</span></div>
  <div class="field"><span class="label">References liked:</span> <span class="value">${brief.design.referenceLiked || '—'}</span></div>
  <div class="field"><span class="label">References disliked:</span> <span class="value">${brief.design.referenceDisliked || '—'}</span></div>
</div>

<div class="section">
  <h2>Pages & Features</h2>
  <div class="field"><span class="label">Pages:</span> <span class="value">${brief.pagesFeatures.pages.join(', ') || '—'}</span></div>
  ${brief.pagesFeatures.otherPages ? `<div class="field"><span class="label">Other pages:</span> <span class="value">${brief.pagesFeatures.otherPages}</span></div>` : ''}
  <div class="field"><span class="label">Features:</span> <span class="value">${brief.pagesFeatures.features.join(', ') || '—'}</span></div>
  ${brief.pagesFeatures.otherFeatures ? `<div class="field"><span class="label">Other features:</span> <span class="value">${brief.pagesFeatures.otherFeatures}</span></div>` : ''}
</div>

<div class="section">
  <h2>Assets</h2>
  <div class="field"><span class="label">Logo:</span> ${brief.uploads.logo ? `<a class="file-link" href="${brief.uploads.logo.url}">${brief.uploads.logo.name}</a>` : brief.uploads?.requestLogoGeneration ? '<strong>AI Logo Generation Requested</strong>' : '—'}</div>
  <div class="field"><span class="label">Photos:</span> ${brief.uploads.photos.length > 0 ? brief.uploads.photos.map(p => `<a class="file-link" href="${p.url}">${p.name}</a>`).join(', ') : '—'}</div>
  <div class="field"><span class="label">Document:</span> ${brief.uploads.document ? `<a class="file-link" href="${brief.uploads.document.url}">${brief.uploads.document.name}</a>` : '—'}</div>
</div>

${brief.notes ? `<div class="section"><h2>Notes</h2><p>${brief.notes}</p></div>` : ''}

<div class="section">
  <h2>Full Brief JSON</h2>
  <a class="btn" href="${briefUrl}">View Full Brief</a>
</div>

<div class="section">
  <h2>Ruflo Prompt (copy-paste into Claude Code)</h2>
  <div class="prompt-box">${rufloPrompt.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
</div>

</body></html>`
}
