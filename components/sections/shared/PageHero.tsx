import React from 'react'

interface PageHeroProps {
  headline: string
  subtext: string
}

export default function PageHero({ headline, subtext }: PageHeroProps) {
  return (
    <section className="w-full bg-background-primary py-16 md:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary mb-4 md:mb-6">
          {headline}
        </h1>
        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto">
          {subtext}
        </p>
      </div>
    </section>
  )
}
