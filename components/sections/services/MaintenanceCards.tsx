import React from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MaintenanceTier {
  name: string
  price: string
  features: string[]
}

const tiers: MaintenanceTier[] = [
  {
    name: 'Basic',
    price: 'CHF 49/month',
    features: [
      'Vercel hosting',
      'SSL certificate',
      'Uptime monitoring',
      '99.9% uptime SLA',
    ],
  },
  {
    name: 'Full Service',
    price: 'CHF 149/month',
    features: [
      'Everything in Basic',
      'Monthly text changes',
      'Performance reports',
      'Priority support',
    ],
  },
]

export default function MaintenanceCards() {
  return (
    <section className="w-full bg-background-primary py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-text-primary text-center mb-12">
          Maintenance Retainer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="bg-background-surface border border-border-default p-6 lg:p-8 flex flex-col"
            >
              {/* Tier Name */}
              <h3 className="text-2xl font-semibold text-text-primary mb-2">
                {tier.name}
              </h3>

              {/* Price */}
              <p className="text-3xl font-semibold text-text-primary mb-6 pb-6 border-b border-border-subtle">
                {tier.price}
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8 flex-grow">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent-blue flex-shrink-0 mt-0.5" />
                    <span className="text-text-secondary text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link href="/contact/start">
                <Button className="w-full h-12 bg-background-elevated text-text-primary hover:bg-background-primary border border-border-default font-medium rounded-none transition-all duration-200">
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
