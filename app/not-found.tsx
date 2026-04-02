import Link from 'next/link'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <>
      <Navigation />
      <main className="flex-1 flex items-center justify-center pt-20 pb-16">
        <div className="text-center px-4">
          <p className="text-accent-blue font-mono text-sm font-medium mb-4">404</p>
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
            Page not found
          </h1>
          <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link href="/">
            <Button className="bg-accent-blue text-text-primary hover:bg-accent-blue-hover font-medium px-8 h-11 rounded-none">
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
