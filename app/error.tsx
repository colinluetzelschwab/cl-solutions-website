'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

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
    <main className="flex-1 flex items-center justify-center min-h-screen bg-background-primary">
      <div className="text-center px-4">
        <p className="text-accent-blue font-mono text-sm font-medium mb-4">Error</p>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Something went wrong
        </h1>
        <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            onClick={reset}
            className="bg-accent-blue text-white hover:bg-accent-blue-hover font-medium px-8 h-11 rounded-none"
          >
            Try Again
          </Button>
          <Link href="/">
            <Button
              variant="outline"
              className="border-border-default text-text-secondary hover:text-text-primary font-medium px-8 h-11 rounded-none"
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
