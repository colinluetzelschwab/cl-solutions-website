'use client'

import { useState, type FormEvent } from 'react'
import { Lock } from 'lucide-react'

interface DashboardLoginProps {
  onSuccess: () => void
}

export default function DashboardLogin({ onSuccess }: DashboardLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = (await response.json()) as { error: string }
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background-primary flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-background-elevated border border-border-default mb-4">
            <Lock className="w-5 h-5 text-accent-blue" />
          </div>
          <h1 className="text-xl font-semibold text-text-primary">
            CL Solutions Dashboard
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Enter your password to continue
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoFocus
              className="w-full h-10 px-3 bg-background-surface border border-border-default text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-accent-blue transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full h-10 bg-accent-blue text-text-primary text-sm font-medium hover:bg-accent-blue-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
