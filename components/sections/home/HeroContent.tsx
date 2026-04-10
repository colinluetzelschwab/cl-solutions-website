'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
}

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
}

export default function HeroContent() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero/hero-bg.jpg"
        alt=""
        fill
        className="object-cover"
        priority
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content — bottom-left aligned */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 min-h-screen flex items-end pb-16 md:pb-24 px-6 sm:px-10 lg:px-16"
      >
        <div className="max-w-4xl">
          {/* Label */}
          <motion.p
            variants={fadeUpVariant}
            className="text-sm md:text-base text-white/50 uppercase tracking-[0.25em] mb-6 md:mb-8"
          >
            Web Design Studio · Switzerland
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUpVariant}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] font-semibold text-white tracking-[-0.03em] leading-[1.05] mb-6 md:mb-8"
          >
            We build websites
            <br />
            that{' '}
            <span className="text-[#C8956C]">win clients.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUpVariant}
            className="text-lg md:text-xl lg:text-2xl text-white/60 max-w-2xl mb-10 md:mb-14 leading-relaxed"
          >
            Premium websites for Swiss businesses. Fixed price. Ready in days, not months.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUpVariant}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-[#C8956C] text-white hover:bg-[#b8855c] font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300"
              >
                Start Your Project
              </Button>
            </Link>
            <Link href="/work">
              <Button
                size="lg"
                variant="outline"
                className="border border-white/30 text-white hover:bg-white/10 hover:border-white/60 font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300"
              >
                View Our Work
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator — bottom center */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
        <motion.div
          animate={{ height: ['12px', '24px', '12px'] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-px bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  )
}
