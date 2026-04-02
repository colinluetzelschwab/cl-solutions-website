import React from 'react'

interface AddOn {
  name: string
  price: string
}

const addOns: AddOn[] = [
  { name: 'Copywriting (per page)', price: 'CHF 150' },
  { name: 'Extra revision round', price: 'CHF 200' },
  { name: 'Extra page', price: 'CHF 150' },
  { name: 'Logo design (basic)', price: 'CHF 300' },
  { name: 'Multilingual', price: 'CHF 400–800' },
  { name: 'Maintenance retainer', price: 'from CHF 149/month' },
]

export default function AddOnsList() {
  return (
    <section className="w-full bg-background-surface py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-text-primary text-center mb-12">
          Add-ons
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border-default">
          {addOns.map((addOn, index) => (
            <div
              key={index}
              className="bg-background-primary p-6 flex items-center justify-between"
            >
              <span className="text-text-primary font-medium">{addOn.name}</span>
              <span className="text-text-secondary text-sm">{addOn.price}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
