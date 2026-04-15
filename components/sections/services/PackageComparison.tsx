'use client'

import React from 'react'
import { Check, Minus } from 'lucide-react'
import ScrollReveal from '@/components/ui/scroll-reveal'

type Value = boolean | string

interface Row {
  label: string
  starter: Value
  business: Value
  pro: Value
}

interface Group {
  title: string
  rows: Row[]
}

const groups: Group[] = [
  {
    title: 'Scope',
    rows: [
      { label: 'Pages', starter: 'Up to 4', business: 'Up to 6', pro: 'Custom' },
      { label: 'Revision rounds', starter: '1', business: '1', pro: '2' },
      { label: 'Delivery', starter: '3–5 days', business: '5–7 days', pro: 'Scoped' },
    ],
  },
  {
    title: 'Design',
    rows: [
      { label: 'Custom responsive design', starter: true, business: true, pro: true },
      { label: 'Scroll animations & micro-interactions', starter: false, business: true, pro: true },
      { label: 'Fully custom design direction', starter: false, business: false, pro: true },
      { label: 'Brand system (colour, type, spacing)', starter: 'Light', business: 'Full', pro: 'Full' },
    ],
  },
  {
    title: 'Content',
    rows: [
      { label: 'CMS (client edits text & images)', starter: false, business: true, pro: true },
      { label: 'Multilingual (DE + EN)', starter: false, business: false, pro: true },
      { label: 'Copywriting assistance', starter: false, business: 'Partial', pro: 'Full' },
      { label: 'Custom photography direction', starter: false, business: false, pro: true },
    ],
  },
  {
    title: 'Features',
    rows: [
      { label: 'Contact form + email delivery', starter: true, business: true, pro: true },
      { label: 'Legal pages (Privacy, Imprint)', starter: true, business: true, pro: true },
      { label: 'Blog / news module', starter: false, business: true, pro: true },
      { label: 'Integrations (booking, CRM, maps)', starter: false, business: false, pro: true },
      { label: 'E-commerce ready', starter: false, business: false, pro: true },
    ],
  },
  {
    title: 'SEO & Performance',
    rows: [
      { label: 'Meta tags, sitemap, robots', starter: true, business: true, pro: true },
      { label: 'Open Graph + Twitter cards', starter: false, business: true, pro: true },
      { label: 'Structured data (JSON-LD)', starter: false, business: true, pro: true },
      { label: 'Lighthouse 90+ guarantee', starter: false, business: true, pro: true },
    ],
  },
  {
    title: 'Launch & Support',
    rows: [
      { label: 'Vercel hosting setup', starter: true, business: true, pro: true },
      { label: 'Domain configuration', starter: true, business: true, pro: true },
      { label: 'Analytics (privacy-friendly)', starter: false, business: true, pro: true },
      { label: 'Retainer option', starter: false, business: false, pro: true },
    ],
  },
]

function Cell({ v }: { v: Value }) {
  if (v === true) return <Check className="w-4 h-4 text-[#C8956C] mx-auto" aria-label="included" />
  if (v === false) return <Minus className="w-4 h-4 text-text-muted/40 mx-auto" aria-label="not included" />
  return <span className="text-xs text-text-secondary">{v}</span>
}

export default function PackageComparison() {
  return (
    <section className="w-full bg-background-primary py-20 md:py-28 border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        <ScrollReveal className="mb-12 md:mb-16">
          <p className="text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-4">
            What&apos;s included
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-text-primary tracking-[-0.02em] leading-[1.1]">
            Every detail,
            <br />
            <span className="font-[family-name:var(--font-display)] italic text-text-secondary">side by side.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-border-default">
                <th className="text-left py-4 pr-4 pl-6 sm:pl-0 text-[10px] tracking-[0.25em] uppercase text-text-muted font-medium" />
                <th className="text-center py-4 px-2 text-xs uppercase tracking-[0.2em] text-text-secondary font-medium">Starter</th>
                <th className="text-center py-4 px-2 text-xs uppercase tracking-[0.2em] text-[#C8956C] font-medium">Business</th>
                <th className="text-center py-4 px-2 pr-6 sm:pr-0 text-xs uppercase tracking-[0.2em] text-text-secondary font-medium">Pro</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <React.Fragment key={group.title}>
                  <tr>
                    <td
                      colSpan={4}
                      className="pt-8 pb-2 pl-6 sm:pl-0 text-[10px] tracking-[0.3em] uppercase text-text-muted"
                    >
                      {group.title}
                    </td>
                  </tr>
                  {group.rows.map((row, i) => (
                    <tr
                      key={row.label}
                      className={i === 0 ? 'border-t border-border-subtle' : 'border-t border-border-subtle/40'}
                    >
                      <td className="py-3 pr-4 pl-6 sm:pl-0 text-sm text-text-primary">{row.label}</td>
                      <td className="py-3 px-2 text-center">
                        <Cell v={row.starter} />
                      </td>
                      <td className="py-3 px-2 text-center bg-[#C8956C]/[0.03]">
                        <Cell v={row.business} />
                      </td>
                      <td className="py-3 px-2 pr-6 sm:pr-0 text-center">
                        <Cell v={row.pro} />
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </ScrollReveal>

        <p className="text-xs text-text-muted mt-8 italic">
          Need something between two tiers? Add-ons below or{' '}
          <a href="/contact" className="underline hover:text-text-primary">get in touch</a>.
        </p>
      </div>
    </section>
  )
}
