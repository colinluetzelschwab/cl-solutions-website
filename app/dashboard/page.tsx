import type { Metadata } from 'next'
import DashboardAuth from '@/components/dashboard/DashboardAuth'

export const metadata: Metadata = {
  title: 'Dashboard — CL Solutions',
  robots: { index: false, follow: false },
}

export default function DashboardPage() {
  return <DashboardAuth />
}
