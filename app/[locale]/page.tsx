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
      {/* data-page="home" opts this page into proximity scroll-snap so each
          section lands as the user pauses, giving the homepage a chapter-
          by-chapter feel. See `html:has([data-page="home"])` in globals.css. */}
      <div data-page="home">
        <HeroContent />
        <ServicesOverview />
        <SocialProof />
        <Process />
        <CTABanner cinematic />
      </div>
      <Footer />
    </>
  )
}
