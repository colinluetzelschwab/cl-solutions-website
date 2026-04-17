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
    image: '/work/lucasvision.jpg',
    featured: false,
  },
  {
    title: 'Ääriviiva',
    subtitle: 'Graphic design studio — Virpi Loukamaa, Finland',
    category: 'Graphic Design',
    scope: ['Design', 'Development', 'CMS', 'Bilingual'],
    url: 'https://aariviiva.vercel.app',
    image: '/work/aariviiva.jpg',
    featured: false,
  },
]

export default function ProjectGrid() {
  const featured = projects.filter((p) => p.featured)
  const rest = projects.filter((p) => !p.featured)

  return (
    <section className="w-full bg-background-primary py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Featured project */}
        {featured.map((project) => (
          <div key={project.title} className="mb-20 md:mb-28">
            <ProjectCard {...project} />
          </div>
        ))}

        {/* 2-col grid for remaining projects */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
            {rest.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        )}

        {/* More coming */}
        <div className="border-t border-border-default pt-12 mt-20 md:mt-28">
          <p className="text-[10px] text-text-muted tracking-[0.25em] uppercase mb-3">
            Coming soon
          </p>
          <p className="text-text-secondary text-base max-w-md">
            More projects are in the works. Each one custom-built for its industry,
            never from a template.
          </p>
        </div>
      </div>
    </section>
  )
}
