import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import HeroContent from '@/components/sections/home/HeroContent'
import ServicesOverview from '@/components/sections/home/ServicesOverview'
import SocialProof from '@/components/sections/home/SocialProof'
import Process from '@/components/sections/home/Process'
import CTABanner from '@/components/sections/shared/CTABanner'

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroContent />
      <ServicesOverview />
      <SocialProof />
      <Process />
      <CTABanner />
      <Footer />
    </>
  )
}
