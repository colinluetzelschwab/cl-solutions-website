import React from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQItem {
  question: string
  answer: string
}

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
    <section className="w-full bg-background-surface py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-accent-blue tracking-[0.25em] uppercase text-center mb-4">
          Common questions
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold text-text-primary text-center mb-12">
          Everything you need to know.
        </h2>

        <Accordion className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="border border-border-default bg-background-primary px-6 py-2"
            >
              <AccordionTrigger className="text-left text-text-primary hover:text-accent-blue transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-text-secondary pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
