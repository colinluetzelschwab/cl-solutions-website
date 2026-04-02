import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/sections/shared/PageHero'
import ProjectGrid from '@/components/work/ProjectGrid'
import CTABanner from '@/components/sections/shared/CTABanner'

export const metadata: Metadata = {
  title: 'Our Work — CL Solutions',
  description:
    'Recent website projects for Swiss businesses across multiple industries.',
}

export default function WorkPage() {
  return (
    <>
      <Navigation />

      <PageHero
        headline="Our work."
        subtext="A selection of recent projects for Swiss businesses."
      />

      <ProjectGrid />

      <CTABanner
        headline="Your business could be next."
        subtext="Tell us about your project. We'll send a proposal within 48 hours."
      />

      <Footer />
    </>
  )
}
