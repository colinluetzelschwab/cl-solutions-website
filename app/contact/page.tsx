import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/sections/shared/PageHero'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'

export const metadata: Metadata = {
  title: 'Get a Quote — CL Solutions',
  description:
    'Tell us about your project. Fill in your brief and we respond within 24 hours with a plan.',
}

export default function ContactPage() {
  return (
    <>
      <Navigation />

      <PageHero
        headline="Start your project."
        subtext="Fill in your brief below. We'll review it and send you a plan within 24 hours."
      />

      <section className="w-full bg-background-primary py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense>
            <OnboardingWizard />
          </Suspense>
        </div>
      </section>

      <Footer />
    </>
  )
}
