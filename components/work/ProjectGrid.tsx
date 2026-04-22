import React from 'react'
import ProjectCard from './ProjectCard'

const projects = [
  {
    title: 'Core Medical',
    subtitle: 'Private health management practice — Zurich, Switzerland',
    category: 'Healthcare',
    scope: ['Design', 'Development', 'CMS', 'Hosting'],
    url: 'https://coremedical.ch',
    image: '/work/core-medical.jpg',
    featured: true,
  },
  {
    title: 'LucasVision',
    subtitle: 'Cinematic photo & video studio — Switzerland',
    category: 'Photography & Film',
    scope: ['Design', 'Development', 'CMS', 'Video'],
    url: 'https://lucasvision.vercel.app',
    image: '/work/lucasvision-mobile.png',
    featured: false,
  },
  {
    title: 'Ääriviiva',
    subtitle: 'Graphic design studio — Virpi Loukamaa, Finland',
    category: 'Graphic Design',
    scope: ['Design', 'Development', 'CMS', 'Bilingual'],
    url: 'https://aariviiva.vercel.app',
    image: '/work/aariviiva-mobile.png',
    featured: false,
  },
]

export default function ProjectGrid() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section className="w-full py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Featured — full-bleed editorial */}
        {featured.map((project) => (
          <div key={project.title} className="mb-20 md:mb-28">
            <ProjectCard {...project} />
          </div>
        ))}

        <div className="divider-gradient mb-16 md:mb-20" />

        {/* 2-col — flat editorial grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {rest.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        )}

        {/* Coming soon — editorial footnote */}
        <div className="mt-24 md:mt-32 border-t border-[color:var(--border-subtle)] pt-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p className="eyebrow mb-4">Coming soon</p>
            <p className="display text-xl md:text-2xl text-[color:var(--ink)] max-w-[40ch] leading-tight">
              More projects in the works — each one custom-built for its industry,{' '}
              <span className="serif-italic text-[color:var(--accent)]">never from a template.</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
