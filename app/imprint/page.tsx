import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Imprint — CL Solutions',
  description: 'Legal information and imprint for CL Solutions.',
}

export default function ImprintPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
            Imprint
          </h1>

          <div className="space-y-8 text-text-secondary text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">Company</h2>
              <p>
                CL Solutions<br />
                Colin Lutzelschwab<br />
                Switzerland
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">Contact</h2>
              <p>
                Email:{' '}
                <a
                  href="mailto:colin@clsolutions.dev"
                  className="text-accent-blue hover:text-accent-blue-hover transition-colors"
                >
                  colin@clsolutions.dev
                </a>
                <br />
                Website:{' '}
                <a
                  href="https://clsolutions.ch"
                  className="text-accent-blue hover:text-accent-blue-hover transition-colors"
                >
                  clsolutions.ch
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">Services</h2>
              <p>
                Web design and development for Swiss businesses.
                Fixed-scope projects with transparent pricing.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">Liability Disclaimer</h2>
              <p>
                The content of this website has been prepared with care. However, we cannot guarantee
                the accuracy, completeness, or timeliness of the information provided. As a service
                provider, we are responsible for our own content on these pages under general law.
                However, we are not obligated to monitor transmitted or stored third-party information
                or to investigate circumstances that indicate illegal activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">Link Disclaimer</h2>
              <p>
                Our website may contain links to external websites over which we have no control.
                We cannot accept any responsibility for their content. The respective provider or
                operator of linked pages is always responsible for their content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">Copyright</h2>
              <p>
                The content and works on this website created by the site operator are subject to
                Swiss copyright law. Reproduction, editing, distribution, and any kind of use beyond
                the scope of copyright law require written consent from the author.
              </p>
            </section>

            <p className="text-text-muted text-sm pt-4 border-t border-border-subtle">
              Last updated: April 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
