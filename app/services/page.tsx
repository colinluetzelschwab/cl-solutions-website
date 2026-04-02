import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/sections/shared/PageHero'
import PricingTable from '@/components/sections/services/PricingTable'
import AddOnsList from '@/components/sections/services/AddOnsList'
import MaintenanceCards from '@/components/sections/services/MaintenanceCards'
import FAQ from '@/components/sections/services/FAQ'
import CTABanner from '@/components/sections/shared/CTABanner'

export const metadata: Metadata = {
  title: 'Pricing & Packages — CL Solutions',
  description:
    'Simple fixed pricing. Starter from CHF 900, Business from CHF 1,900. No hourly billing, no surprises.',
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

      <AddOnsList />

      <MaintenanceCards />

      <FAQ />

      <CTABanner />

      <Footer />
    </>
  )
}
