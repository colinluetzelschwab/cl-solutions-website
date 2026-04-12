'use client'

import React from 'react'
import ProjectCard from './ProjectCard'
import ScrollReveal from '@/components/ui/scroll-reveal'

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
]

export default function ProjectGrid() {
  return (
    <section className="w-full bg-background-primary py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16">
        {/* Featured project */}
        {projects.filter(p => p.featured).map((project) => (
          <div key={project.title} className="mb-20">
            <ProjectCard {...project} />
          </div>
        ))}

        {/* More coming */}
        <ScrollReveal>
          <div className="border-t border-border-default pt-12">
            <p className="text-[10px] text-text-muted tracking-[0.25em] uppercase mb-3">
              Coming soon
            </p>
            <p className="text-text-secondary text-base max-w-md">
              More projects are in the works. Each one custom-built for its industry,
              never from a template.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
