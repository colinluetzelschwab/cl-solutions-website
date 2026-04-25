'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { useTransition } from 'react'
import { routing } from '@/i18n/routing'

const LABEL: Record<string, string> = {
  en: 'EN',
  de: 'DE',
  fi: 'FI',
}

const FULL: Record<string, string> = {
  en: 'English',
  de: 'Deutsch',
  fi: 'Suomi',
}

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const switchTo = (next: string) => {
    if (next === locale) return
    startTransition(() => {
      // Use replace so language toggle isn't an extra back-button hop.
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div className="flex items-baseline gap-3" role="group" aria-label="Language">
      {routing.locales.map((loc, i) => {
        const active = loc === locale
        return (
          <span key={loc} className="flex items-baseline gap-3">
            <button
              type="button"
              onClick={() => switchTo(loc)}
              aria-label={FULL[loc]}
              aria-current={active ? 'true' : undefined}
              disabled={isPending}
              className={`text-[11px] font-[var(--font-plex-mono)] tracking-[0.22em] uppercase transition-colors ${
                active
                  ? 'text-[color:var(--ink)]'
                  : 'text-[color:var(--ink-faint)] hover:text-[color:var(--ink-muted)]'
              } disabled:opacity-50`}
            >
              {LABEL[loc]}
            </button>
            {i < routing.locales.length - 1 && (
              <span aria-hidden className="text-[10px] text-[color:var(--ink-faint)] opacity-60">·</span>
            )}
          </span>
        )
      })}
    </div>
  )
}
