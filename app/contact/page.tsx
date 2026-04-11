import type { Metadata } from 'next'
import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { ArrowRight, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact — CL Solutions',
  description:
    'Get in touch with CL Solutions. Premium websites for Swiss businesses.',
}

export default function ContactPage() {
  return (
    <>
      <Navigation />

      <section className="w-full bg-background-primary pt-32 md:pt-40 pb-24 md:pb-32">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 lg:px-16">
          <h1 className="text-4xl md:text-5xl font-light text-text-primary tracking-[-0.02em] mb-3">
            Get in{' '}
            <span className="font-[family-name:var(--font-display)] italic font-normal pr-[0.15em]">
              touch.
            </span>
          </h1>
          <p className="text-base text-text-secondary mb-16 md:mb-20 max-w-md">
            Have a question or want to discuss a project? Reach out directly.
          </p>

          <div className="space-y-10">
            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-text-muted mb-2">Contact</p>
              <p className="text-lg md:text-xl text-text-primary font-light">Colin Lützelschwab</p>
              <a
                href="mailto:colin@clsolutions.dev"
                className="inline-flex items-center gap-2 text-lg md:text-xl text-text-secondary hover:text-text-primary transition-colors mt-1"
              >
                <Mail className="w-4 h-4" />
                colin@clsolutions.dev
              </a>
            </div>

            <div>
              <p className="text-[11px] tracking-[0.15em] uppercase text-text-muted mb-2">Location</p>
              <p className="text-lg md:text-xl text-text-primary font-light">Zurich, Switzerland</p>
            </div>

            <div className="pt-6 border-t border-border-subtle">
              <p className="text-sm text-text-muted mb-4">
                Ready to start? Fill in your brief and we&apos;ll send you a plan within 24 hours.
              </p>
              <Link
                href="/contact/start"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium bg-text-primary text-background-primary hover:bg-text-primary/90 transition-colors group"
              >
                Start a project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
