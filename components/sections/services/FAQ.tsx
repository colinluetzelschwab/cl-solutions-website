import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem { question: string; answer: string }

const faqs: FAQItem[] = [
  {
    question: 'What do I need to provide before you start building?',
    answer:
      "We need your text content, images or photos, logo, and brand colours. If you don't have these, we offer copywriting and basic logo design as add-ons.",
  },
  {
    question: 'What counts as a revision round?',
    answer:
      'One batch of written feedback, collected and implemented in one pass. Additional rounds are CHF 200 each.',
  },
  {
    question: 'Do you offer ongoing support after launch?',
    answer:
      'We include a 7-day bug-fix window after launch. For ongoing support, maintenance retainers start at CHF 149/month.',
  },
  {
    question: 'What if my project needs more than 4 or 6 pages?',
    answer:
      'Extra pages are CHF 150 each. Larger projects are quoted under the Pro package.',
  },
  {
    question: 'When do I pay?',
    answer:
      '50% upfront before we start. 50% before the site goes live. Domain and hosting are transferred after full payment.',
  },
  {
    question: 'How fast is 3–5 days, really?',
    answer:
      'The clock starts when we receive your content and deposit. Most Starter sites are live within 4 business days.',
  },
]

export default function FAQ() {
  return (
    <section className="relative w-full py-24 md:py-32 border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-4xl px-6 sm:px-10 lg:px-16">
        <div className="mb-14 md:mb-20">
          <p className="eyebrow mb-6">Chapter · V · Questions</p>
          <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)] text-[color:var(--ink)] leading-[1.02]">
            Everything you{' '}
            <span className="serif-italic text-[color:var(--accent)]">need to know.</span>
          </h2>
        </div>

        <Accordion>
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
