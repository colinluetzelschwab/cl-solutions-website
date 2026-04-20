import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CL Solutions — Fast custom websites for serious founders'
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
            'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(130, 220, 255, 0.32), transparent 60%), ' +
            'radial-gradient(ellipse 60% 50% at 85% 30%, rgba(160, 120, 255, 0.24), transparent 65%), ' +
            'radial-gradient(ellipse 70% 50% at 50% 95%, rgba(100, 180, 255, 0.20), transparent 60%), ' +
            '#0A0B10',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          color: '#F5F5FA',
        }}
      >
        {/* Top row: logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: '#F5F5FA', letterSpacing: '-0.02em' }}>
            cls
          </span>
          <span style={{ fontSize: 36, fontWeight: 600, color: '#7AE6FF', letterSpacing: '-0.02em' }}>
            .
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
            Fast custom websites for serious founders
          </p>
          <h1
            style={{
              fontSize: 96,
              color: '#F5F5FA',
              fontWeight: 600,
              letterSpacing: '-0.035em',
              lineHeight: 1.0,
              margin: 0,
            }}
          >
            Built for <span style={{ fontStyle: 'italic', color: '#7AE6FF' }}>founders</span> anywhere.
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
            Custom-designed. Fixed price. Shipped in a week.
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
            Zurich · Helsinki
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
