import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import ProjectGrid from '@/components/work/ProjectGrid'
import CTABanner from '@/components/sections/shared/CTABanner'
import ScrollReveal from '@/components/ui/scroll-reveal'
import BreadcrumbJsonLd from '@/components/seo/BreadcrumbJsonLd'

export const metadata: Metadata = {
  title: 'Our Work',
  description:
    'Recent website projects for Swiss businesses. Custom-built, never from a template.',
}

export default function WorkPage() {
  return (
    <>
      <BreadcrumbJsonLd
        trail={[
          { name: 'Home', url: 'https://clsolutions.dev' },
          { name: 'Work', url: 'https://clsolutions.dev/work' },
        ]}
      />
      <Navigation />

      <section className="w-full bg-background-primary py-20 md:py-32 lg:py-40">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
          <ScrollReveal>
            <p className="text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-4">Portfolio</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-text-primary tracking-[-0.02em] leading-[1.05] mb-6">
              Selected{' '}
              <span className="font-[family-name:var(--font-display)] italic text-[#C8956C]">
                work.
              </span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <p className="text-base md:text-lg text-text-secondary max-w-lg leading-relaxed">
              Every project is designed from scratch for its industry.
              No templates, no shortcuts.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <ProjectGrid />

      <CTABanner
        headline="Like what you see?"
        subtext="Tell us about your business — we'll show you what we can build."
      />

      <Footer />
    </>
  )
}
