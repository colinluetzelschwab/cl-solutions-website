'use client'

import { useState, useEffect } from 'react'
import {
  ExternalLink,
  RefreshCw,
  Circle,
  AlertCircle,
  Loader2,
} from 'lucide-react'

interface Project {
  id: string
  name: string
  framework: string | null
  status: string
  url: string | null
  lastDeployedAt: string | null
  repo: string | null
}

function statusColor(status: string): string {
  switch (status) {
    case 'READY':
      return 'text-green-400'
    case 'BUILDING':
    case 'INITIALIZING':
    case 'QUEUED':
      return 'text-yellow-400'
    case 'ERROR':
    case 'CANCELED':
      return 'text-red-400'
    default:
      return 'text-text-muted'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'READY':
      return 'Ready'
    case 'BUILDING':
      return 'Building'
    case 'INITIALIZING':
      return 'Initializing'
    case 'QUEUED':
      return 'Queued'
    case 'ERROR':
      return 'Error'
    case 'CANCELED':
      return 'Canceled'
    default:
      return status
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return '--'
  const date = new Date(iso)
  return date.toLocaleDateString('en-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ProjectsPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  async function fetchProjects() {
    setIsLoading(true)
    setError('')
    try {
      const response = await fetch('/api/dashboard/projects')
      if (!response.ok) {
        const data = (await response.json()) as { error: string }
        throw new Error(data.error || 'Failed to fetch')
      }
      const data = (await response.json()) as { projects: Project[] }
      setProjects(data.projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchProjects()
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
          onClick={() => void fetchProjects()}
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
          Projects ({projects.length})
        </h2>
        <button
          onClick={() => void fetchProjects()}
          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-background-surface border border-border-subtle p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-text-primary truncate">
                  {project.name}
                </h3>
                {project.framework && (
                  <p className="text-xs text-text-muted mt-0.5">
                    {project.framework}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Circle
                  className={`w-2.5 h-2.5 fill-current ${statusColor(project.status)}`}
                />
                <span className={`text-xs font-medium ${statusColor(project.status)}`}>
                  {statusLabel(project.status)}
                </span>
              </div>
            </div>

            <div className="text-xs text-text-muted">
              {project.lastDeployedAt
                ? `Deployed ${formatDate(project.lastDeployedAt)}`
                : 'Never deployed'}
            </div>

            <div className="flex items-center gap-2 mt-auto pt-1">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-accent-blue hover:text-accent-blue-hover transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Visit
                </a>
              )}
              <a
                href={`https://vercel.com/${process.env.NEXT_PUBLIC_VERCEL_TEAM_SLUG ?? ''}/${project.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Vercel
              </a>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <p className="text-sm text-text-muted text-center py-10">
          No projects found.
        </p>
      )}
    </div>
  )
}
