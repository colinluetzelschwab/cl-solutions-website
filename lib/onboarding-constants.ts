export const PACKAGES = [
  {
    id: 'starter' as const,
    name: 'Starter',
    price: 1500,
    description: 'Clean, professional web presence. Fast.',
    features: ['4 pages', 'Responsive design', 'Contact form', '1 revision round', '3-5 day delivery'],
  },
  {
    id: 'business' as const,
    name: 'Business',
    price: 3500,
    description: 'Design that actually stands out.',
    features: ['6 pages', 'Premium design + animations', 'CMS included', 'Full SEO setup', '1 revision round'],
    isPopular: true,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: 7500,
    description: 'Custom scope. Integrations. Ongoing partnership.',
    features: ['Custom page count', 'Multilingual', 'Custom integrations', 'Advanced SEO', '2 revision rounds'],
  },
] as const

export const HOSTING_PLANS = [
  {
    id: 'none' as const,
    name: 'No hosting',
    price: 0,
    description: 'Self-managed hosting',
    features: [],
  },
  {
    id: 'basic' as const,
    name: 'Basic',
    price: 49,
    description: 'Hosting, SSL, uptime monitoring',
    features: ['Vercel hosting', 'SSL certificate', 'Uptime monitoring', '99.9% uptime SLA'],
  },
  {
    id: 'full' as const,
    name: 'Full Service',
    price: 149,
    description: 'Everything managed for you',
    features: ['Everything in Basic', 'Monthly text changes', 'Performance reports', 'Priority support'],
    isPopular: true,
  },
] as const

export const BUSINESS_TYPES = [
  { value: 'local-service', label: 'Local service business' },
  { value: 'restaurant', label: 'Restaurant or hospitality' },
  { value: 'clinic', label: 'Medical clinic or practice' },
  { value: 'consultant', label: 'Consultant or freelancer' },
  { value: 'retail', label: 'Retail' },
  { value: 'real-estate', label: 'Real estate' },
  { value: 'studio', label: 'Studio or creative' },
  { value: 'other', label: 'Other' },
] as const

export const PAGE_OPTIONS = [
  'Home',
  'Services',
  'About',
  'Contact',
  'Portfolio / Gallery',
  'Pricing',
  'Blog',
  'FAQ',
  'Team',
  'Testimonials',
] as const

export const FEATURE_OPTIONS = [
  'Contact form',
  'Google Maps embed',
  'Photo gallery',
  'FAQ accordion',
  'Testimonials section',
  'Booking / appointment system',
  'Blog / news section',
  'Social media links',
  'Newsletter signup',
  'Multi-language',
] as const

export const AESTHETIC_OPTIONS = [
  { value: 'professional', label: 'Professional', description: 'Clean, corporate, trustworthy' },
  { value: 'warm', label: 'Warm', description: 'Friendly, inviting, approachable' },
  { value: 'premium', label: 'Premium', description: 'Luxury, elegant, high-end' },
  { value: 'minimal', label: 'Minimal', description: 'Simple, lots of whitespace' },
  { value: 'bold', label: 'Bold', description: 'Strong colors, impactful, modern' },
] as const

export const COUPON_CODE = 'hetschgern'

export const FILE_LIMITS = {
  logo: { maxSize: 5 * 1024 * 1024, accept: '.svg,.png,.jpg,.jpeg' },
  photo: { maxSize: 10 * 1024 * 1024, accept: '.jpg,.jpeg,.png,.webp' },
  document: { maxSize: 20 * 1024 * 1024, accept: '.pdf,.doc,.docx,.txt' },
} as const

export const STEPS = [
  'Business Info',
  'Package',
  'Design',
  'Pages & Features',
  'Upload Assets',
  'Review & Submit',
] as const

export const LOGO_GENERATION_PRICE = 300
