import type { Metadata } from 'next'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for CL Solutions. Learn how we handle your data.',
}

const sections: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: '1. Overview',
    body: (
      <p>
        CL Solutions (&ldquo;we&rdquo;, &ldquo;us&rdquo;) takes the protection of your personal data seriously.
        This privacy policy explains what data we collect when you visit our website
        clsolutions.ch and how we use it.
      </p>
    ),
  },
  {
    title: '2. Responsible Party',
    body: (
      <p>
        CL Solutions<br />
        Colin Lützelschwab<br />
        Switzerland<br />
        Email: colin@clsolutions.dev
      </p>
    ),
  },
  {
    title: '3. Data We Collect',
    body: (
      <>
        <p className="mb-3">When you use our contact form, we collect:</p>
        <ul className="list-disc list-inside space-y-1 ml-2 text-[color:var(--ink-muted)]">
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
      </>
    ),
  },
  {
    title: '4. Hosting',
    body: (
      <p>
        This website is hosted on Vercel Inc. (San Francisco, USA). When you visit our site,
        Vercel may collect technical data such as your IP address, browser type, and access times
        for the purpose of delivering the website. For more information, refer to
        Vercel&apos;s privacy policy.
      </p>
    ),
  },
  {
    title: '5. Email Processing',
    body: (
      <p>
        Contact form submissions are processed via Resend (resend.com). Your data is transmitted
        securely and used only to deliver your message to us. We do not share your data with
        third parties for marketing purposes.
      </p>
    ),
  },
  {
    title: '6. Cookies',
    body: (
      <p>
        This website does not use tracking cookies or analytics tools. We do not use
        Google Analytics, Facebook Pixel, or similar services. Only technically necessary
        cookies may be set by our hosting provider.
      </p>
    ),
  },
  {
    title: '7. Your Rights',
    body: (
      <p>
        Under Swiss data protection law (nDSG) and, where applicable, the GDPR, you have
        the right to access, correct, or delete your personal data. You may also object to
        processing or request data portability. Contact us at colin@clsolutions.dev for
        any data-related requests.
      </p>
    ),
  },
  {
    title: '8. Changes',
    body: (
      <p>
        We may update this privacy policy from time to time. The current version is always
        available on this page.
      </p>
    ),
  },
]

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="flex-1 pt-36 md:pt-44 pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl px-6 sm:px-10 lg:px-16">
          <span className="chip chip-quiet mb-6 inline-flex">Legal</span>
          <h1 className="display text-[clamp(2.4rem,5vw,4rem)] text-[color:var(--ink)]">
            Privacy <span className="italic text-gradient">Policy.</span>
          </h1>

          <div className="mt-12 md:mt-16 space-y-10 measure text-base leading-relaxed text-[color:var(--ink-muted)]">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="display text-xl md:text-2xl text-[color:var(--ink)] mb-3">{s.title}</h2>
                <div className="[&_a]:text-[color:var(--accent-bright)] [&_a:hover]:text-[color:var(--ink)]">
                  {s.body}
                </div>
              </section>
            ))}
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
