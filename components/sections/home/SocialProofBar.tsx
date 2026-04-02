import React from 'react'

const businesses = [
  'Local Clinic',
  'Restaurant',
  'Real Estate',
  'Studio',
  'Consulting',
]

export default function SocialProofBar() {
  return (
    <section className="w-full bg-background-surface py-6 md:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm md:text-base text-text-muted mb-4">
            Trusted by businesses across Switzerland
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm md:text-base text-text-muted">
            {businesses.map((business, index) => (
              <React.Fragment key={business}>
                <span>{business}</span>
                {index < businesses.length - 1 && (
                  <span className="hidden sm:inline">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
