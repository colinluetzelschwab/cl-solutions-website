import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PageHero from '@/components/sections/shared/PageHero'
import ContactForm from '@/components/contact/ContactForm'

export const metadata: Metadata = {
  title: 'Get a Quote — CL Solutions',
  description:
    'Tell us about your project. We respond within 24 hours with a proposal.',
}

export default function ContactPage() {
  return (
    <>
      <Navigation />

      <PageHero
        headline="Let's build something."
        subtext="Tell us about your project. We'll send a proposal within 48 hours."
      />

      <ContactForm />

      {/* Contact Details */}
      <section className="w-full bg-background-surface py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-3 text-text-muted">
            <p>
              <strong className="text-text-secondary">Email:</strong>{' '}
              <a
                href="mailto:hello@clsolutions.ch"
                className="text-accent-blue hover:text-accent-blue-hover transition-colors"
              >
                hello@clsolutions.ch
              </a>
            </p>
            <p>
              <strong className="text-text-secondary">Response time:</strong> We
              respond to all enquiries within 24 hours.
            </p>
            <p>
              <strong className="text-text-secondary">Location:</strong> Based in
              Switzerland.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
