'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

const fade = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
}

function useTime() {
  const [t, setT] = useState('')
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' }))
    tick()
    const iv = setInterval(tick, 30000)
    return () => clearInterval(iv)
  }, [])
  return t
}

function Grain() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return
    c.width = 200; c.height = 200
    const d = ctx.createImageData(200, 200)
    for (let i = 0; i < d.data.length; i += 4) {
      const v = Math.random() * 255
      d.data[i] = v; d.data[i + 1] = v; d.data[i + 2] = v; d.data[i + 3] = 10
    }
    ctx.putImageData(d, 0, 0)
  }, [])
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-20" style={{ mixBlendMode: 'overlay' }} aria-hidden="true" />
}

export default function HeroContent() {
  const time = useTime()

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-background-primary">
      <Grain />

      {/* Image — right side on desktop, behind text on mobile */}
      <div className="absolute inset-0 z-0">
        {/* Image positioned right */}
        <div className="absolute top-0 right-0 w-full md:w-[55%] h-full">
          <Image
            src="/images/hero/swiss-mountains.jpg"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 55vw"
          />
          {/* Blend into cream bg — gradient from left */}
          <div className="absolute inset-0 bg-gradient-to-r from-background-primary via-background-primary/90 md:via-background-primary/70 to-transparent" />
          {/* Bottom blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-background-primary via-transparent to-background-primary/30" />
          {/* Desaturate + warm tint */}
          <div className="absolute inset-0 bg-background-primary/20 mix-blend-color" />
        </div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={container} className="relative z-10 min-h-[100svh] flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-28 md:pt-32 pb-10 md:pb-14">
        {/* Top — location + time */}
        <motion.div variants={fade} className="flex items-center justify-between">
          <span className="text-[10px] md:text-[11px] text-text-muted tracking-[0.25em] uppercase">Zurich, Switzerland</span>
          <span className="text-[10px] md:text-[11px] text-text-muted tracking-[0.25em] tabular-nums font-mono">{time} CET</span>
        </motion.div>

        {/* Center — big statement */}
        <div className="flex-1 flex items-center">
          <div className="max-w-5xl py-16 md:py-0">
            <motion.h1 variants={fade} className="text-[clamp(2.8rem,8vw,6.5rem)] font-light text-text-primary leading-[0.95] tracking-[-0.03em]">
              We design websites
              <br />
              that make businesses
              <br />
              <span className="font-[family-name:var(--font-display)] italic font-normal text-[#C8956C]">
                grow.
              </span>
            </motion.h1>

            <motion.p variants={fade} className="text-base md:text-lg text-text-secondary max-w-md leading-relaxed mt-8 md:mt-12">
              Premium websites for Swiss businesses. Fixed price. Ready in days, not months.
            </motion.p>

            <motion.div variants={fade} className="flex flex-col sm:flex-row items-start gap-3 mt-10 md:mt-14">
              <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium bg-text-primary text-background-primary hover:bg-text-primary/90 transition-colors group">
                Start a project
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/work" className="inline-flex items-center gap-2 px-8 py-4 text-sm text-text-secondary hover:text-text-primary transition-colors">
                See our work
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom — minimal stats */}
        <motion.div variants={fade} className="flex gap-12 md:gap-20 pt-8 border-t border-border-subtle">
          {[
            ['Delivery', '3–5 days'],
            ['From', 'CHF 1,500'],
            ['Based in', 'Switzerland'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-[9px] md:text-[10px] text-text-muted tracking-[0.2em] uppercase mb-1">{label}</p>
              <p className="text-xs md:text-sm text-text-primary">{value}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
