'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HeroContent() {
  return (
    <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Label with animated underline */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8 md:mb-10"
        >
          <p className="text-sm md:text-base text-text-muted uppercase tracking-[0.25em] mb-3">
            Swiss Web Agency
          </p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="mx-auto w-12 h-px animated-line"
          />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-semibold text-text-primary mb-6 md:mb-8 tracking-[-0.02em] leading-[1.05]"
        >
          Websites that
          <br />
          make you look{' '}
          <span className="text-shimmer">serious.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
          className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 md:mb-14 leading-relaxed"
        >
          We build fast, premium websites for Swiss businesses. Fixed price.
          3–5 day delivery. No templates.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20"
        >
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-accent-blue text-text-primary hover:bg-accent-blue-hover font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300 glow-pulse"
            >
              Get a Quote
            </Button>
          </Link>
          <Link href="/work">
            <Button
              size="lg"
              variant="outline"
              className="border border-text-primary/30 text-text-primary hover:bg-text-primary/10 hover:border-text-primary/60 font-medium px-10 h-13 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-300"
            >
              See Our Work
            </Button>
          </Link>
        </motion.div>

        {/* Scroll Indicator — minimal line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted/50">Scroll</span>
          <motion.div
            animate={{ height: ['12px', '24px', '12px'] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="w-px bg-gradient-to-b from-text-muted/50 to-transparent"
          />
        </motion.div>
      </div>
    </div>
  )
}
