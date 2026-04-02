'use client'

import { useState, useEffect } from 'react'
import {
  FolderKanban,
  FileText,
  Activity,
  Loader2,
} from 'lucide-react'

interface Project {
  id: string
  name: string
  framework: string | null
  status: string
  url: string | null
  lastDeployedAt: string | null
}

interface BriefSummary {
  id: string
  clientName: string
  packageId: string
  totalPrice: number
  createdAt: string
}

interface SummaryCard {
  label: string
  value: string
  icon: React.ReactNode
}

export default function OverviewPanel() {
  const [projects, setProjects] = useState<Project[]>([])
  const [briefs, setBriefs] = useState<BriefSummary[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const [projectsRes, briefsRes] = await Promise.all([
          fetch('/api/dashboard/projects'),
          fetch('/api/dashboard/briefs'),
        ])

        if (projectsRes.ok) {
          const data = (await projectsRes.json()) as { projects: Project[] }
          setProjects(data.projects)
        }
        if (briefsRes.ok) {
          const data = (await briefsRes.json()) as { briefs: BriefSummary[] }
          setBriefs(data.briefs)
        }
      } catch {
        // Silently fail — panels will show their own errors
      } finally {
        setIsLoading(false)
      }
    }
    void fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-5 h-5 text-text-muted animate-spin" />
      </div>
    )
  }

  const activeDeployments = projects.filter(
    (p) => p.status === 'READY'
  ).length

  const summaryCards: SummaryCard[] = [
    {
      label: 'Total Projects',
      value: String(projects.length),
      icon: <FolderKanban className="w-5 h-5 text-accent-blue" />,
    },
    {
      label: 'Active Deployments',
      value: String(activeDeployments),
      icon: <Activity className="w-5 h-5 text-green-400" />,
    },
    {
      label: 'Total Briefs',
      value: String(briefs.length),
      icon: <FileText className="w-5 h-5 text-yellow-400" />,
    },
  ]

  const recentBriefs = briefs.slice(0, 5)
  const recentProjects = projects.slice(0, 5)

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-background-surface border border-border-subtle p-4 flex items-center gap-4"
          >
            <div className="flex items-center justify-center w-10 h-10 bg-background-elevated">
              {card.icon}
            </div>
            <div>
              <p className="text-2xl font-semibold text-text-primary">
                {card.value}
              </p>
              <p className="text-xs text-text-muted">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Recent Projects
        </h3>
        <div className="bg-background-surface border border-border-subtle divide-y divide-border-subtle">
          {recentProjects.map((project) => (
            <div key={project.id} className="px-4 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-text-primary truncate">{project.name}</p>
                <p className="text-xs text-text-muted">{project.framework ?? '--'}</p>
              </div>
              <span
                className={`text-xs font-medium ${
                  project.status === 'READY'
                    ? 'text-green-400'
                    : project.status === 'ERROR'
                      ? 'text-red-400'
                      : 'text-text-muted'
                }`}
              >
                {project.status === 'READY' ? 'Ready' : project.status}
              </span>
            </div>
          ))}
          {recentProjects.length === 0 && (
            <p className="px-4 py-6 text-sm text-text-muted text-center">
              No projects found.
            </p>
          )}
        </div>
      </div>

      {/* Recent briefs */}
      <div>
        <h3 className="text-sm font-semibold text-text-primary mb-3">
          Recent Briefs
        </h3>
        <div className="bg-background-surface border border-border-subtle divide-y divide-border-subtle">
          {recentBriefs.map((brief) => (
            <div key={brief.id} className="px-4 py-3 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-text-primary truncate">{brief.clientName}</p>
                <p className="text-xs text-text-muted">
                  {new Date(brief.createdAt).toLocaleDateString('en-CH', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <span className="text-xs font-medium text-text-secondary">
                CHF {brief.totalPrice.toLocaleString('de-CH')}
              </span>
            </div>
          ))}
          {recentBriefs.length === 0 && (
            <p className="px-4 py-6 text-sm text-text-muted text-center">
              No briefs submitted yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
