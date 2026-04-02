import React from 'react'
import ProjectCard from './ProjectCard'

interface Project {
  title: string
  category: string
  package: string
  gradientFrom: string
  gradientTo: string
}

const projects: Project[] = [
  {
    title: 'Local Clinic',
    category: 'Healthcare',
    package: 'Starter Package',
    gradientFrom: '#4169FF',
    gradientTo: '#7B68EE',
  },
  {
    title: 'Restaurant Zurich',
    category: 'Hospitality',
    package: 'Business Package',
    gradientFrom: '#8B5CF6',
    gradientTo: '#EC4899',
  },
  {
    title: 'Freelance Consultant',
    category: 'Consulting',
    package: 'Starter Package',
    gradientFrom: '#10B981',
    gradientTo: '#3B82F6',
  },
]

export default function ProjectGrid() {
  return (
    <section className="w-full bg-background-primary py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Note for development */}
        <div className="mb-8 p-4 bg-background-surface border border-border-default">
          <p className="text-sm text-text-muted">
            <strong className="text-text-secondary">Note:</strong> These are placeholder projects with gradient backgrounds.
            Replace with real client screenshots post-launch.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
    </section>
  )
}
