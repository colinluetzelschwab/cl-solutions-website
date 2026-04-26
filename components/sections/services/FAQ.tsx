import React from 'react'
import { useTranslations } from 'next-intl'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

export default function FAQ() {
  const t = useTranslations('ServicesPage.FAQ')

  return (
    <section className="relative w-full py-28 md:py-36 border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <h2 className="display text-[clamp(2.4rem,5vw,3.8rem)] text-[color:var(--ink)] leading-[1.02] mb-16 md:mb-20">
          {t('heading')}
        </h2>

        <Accordion>
          {FAQ_KEYS.map((key, index) => (
            <AccordionItem key={key} value={`item-${index}`}>
              <AccordionTrigger>{t(`${key}.q`)}</AccordionTrigger>
              <AccordionContent>{t(`${key}.a`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
