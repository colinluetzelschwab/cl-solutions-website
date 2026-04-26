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
        {/* Services rises over the static (curtain-closed) hero — pulled up
            via negative margin so it overlaps the second half of the hero's
            pin runway, with z-10 to stack on top. The explicit page-bg fill
            is REQUIRED: without it, Services is transparent on top of the
            still-pinned hero, and the iris-closed curtain card bleeds through
            wherever Services has no opaque content (top padding, between
            cards). The fill matches body bg so the visual seam is invisible. */}
        <div className="relative z-10 -mt-[100svh] bg-[color:var(--paper-dark)]">
          <ServicesOverview />
        </div>
        <SocialProof />
        <Process />
        <CTABanner cinematic />
      </div>
      <Footer />
    </>
  )
}
