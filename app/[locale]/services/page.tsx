import type { Metadata } from 'next'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ServicesHero from '@/components/sections/services/ServicesHero'
import PackageDetail from '@/components/sections/services/PackageDetail'
import Extras from '@/components/sections/services/Extras'
import FAQ from '@/components/sections/services/FAQ'
import CTABanner from '@/components/sections/shared/CTABanner'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('ServicesPage.metadata')
  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('ogTitle'),
      description: t('ogDescription'),
      type: 'article',
    },
  }
}

export default function ServicesPage() {
  const t = useTranslations('ServicesPage')
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

        <CTABanner subtext={t('ctaSubtext')} />
      </main>

      <Footer />
    </>
  )
}
