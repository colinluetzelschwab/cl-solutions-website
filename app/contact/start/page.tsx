import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import OnboardingWizard from '@/components/onboarding/OnboardingWizard'

export const metadata: Metadata = {
  title: 'Start a Project — CL Solutions',
  description:
    'Tell us about your project. Fill in your brief and we respond within 24 hours with a plan.',
}

export default function StartProjectPage() {
  return (
    <>
      <Navigation />

      <section className="w-full bg-background-primary pt-32 md:pt-40 pb-6 md:pb-8">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
          <h1 className="text-4xl md:text-5xl font-light text-text-primary tracking-[-0.02em] mb-3">
            Start your{' '}
            <span className="inline-block font-[family-name:var(--font-display)] italic font-normal pr-[0.3em]">
              project.
            </span>
          </h1>
          <p className="text-base text-text-secondary">
            Fill in your brief. We&apos;ll review it and send you a plan within 24 hours.
          </p>
        </div>
      </section>

      <section className="w-full bg-background-primary pb-16 md:pb-24">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
          <Suspense>
            <OnboardingWizard />
          </Suspense>
        </div>
      </section>

      <Footer />
    </>
  )
}
