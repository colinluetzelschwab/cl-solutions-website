import { Link } from '@/i18n/navigation'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { ArrowUpRight } from 'lucide-react'

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="relative flex-1 flex items-center justify-center pt-20 pb-16 overflow-hidden">
        <div aria-hidden className="absolute inset-0 gradient-mesh-subtle" />
        <div aria-hidden className="grid-noise" />

        <div className="relative text-center px-6 max-w-lg">
          <span className="chip chip-accent mb-6 inline-flex">
            <span className="dot-live" aria-hidden /> Error · 404
          </span>
          <h1 className="display text-5xl md:text-6xl text-[color:var(--ink)] mb-5">
            Page <span className="italic text-gradient">not found.</span>
          </h1>
          <p className="text-base md:text-lg text-[color:var(--ink-muted)] mb-10 measure mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/" className="btn btn-primary">
            Back to Home
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
