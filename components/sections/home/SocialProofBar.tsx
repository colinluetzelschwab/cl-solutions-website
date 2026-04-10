import React from 'react'

const businesses = [
  'Healthcare',
  'Gastronomy',
  'Real Estate',
  'Creative Studios',
  'Consulting',
  'Legal',
  'Architecture',
  'Fitness & Wellness',
  'Automotive',
  'Education',
]

export default function SocialProofBar() {
  return (
    <section className="w-full bg-background-surface relative overflow-hidden">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-blue/30 to-transparent" />

      <div className="py-5 md:py-6">
        <p className="text-[11px] md:text-xs text-text-muted uppercase tracking-[0.2em] text-center mb-4">
          Built for every industry
        </p>

        {/* Ticker container */}
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-background-surface to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-background-surface to-transparent z-10" />

          <div className="flex animate-ticker whitespace-nowrap">
            {/* Double the items for seamless loop */}
            {[...businesses, ...businesses].map((business, index) => (
              <span
                key={`${business}-${index}`}
                className="inline-flex items-center mx-6 md:mx-8 text-sm text-text-muted/70"
              >
                <span className="w-1.5 h-1.5 bg-accent-blue/60 rounded-full mr-3" />
                {business}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-subtle to-transparent" />
    </section>
  )
}
