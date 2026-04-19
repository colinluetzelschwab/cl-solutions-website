import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ServicesHero from '@/components/sections/services/ServicesHero'
import PackageDetail from '@/components/sections/services/PackageDetail'
import Extras from '@/components/sections/services/Extras'
import FAQ from '@/components/sections/services/FAQ'
import CTABanner from '@/components/sections/shared/CTABanner'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Pricing & Packages',
  description:
    'Three packages. One standard. Starter CHF 1,500 · Business CHF 3,500 · Pro from CHF 7,500. Pages, process, design level and live references — priced upfront.',
  openGraph: {
    title: 'Pricing & Packages — CL Solutions',
    description:
      'Three packages. One standard. Priced up front, with live client references.',
    type: 'article',
  },
}

export default function ServicesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: 'https://clsolutions.dev' },
          { name: 'Services', url: 'https://clsolutions.dev/services' },
        ]}
      />
      <Navigation />

      <main className="flex-1">
        <ServicesHero />

        <PackageDetail />

        <Extras />

        <FAQ />

        <CTABanner
          subtext="Fill out the brief wizard — we'll get back within 24 hours with a written proposal and Swiss Werkvertrag."
        />
      </main>

      <Footer />
    </>
  )
}
