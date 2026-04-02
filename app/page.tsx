import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import HeroCanvas from '@/components/sections/home/HeroCanvas'
import HeroContent from '@/components/sections/home/HeroContent'
import SocialProofBar from '@/components/sections/home/SocialProofBar'
import ServicesOverview from '@/components/sections/home/ServicesOverview'
import WhyCL from '@/components/sections/home/WhyCL'
import Process from '@/components/sections/home/Process'
import CTABanner from '@/components/sections/shared/CTABanner'

export default function Home() {
  return (
    <>
      <Navigation />

      {/* Hero Section with Water Shader Background */}
      <div className="relative">
        <HeroCanvas />
        <HeroContent />
      </div>

      {/* Social Proof Bar */}
      <SocialProofBar />

      {/* Services Overview */}
      <ServicesOverview />

      {/* Why CL Solutions */}
      <WhyCL />

      {/* Process */}
      <Process />

      {/* CTA Banner */}
      <CTABanner />

      <Footer />
    </>
  )
}
