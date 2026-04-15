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
          background: '#F5F1EC',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top row: logo */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.02em' }}>
            CL
          </span>
          <span
            style={{
              fontSize: 32,
              fontStyle: 'italic',
              color: '#1A1A1A',
              letterSpacing: '-0.01em',
            }}
          >
            Solutions
          </span>
        </div>

        {/* Middle: headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <p
            style={{
              fontSize: 14,
              color: '#1A1A1A',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Premium websites for Swiss businesses
          </p>
          <h1
            style={{
              fontSize: 88,
              color: '#1A1A1A',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            Designed to <span style={{ fontStyle: 'italic', color: '#C8956C' }}>grow.</span>
          </h1>
          <p
            style={{
              fontSize: 26,
              color: '#4A4A47',
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
            borderTop: '1px solid #1A1A1A22',
            paddingTop: '24px',
          }}
        >
          <span style={{ fontSize: 18, color: '#4A4A47', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            clsolutions.dev
          </span>
          <span style={{ fontSize: 18, color: '#4A4A47', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Zurich · Switzerland
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
