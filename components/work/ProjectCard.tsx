'use client'

import React from 'react'

interface ProjectCardProps {
  title: string
  category: string
  package: string
  image: string
}

export default function ProjectCard({
  title,
  category,
  package: packageType,
  image,
}: ProjectCardProps) {
  return (
    <div className="group relative bg-background-surface border border-border-default overflow-hidden transition-transform duration-200 hover:scale-[1.02]">
      <div
        className="aspect-[4/3] w-full relative bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-background-primary/0 group-hover:bg-background-primary/80 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-6">
            <p className="text-text-primary font-medium text-lg mb-2">{title}</p>
            <p className="text-text-secondary text-sm">
              {category} · {packageType}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span>{category}</span>
          <span>·</span>
          <span>{packageType}</span>
        </div>
      </div>
    </div>
  )
}
