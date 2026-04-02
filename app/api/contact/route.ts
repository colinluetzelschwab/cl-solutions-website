import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }
  return new Resend(apiKey)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, businessType, message, budgetRange } = body

    // Server-side validation
    if (!name || !email || !businessType || !message || !budgetRange) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Message length validation
    if (message.trim().length < 20) {
      return NextResponse.json(
        { error: 'Message must be at least 20 characters' },
        { status: 400 }
      )
    }

    // Format business type and budget range for display
    const businessTypeLabels: Record<string, string> = {
      'local-service': 'Local service business',
      'restaurant': 'Restaurant or hospitality',
      'consultant': 'Consultant or freelancer',
      'retail': 'Retail',
      'real-estate': 'Real estate',
      'other': 'Other',
    }

    const budgetRangeLabels: Record<string, string> = {
      'under-1000': 'Under CHF 1,000',
      '1000-2500': 'CHF 1,000–2,500',
      '2500-5000': 'CHF 2,500–5,000',
      '5000-plus': 'CHF 5,000+',
    }

    const businessTypeLabel = businessTypeLabels[businessType] || businessType
    const budgetRangeLabel = budgetRangeLabels[budgetRange] || budgetRange

    // Send email via Resend
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: 'CL Solutions <noreply@clsolutions.ch>',
      to: process.env.OWNER_EMAIL || 'colin@clsolutions.ch',
      subject: `New enquiry from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: #09090B;
                color: #FAFAFA;
                padding: 20px;
                margin-bottom: 20px;
              }
              .header h1 {
                margin: 0;
                font-size: 24px;
              }
              .content {
                background: #f5f5f5;
                padding: 20px;
                border-radius: 8px;
              }
              .field {
                margin-bottom: 15px;
              }
              .field-label {
                font-weight: 600;
                color: #666;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 5px;
              }
              .field-value {
                color: #333;
                font-size: 16px;
              }
              .message-box {
                background: white;
                padding: 15px;
                border-left: 4px solid #4169FF;
                margin-top: 10px;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 14px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">${name}</div>
              </div>
              <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:${email}">${email}</a></div>
              </div>
              ${phone ? `
              <div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value"><a href="tel:${phone}">${phone}</a></div>
              </div>
              ` : ''}
              <div class="field">
                <div class="field-label">Business Type</div>
                <div class="field-value">${businessTypeLabel}</div>
              </div>
              <div class="field">
                <div class="field-label">Budget Range</div>
                <div class="field-value">${budgetRangeLabel}</div>
              </div>
              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>This enquiry was submitted via the CL Solutions contact form.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
