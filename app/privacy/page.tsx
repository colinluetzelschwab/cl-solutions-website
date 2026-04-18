import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for CL Solutions. Learn how we handle your data.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-8">
            Privacy Policy
          </h1>

          <div className="space-y-8 text-text-secondary text-base leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">1. Overview</h2>
              <p>
                CL Solutions (&ldquo;we&rdquo;, &ldquo;us&rdquo;) takes the protection of your personal data seriously.
                This privacy policy explains what data we collect when you visit our website
                clsolutions.ch and how we use it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">2. Responsible Party</h2>
              <p>
                CL Solutions<br />
                Colin Lutzelschwab<br />
                Switzerland<br />
                Email: colin@clsolutions.dev
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">3. Data We Collect</h2>
              <p className="mb-3">When you use our contact form, we collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Business type</li>
                <li>Budget range</li>
                <li>Your message</li>
              </ul>
              <p className="mt-3">
                This data is used solely to respond to your enquiry and provide our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">4. Hosting</h2>
              <p>
                This website is hosted on Vercel Inc. (San Francisco, USA). When you visit our site,
                Vercel may collect technical data such as your IP address, browser type, and access times
                for the purpose of delivering the website. For more information, refer to
                Vercel&apos;s privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">5. Email Processing</h2>
              <p>
                Contact form submissions are processed via Resend (resend.com). Your data is transmitted
                securely and used only to deliver your message to us. We do not share your data with
                third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">6. Cookies</h2>
              <p>
                This website does not use tracking cookies or analytics tools. We do not use
                Google Analytics, Facebook Pixel, or similar services. Only technically necessary
                cookies may be set by our hosting provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">7. Your Rights</h2>
              <p>
                Under Swiss data protection law (nDSG) and, where applicable, the GDPR, you have
                the right to access, correct, or delete your personal data. You may also object to
                processing or request data portability. Contact us at colin@clsolutions.dev for
                any data-related requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-3">8. Changes</h2>
              <p>
                We may update this privacy policy from time to time. The current version is always
                available on this page.
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
