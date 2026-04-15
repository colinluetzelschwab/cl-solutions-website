import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/sections/shared/PageHero'
import PricingTable from '@/components/sections/services/PricingTable'
import PackageComparison from '@/components/sections/services/PackageComparison'
import AddOnsList from '@/components/sections/services/AddOnsList'
import MaintenanceCards from '@/components/sections/services/MaintenanceCards'
import FAQ from '@/components/sections/services/FAQ'
import CTABanner from '@/components/sections/shared/CTABanner'

export const metadata: Metadata = {
  title: 'Pricing & Packages',
  description:
    'Simple fixed pricing. Starter CHF 1,500, Business CHF 3,500, Pro from CHF 7,500. Detailed side-by-side comparison of what each package includes.',
}

export default function ServicesPage() {
  return (
    <>
      <Navigation />

      <PageHero
        headline="Simple pricing. No surprises."
        subtext="Three packages. Fixed scope. Fixed price. Pick what fits."
      />

      <PricingTable />

      <PackageComparison />

      <AddOnsList />

      <MaintenanceCards />

      <FAQ />

      <CTABanner />

      <Footer />
    </>
  )
}
