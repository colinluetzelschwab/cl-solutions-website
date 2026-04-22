import React from 'react'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'

interface ProjectCardProps {
  title: string
  subtitle: string
  category: string
  scope: string[]
  url?: string
  image: string
  imageSwap?: string
  featured?: boolean
}

// Editorial project card with Ravi's dual-image hover swap.
// No overlays, no card borders — just hairline frame + crossfade.

export default function ProjectCard({
  title,
  subtitle,
  category,
  scope,
  url,
  image,
  imageSwap,
  featured,
}: ProjectCardProps) {
  const swap = imageSwap ?? image
  return (
    <a
      href={url || '#'}
      target={url ? '_blank' : undefined}
      rel={url ? 'noopener noreferrer' : undefined}
      className="group block"
    >
      {/* Image panel — dual-image hover only when a swap is provided */}
      <div
        className={`${imageSwap ? 'dual-img ' : ''}relative overflow-hidden border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)] ${
          featured ? 'aspect-[16/9]' : 'aspect-[4/5]'
        }`}
      >
        <Image
          src={image}
          alt={title}
          fill
          sizes={featured ? '(max-width: 1024px) 100vw, 80vw' : '(max-width: 768px) 100vw, 40vw'}
          className={`${imageSwap ? 'dual-img__base ' : ''}object-cover object-top`}
          priority={featured}
        />
        {imageSwap && (
          <Image
            src={swap}
            alt=""
            fill
            sizes={featured ? '(max-width: 1024px) 100vw, 80vw' : '(max-width: 768px) 100vw, 40vw'}
            className="dual-img__swap object-cover"
            aria-hidden
            loading="lazy"
          />
        )}
        {url && (
          <div className="absolute top-4 right-4 inline-flex items-center justify-center h-9 w-9 rounded-full bg-[color:var(--paper-dark)]/85 border border-[color:var(--border-subtle)] backdrop-blur-md text-[color:var(--ink)] opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Editorial caption — Lolo minimal metadata */}
      <div className="mt-5 flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <p className="eyebrow mb-2">{category}</p>
          <h3 className="display text-xl md:text-2xl text-[color:var(--ink)] leading-tight group-hover:text-[color:var(--accent)] transition-colors">
            {title}
          </h3>
          <p className="mt-1.5 text-sm text-[color:var(--ink-muted)] leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="hidden md:flex flex-wrap gap-1.5 pt-5 justify-end">
          {scope.slice(0, 3).map((item) => (
            <span key={item} className="chip chip-quiet !text-[10px] !tracking-[0.16em]">
              {item}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
