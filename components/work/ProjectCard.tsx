'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'
import ScrollReveal from '@/components/ui/scroll-reveal'

interface ProjectCardProps {
  title: string
  subtitle: string
  category: string
  scope: string[]
  url?: string
  image: string
  featured?: boolean
}

export default function ProjectCard({
  title,
  subtitle,
  category,
  scope,
  url,
  image,
  featured,
}: ProjectCardProps) {
  return (
    <ScrollReveal>
      <a
        href={url || '#'}
        target={url ? '_blank' : undefined}
        rel={url ? 'noopener noreferrer' : undefined}
        className="group block"
      >
        {/* Image */}
        <div className="relative overflow-hidden mb-6">
          <div
            className={`w-full bg-cover bg-center bg-background-surface transition-transform duration-700 group-hover:scale-[1.02] ${
              featured ? 'aspect-[16/9]' : 'aspect-[4/3]'
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
          {url && (
            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-text-primary/0 group-hover:bg-text-primary flex items-center justify-center transition-all duration-300">
              <ArrowUpRight className="w-4 h-4 text-transparent group-hover:text-background-primary transition-colors duration-300" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] text-text-muted tracking-[0.25em] uppercase mb-2">
              {category}
            </p>
            <h3 className="text-xl md:text-2xl font-light text-text-primary tracking-tight mb-1">
              {title}
            </h3>
            <p className="text-sm text-text-secondary">
              {subtitle}
            </p>
          </div>
          <div className="hidden md:flex flex-wrap gap-2 mt-1">
            {scope.map((item) => (
              <span
                key={item}
                className="text-[10px] text-text-muted tracking-[0.15em] uppercase border border-border-default px-3 py-1"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </a>
    </ScrollReveal>
  )
}
