import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CL Solutions — Premium Website Design in Switzerland'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background:
            'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(167,113,255,0.35), transparent 60%), ' +
            'radial-gradient(ellipse 60% 50% at 85% 30%, rgba(80,160,220,0.28), transparent 65%), ' +
            'radial-gradient(ellipse 70% 50% at 50% 95%, rgba(180,70,220,0.25), transparent 60%), ' +
            '#0A0B10',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          color: '#F5F5FA',
        }}
      >
        {/* Top row: logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: '#F5F5FA', letterSpacing: '-0.02em' }}>
            cls.
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(245,245,250,0.7)',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Premium websites for Swiss businesses
          </p>
          <h1
            style={{
              fontSize: 88,
              color: '#F5F5FA',
              fontWeight: 500,
              letterSpacing: '-0.03em',
              lineHeight: 1.02,
              margin: 0,
            }}
          >
            Designed to <span style={{ fontStyle: 'italic', color: '#C6A0FF' }}>grow.</span>
          </h1>
          <p
            style={{
              fontSize: 26,
              color: 'rgba(245,245,250,0.72)',
              fontWeight: 300,
              lineHeight: 1.4,
              margin: 0,
              maxWidth: 900,
            }}
          >
            Custom-designed. Fixed price. Delivered in 3–5 days.
          </p>
        </div>

        {/* Bottom row: meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(245,245,250,0.15)',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontSize: 18, color: 'rgba(245,245,250,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            clsolutions.dev
          </span>
          <span style={{ fontSize: 18, color: 'rgba(245,245,250,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Zurich · Switzerland
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
