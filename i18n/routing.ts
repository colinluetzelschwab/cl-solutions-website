import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'de', 'fi'],
  defaultLocale: 'en',
  localePrefix: 'always',
})
