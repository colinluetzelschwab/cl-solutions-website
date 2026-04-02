'use client'

import { useState, useEffect } from 'react'
import {
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Loader2,
  Tag,
} from 'lucide-react'

interface BriefSummary {
  id: string
  clientName: string
  email: string
  packageId: string
  totalPrice: number
  createdAt: string
  couponUsed: boolean
  blobUrl: string
}

const packageLabels: Record<string, string> = {
  starter: 'Starter',
  professional: 'Professional',
  premium: 'Premium',
}

function formatDate(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString('en-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatPrice(price: number): string {
  return `CHF ${price.toLocaleString('de-CH')}`
}

export default function BriefsPanel() {
  const [briefs, setBriefs] = useState<BriefSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchBriefs() {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/dashboard/briefs')
      if (!response.ok) {
        const data = (await response.json()) as { error: string }
        throw new Error(data.error || 'Failed to fetch')
      }
      const data = (await response.json()) as { briefs: BriefSummary[] }
      setBriefs(data.briefs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load briefs')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchBriefs()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-6 h-6 text-red-400 mb-2" />
        <p className="text-sm text-text-secondary">{error}</p>
        <button
          onClick={() => void fetchBriefs()}
          className="mt-3 text-xs text-accent-blue hover:text-accent-blue-hover transition-colors"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-text-primary">
          Briefs ({briefs.length})
        </h2>
        <button
          onClick={() => void fetchBriefs()}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {briefs.map((brief) => (
          <div
            key={brief.id}
            className="bg-background-surface border border-border-subtle p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-text-primary truncate">
                  {brief.clientName}
                </h3>
                <p className="text-xs text-text-muted truncate mt-0.5">
                  {brief.email}
                </p>
              </div>
              <span className="shrink-0 inline-flex items-center gap-1 bg-accent-blue/10 text-accent-blue text-xs font-medium px-2 py-0.5">
                {packageLabels[brief.packageId] ?? brief.packageId}
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-text-muted">
              <span>{formatDate(brief.createdAt)}</span>
              <span className="font-medium text-text-secondary">
                {formatPrice(brief.totalPrice)}
              </span>
              {brief.couponUsed && (
                <span className="inline-flex items-center gap-0.5 text-green-400">
                  <Tag className="w-3 h-3" />
                  Coupon
                </span>
              )}
            </div>

            <div className="mt-auto pt-1">
              <a
                href={brief.blobUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blue-hover transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                View full brief
              </a>
            </div>
          </div>
        ))}
      </div>

      {briefs.length === 0 && (
        <p className="text-sm text-text-muted text-center py-10">
          No briefs submitted yet.
        </p>
      )}
    </div>
  )
}
