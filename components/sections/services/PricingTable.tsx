import React from 'react'
import { Link } from '@/i18n/navigation'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingTier {
  name: string
  price: string
  features: PricingFeature[]
  isPopular?: boolean
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 'CHF 1,500',
    features: [
      { text: 'Up to 4 pages', included: true },
      { text: 'Custom responsive design', included: true },
      { text: 'Contact form', included: true },
      { text: 'Legal pages (content by client)', included: true },
      { text: 'Basic SEO (meta, sitemap, indexing)', included: true },
      { text: 'Vercel hosting setup', included: true },
      { text: '1 revision round', included: true },
      { text: 'Delivery: 3–5 business days', included: true },
    ],
  },
  {
    name: 'Business',
    price: 'CHF 3,500',
    isPopular: true,
    features: [
      { text: 'Up to 6 pages', included: true },
      { text: 'Premium design + scroll animations', included: true },
      { text: 'CMS — client edits text and images', included: true },
      { text: 'Contact form', included: true },
      { text: 'Legal pages', included: true },
      { text: 'Full on-page SEO', included: true },
      { text: 'Vercel hosting setup', included: true },
      { text: '1 revision round', included: true },
      { text: 'Delivery: 5–7 business days', included: true },
    ],
  },
  {
    name: 'Pro',
    price: 'From CHF 7,500',
    features: [
      { text: 'Custom page count', included: true },
      { text: 'Fully custom design direction', included: true },
      { text: 'Integrations (booking, CRM, maps, calendars)', included: true },
      { text: 'CMS', included: true },
      { text: 'Advanced SEO', included: true },
      { text: 'Multilingual (German + English)', included: true },
      { text: '2 revision rounds', included: true },
      { text: 'Retainer option available', included: true },
      { text: 'Delivery: defined per project', included: true },
    ],
  },
]

export default function PricingTable() {
  return (
    <section className="w-full bg-background-primary py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-background-surface border p-6 lg:p-8 flex flex-col ${
                tier.isPopular
                  ? 'border-accent-blue border-2 shadow-[0_0_40px_rgba(200,149,108,0.12)]'
                  : 'border-border-default'
              }`}
            >
              {/* Popular Badge */}
              {tier.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-block whitespace-nowrap bg-accent-blue text-white text-[10px] md:text-xs font-medium px-3 py-1 uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name */}
              <h3 className="text-2xl font-semibold text-text-primary mb-2">
                {tier.name}
              </h3>

              {/* Price */}
              <p className="text-3xl md:text-4xl font-semibold text-text-primary mb-6 pb-6 border-b border-border-subtle">
                {tier.price}
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-sm">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link href={`/contact/start?package=${tier.name.toLowerCase()}`}>
                <Button
                  className={`w-full h-12 font-medium rounded-none transition-all duration-200 ${
                    tier.isPopular
                      ? 'bg-accent-blue text-white hover:bg-accent-blue-hover'
                      : 'bg-background-elevated text-text-primary hover:bg-background-primary border border-border-default'
                  }`}
                >
                  Get Started
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
