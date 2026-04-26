import React from 'react'
import { useTranslations } from 'next-intl'
import ProjectCard from './ProjectCard'

// Layout-only metadata. Subtitle + category strings live in
// `messages/{en,de,fi}.json` under `WorkPage.projects.{id}.*`; scope-tag
// strings under `WorkPage.scope.*` (so a tag like "Development" only
// translates once even when reused across projects).
type ProjectId = 'coreMedical' | 'veloscout' | 'lucasvision' | 'aariviiva'
type ScopeKey = 'design' | 'development' | 'cms' | 'hosting' | 'marketplace' | 'video' | 'bilingual'

interface Project {
  id: ProjectId
  /** Brand name — kept identical across all locales (proper nouns) */
  title: string
  scope: readonly ScopeKey[]
  url?: string
  image: string
  imageSwap?: string
  featured?: boolean
}

const projects: readonly Project[] = [
  {
    id: 'coreMedical',
    title: 'Core Medical',
    scope: ['design', 'development', 'cms', 'hosting'],
    url: 'https://coremedical.ch',
    image: '/work/core-medical.jpg',
    featured: true,
  },
  {
    id: 'veloscout',
    title: 'Veloscout',
    scope: ['design', 'development', 'cms', 'marketplace'],
    url: 'https://www.veloscout.ch',
    image: '/work/veloscout.png',
    featured: true,
  },
  {
    id: 'lucasvision',
    title: 'LucasVision',
    scope: ['design', 'development', 'cms', 'video'],
    url: 'https://lucasvision.vercel.app',
    image: '/work/lucasvision-mobile.png',
    featured: false,
  },
  {
    id: 'aariviiva',
    title: 'Ääriviiva',
    scope: ['design', 'development', 'cms', 'bilingual'],
    url: 'https://aariviiva.vercel.app',
    image: '/work/aariviiva-mobile.png',
    featured: false,
  },
] as const

export default function ProjectGrid() {
  const tProj = useTranslations('WorkPage.projects')
  const tScope = useTranslations('WorkPage.scope')
  const tComing = useTranslations('WorkPage.comingSoon')

  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  // Resolve translated strings for each project — title stays as-is (brand
  // name), subtitle + category + scope tags come from message files.
  const localize = (project: Project) => ({
    title: project.title,
    subtitle: tProj(`${project.id}.subtitle`),
    category: tProj(`${project.id}.category`),
    scope: project.scope.map((s) => tScope(s)),
    url: project.url,
    image: project.image,
    imageSwap: project.imageSwap,
    featured: project.featured,
  })

  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Featured — full-bleed editorial */}
        {featured.map((project) => (
          <div key={project.id} className="mb-20 md:mb-28">
            <ProjectCard {...localize(project)} />
          </div>
        ))}

        <div className="divider-gradient mb-16 md:mb-20" />

        {/* 2-col — flat editorial grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {rest.map((project) => (
              <ProjectCard key={project.id} {...localize(project)} />
            ))}
          </div>
        )}

        {/* Coming soon — editorial footnote */}
        <div className="mt-24 md:mt-32 border-t border-[color:var(--border-subtle)] pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">{tComing('eyebrow')}</p>
            <p className="display text-xl md:text-2xl text-[color:var(--ink)] max-w-[40ch] leading-tight">
              {tComing('lead')}{' '}
              <span className="serif-italic text-[color:var(--accent)]">{tComing('emphasis')}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
