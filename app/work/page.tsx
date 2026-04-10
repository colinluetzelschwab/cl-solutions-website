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
        headline="Our Work"
        subtext="Real projects. Real results."
      />

      <ProjectGrid />

      <CTABanner
        headline="Like what you see?"
        subtext="Let's create something just as impressive for your business."
      />

      <Footer />
    </>
  )
}
