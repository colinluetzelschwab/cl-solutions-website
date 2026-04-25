import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Imprint',
  description: 'Legal information and imprint for CL Solutions.',
}

export default function ImprintPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-36 md:pt-44 pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
          <span className="chip chip-quiet mb-6 inline-flex">Legal</span>
          <h1 className="display text-[clamp(2.4rem,5vw,4rem)] text-[color:var(--ink)]">
            Imprint.
          </h1>

          <div className="mt-12 md:mt-16 space-y-10 measure text-base leading-relaxed text-[color:var(--ink-muted)]">
            <section>
              <h2 className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">Company</h2>
              <p>
                CL Solutions<br />
                Colin Lützelschwab<br />
                Switzerland
              </p>
            </section>

            <section>
              <h2 className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">Contact</h2>
              <p>
                Email:{' '}
                <a href="mailto:colin@clsolutions.dev" className="text-[color:var(--accent-bright)] hover:text-[color:var(--ink)] transition-colors">
                  colin@clsolutions.dev
                </a>
                <br />
                Website:{' '}
                <a href="https://clsolutions.ch" className="text-[color:var(--accent-bright)] hover:text-[color:var(--ink)] transition-colors">
                  clsolutions.ch
                </a>
              </p>
            </section>

            <section>
              <h2 className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">Services</h2>
              <p>
                Web design and development for founders anywhere.
                Fixed-scope projects with transparent pricing.
              </p>
            </section>

            <section>
              <h2 className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">Liability Disclaimer</h2>
              <p>
                The content of this website has been prepared with care. However, we cannot guarantee
                the accuracy, completeness, or timeliness of the information provided. As a service
                provider, we are responsible for our own content on these pages under general law.
                However, we are not obligated to monitor transmitted or stored third-party information
                or to investigate circumstances that indicate illegal activity.
              </p>
            </section>

            <section>
              <h2 className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">Link Disclaimer</h2>
              <p>
                Our website may contain links to external websites over which we have no control.
                We cannot accept any responsibility for their content. The respective provider or
                operator of linked pages is always responsible for their content.
              </p>
            </section>

            <section>
              <h2 className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">Copyright</h2>
              <p>
                The content and works on this website created by the site operator are subject to
                Swiss copyright law. Reproduction, editing, distribution, and any kind of use beyond
                the scope of copyright law require written consent from the author.
              </p>
            </section>

            <p className="text-sm text-[color:var(--ink-faint)] pt-6 border-t border-[color:var(--border-subtle)]">
              Last updated: April 2026
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
