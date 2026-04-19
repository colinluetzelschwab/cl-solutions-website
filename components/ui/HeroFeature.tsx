'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

interface Feature {
  image: string
  client: string
  sector: string
  href: string
}

const features: Feature[] = [
  {
    image: '/work/core-medical.jpg',
    client: 'Core Medical',
    sector: 'Healthcare · Zürich',
    href: 'https://coremedical.ch',
  },
  {
    image: '/work/lucasvision.jpg',
    client: 'LucasVision',
    sector: 'Photo &amp; Film · CH',
    href: 'https://lucasvision.vercel.app',
  },
  {
    image: '/work/aariviiva.jpg',
    client: 'Ääriviiva',
    sector: 'Graphic Design · FI',
    href: 'https://aariviiva.vercel.app',
  },
]

const INTERVAL_MS = 5500

// Auto-rotating cinematic feature — single vertical image column that
// crossfades through real client captures, with a subtle Ken Burns zoom
// per slide. Editorial caption sits below. Tom Carder × Lolo signature.

export default function HeroFeature() {
  const [idx, setIdx] = useState(0)
  const current = features[idx]

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % features.length), INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="w-full">
      {/* Image panel */}
      <div
        className="relative w-full aspect-[3/4] overflow-hidden rounded-[12px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-2)]"
        role="region"
        aria-label="Recent work — rotating showcase"
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1 }}
              animate={{ scale: 1.07 }}
              transition={{ duration: INTERVAL_MS / 1000 + 1, ease: 'linear' }}
            >
              <Image
                src={current.image}
                alt={current.client}
                fill
                sizes="(max-width: 1024px) 80vw, 35vw"
                className="object-cover"
                priority={idx === 0}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Counter — top right */}
        <div className="absolute top-3 right-3 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-[var(--font-plex-mono)] tracking-[0.22em] uppercase text-[color:var(--ink)] bg-[color:var(--paper-dark)]/72 backdrop-blur-[6px] border border-[color:var(--border-subtle)] tabular">
            {String(idx + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
          </span>
        </div>

        {/* Progress bars — bottom */}
        <div className="absolute bottom-3 left-3 right-3 z-10 flex gap-1.5 pointer-events-none">
          {features.map((_, i) => (
            <div
              key={i}
              className="h-[2px] flex-1 overflow-hidden rounded-full bg-[color:var(--paper-dark)]/25"
            >
              {i === idx && (
                <motion.div
                  key={idx}
                  className="h-full bg-[color:var(--accent)] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
                />
              )}
              {i < idx && <div className="h-full w-full bg-[color:var(--accent)]/60" />}
            </div>
          ))}
        </div>
      </div>

      {/* Editorial caption */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 flex items-start justify-between gap-4"
        >
          <div className="min-w-0">
            <p className="display text-lg md:text-xl text-[color:var(--ink)] truncate">
              {current.client}
            </p>
            <p
              className="eyebrow mt-1"
              // dangerouslySetInnerHTML avoids re-rendering entities inside the sector string
              dangerouslySetInnerHTML={{ __html: current.sector }}
            />
          </div>
          <Link
            href={current.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-[color:var(--ink-muted)] hover:text-[color:var(--accent)] transition-colors shrink-0 group"
          >
            <span className="eyebrow group-hover:text-[color:var(--accent)] transition-colors">Visit</span>
            <ArrowUpRight className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
