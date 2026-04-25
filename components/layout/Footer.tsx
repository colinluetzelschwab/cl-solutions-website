'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import Logo from '@/components/ui/Logo'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  const t = useTranslations('Footer')

  const exploreLinks = [
    { label: t('services'), href: '/services' },
    { label: t('work'), href: '/work' },
    { label: t('contact'), href: '/contact' },
    { label: t('startProject'), href: '/contact/start' },
  ]

  return (
    <footer className="relative mt-24 md:mt-32 w-full">
      <div className="divider-gradient w-full" />

      <div className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-16 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          <div className="md:col-span-5 flex flex-col gap-5">
            <Link href="/" aria-label={t('explore')}>
              <Logo />
            </Link>
            <p className="measure text-sm text-[color:var(--ink-muted)] leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow mb-4">{t('explore')}</p>
            <ul className="flex flex-col gap-2.5">
              {exploreLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-[color:var(--ink-muted)] hover:text-[color:var(--ink)] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    {l.label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col gap-8">
            <div>
              <p className="eyebrow mb-4">{t('reach')}</p>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <a
                    href="mailto:colin@clsolutions.dev"
                    className="text-sm text-[color:var(--ink)] hover:text-[color:var(--accent-bright)] transition-colors inline-flex items-center gap-1.5 group"
                  >
                    colin@clsolutions.dev
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                </li>
                <li className="text-sm text-[color:var(--ink-muted)]">Zurich · Helsinki</li>
                <li className="text-sm text-[color:var(--ink-muted)]">{t('responseWindow')}</li>
              </ul>
            </div>

            <div>
              <p className="eyebrow mb-3">{t('language')}</p>
              <LanguageSwitcher />
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[color:var(--border-subtle)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-xs text-[color:var(--ink-faint)] tabular">
            {t('rights')}{' '}
            <span className="serif-italic text-[color:var(--ink-muted)]">{t('credit')}</span>
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-[color:var(--ink-faint)] hover:text-[color:var(--ink-muted)] transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/imprint" className="text-xs text-[color:var(--ink-faint)] hover:text-[color:var(--ink-muted)] transition-colors">
              {t('imprint')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
