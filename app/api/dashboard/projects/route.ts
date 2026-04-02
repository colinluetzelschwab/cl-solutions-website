import { NextRequest, NextResponse } from 'next/server'

/**
 * Dashboard projects API — proxies to Vercel API
 *
 * Environment variables required:
 * - VERCEL_API_TOKEN: Vercel API token for authentication
 * - VERCEL_TEAM_ID: Vercel team ID (team_5jgjr0GiHPXdc0MEOa2kqjcN)
 */

interface VercelDeployment {
  readyState: string
  createdAt: number
  url: string
}

interface VercelTarget {
  alias?: string[]
}

interface VercelProject {
  id: string
  name: string
  framework: string | null
  latestDeployments?: VercelDeployment[]
  targets?: {
    production?: VercelTarget
  }
  link?: {
    type: string
    repo: string
    org: string
  }
  updatedAt: number
}

interface VercelProjectsResponse {
  projects: VercelProject[]
}

interface ProjectSummary {
  id: string
  name: string
  framework: string | null
  status: string
  url: string | null
  lastDeployedAt: string | null
  repo: string | null
}

function isAuthenticated(request: NextRequest): boolean {
  return request.cookies.get('dashboard_auth')?.value === 'true'
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = process.env.VERCEL_API_TOKEN
  const teamId = process.env.VERCEL_TEAM_ID

  if (!token || !teamId) {
    return NextResponse.json(
      { error: 'Vercel API not configured' },
      { status: 500 }
    )
  }

  try {
    const response = await fetch(
      `https://api.vercel.com/v9/projects?teamId=${teamId}&limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      console.error('Vercel API error:', response.status, response.statusText)
      return NextResponse.json(
        { error: 'Failed to fetch projects from Vercel' },
        { status: 502 }
      )
    }

    const data = (await response.json()) as VercelProjectsResponse

    const projects: ProjectSummary[] = data.projects.map((project) => {
      const latestDeploy = project.latestDeployments?.[0]
      const productionAlias = project.targets?.production?.alias?.[0]
      const deployUrl = productionAlias
        ? `https://${productionAlias}`
        : latestDeploy?.url
          ? `https://${latestDeploy.url}`
          : null

      return {
        id: project.id,
        name: project.name,
        framework: project.framework,
        status: latestDeploy?.readyState ?? 'UNKNOWN',
        url: deployUrl,
        lastDeployedAt: latestDeploy?.createdAt
          ? new Date(latestDeploy.createdAt).toISOString()
          : null,
        repo: project.link
          ? `${project.link.org}/${project.link.repo}`
          : null,
      }
    })

    return NextResponse.json({ projects })
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
