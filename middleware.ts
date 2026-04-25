import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Match all paths except API routes, jarvis (English-only admin),
  // and Next.js internals / static assets / files with extensions.
  matcher: ['/((?!api|jarvis|_next|_vercel|.*\\..*).*)'],
}
