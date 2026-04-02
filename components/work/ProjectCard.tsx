'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface ProjectCardProps {
  title: string
  category: string
  package: string
  gradientFrom: string
  gradientTo: string
}

export default function ProjectCard({
  title,
  category,
  package: packageType,
  gradientFrom,
  gradientTo,
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-background-surface border border-border-default overflow-hidden cursor-pointer"
    >
      {/* Image Placeholder - will be replaced with real screenshots */}
      <div
        className="aspect-[4/3] w-full relative"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-background-primary/0 group-hover:bg-background-primary/80 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-6">
            <p className="text-text-primary font-medium text-lg mb-2">{title}</p>
            <p className="text-text-secondary text-sm">
              {category} · {packageType}
            </p>
          </div>
        </div>

        {/* Note: Replace with real images */}
        <div className="absolute bottom-4 right-4 opacity-40 text-text-muted text-xs bg-background-primary/50 px-2 py-1">
          Placeholder
        </div>
      </div>

      {/* Project Info */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span>{category}</span>
          <span>·</span>
          <span>{packageType}</span>
        </div>
      </div>
    </motion.div>
  )
}
