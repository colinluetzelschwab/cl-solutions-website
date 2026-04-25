import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

const BASE = 'https://clsolutions.dev'

const routes: { path: string; changeFrequency: 'monthly' | 'weekly' | 'yearly'; priority: number }[] = [
  { path: '',          changeFrequency: 'monthly', priority: 1.0 },
  { path: '/services', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/work',     changeFrequency: 'weekly',  priority: 0.8 },
  { path: '/contact',  changeFrequency: 'yearly',  priority: 0.5 },
  { path: '/privacy',  changeFrequency: 'yearly',  priority: 0.3 },
  { path: '/imprint',  changeFrequency: 'yearly',  priority: 0.3 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  const entries: MetadataRoute.Sitemap = []

  for (const route of routes) {
    const alternates = Object.fromEntries(
      routing.locales.map((loc) => [loc, `${BASE}/${loc}${route.path}`]),
    )
    for (const locale of routing.locales) {
      entries.push({
        url: `${BASE}/${locale}${route.path}`,
        lastModified,
        changeFrequency: route.changeFrequency,
        priority: locale === routing.defaultLocale ? route.priority : route.priority * 0.9,
        alternates: { languages: alternates },
      })
    }
  }

  return entries
}
