/**
 * JSON-LD structured data for schema.org Organization + Service catalogue.
 * Rendered once at the root layout so every page ships it.
 * International positioning: Zurich + Helsinki base, serves founders globally.
 */
export default function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://clsolutions.dev/#organization',
        name: 'CL Solutions',
        url: 'https://clsolutions.dev',
        logo: 'https://clsolutions.dev/icon.png',
        email: 'colin@clsolutions.dev',
        description:
          'An independent boutique studio building fast, custom websites for founders anywhere. Fixed pricing, one-week delivery.',
        address: [
          {
            '@type': 'PostalAddress',
            addressCountry: 'CH',
            addressLocality: 'Zurich',
          },
          {
            '@type': 'PostalAddress',
            addressCountry: 'FI',
            addressLocality: 'Helsinki',
          },
        ],
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        sameAs: [],
      },
      {
        '@type': 'WebSite',
        '@id': 'https://clsolutions.dev/#website',
        url: 'https://clsolutions.dev',
        name: 'CL Solutions',
        publisher: { '@id': 'https://clsolutions.dev/#organization' },
        inLanguage: 'en',
      },
      {
        '@type': 'ProfessionalService',
        '@id': 'https://clsolutions.dev/#service',
        name: 'Website Design & Development',
        provider: { '@id': 'https://clsolutions.dev/#organization' },
        areaServed: { '@type': 'Place', name: 'Worldwide' },
        priceRange: 'CHF 1,500 – CHF 7,500+',
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Website Packages',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Starter Website' },
              price: '1500',
              priceCurrency: 'CHF',
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Business Website' },
              price: '3500',
              priceCurrency: 'CHF',
            },
            {
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: 'Pro Website' },
              price: '7500',
              priceCurrency: 'CHF',
            },
          ],
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
