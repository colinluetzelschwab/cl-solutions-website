import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/jarvis', '/contact/start/'],
    },
    sitemap: 'https://clsolutions.dev/sitemap.xml',
    host: 'https://clsolutions.dev',
  }
}
