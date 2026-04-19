'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { RotateCcw, ArrowUpRight } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <main className="relative flex-1 flex items-center justify-center min-h-screen overflow-hidden">
      <div aria-hidden className="absolute inset-0 gradient-mesh-subtle" />
      <div aria-hidden className="grid-noise" />

      <div className="relative text-center px-6 max-w-lg">
        <span className="chip chip-accent mb-6 inline-flex">Error</span>
        <h1 className="display text-5xl md:text-6xl text-[color:var(--ink)] mb-5">
          Something <span className="italic text-gradient">went wrong.</span>
        </h1>
        <p className="text-base md:text-lg text-[color:var(--ink-muted)] mb-10 measure mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={reset} className="btn btn-primary">
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <Link href="/" className="btn btn-ghost">
            Back to Home
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
