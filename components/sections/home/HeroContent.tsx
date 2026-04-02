'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function HeroContent() {
  return (
    <div className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Label */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <p className="text-sm md:text-base text-text-muted uppercase tracking-[0.2em] mb-6 md:mb-8">
            Swiss Web Agency
          </p>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.15 }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-text-primary mb-6 md:mb-8"
        >
          Websites that
          <br />
          make you look{' '}
          <span className="text-accent-blue">serious.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.3 }}
          className="text-lg md:text-xl lg:text-2xl text-text-secondary max-w-3xl mx-auto mb-10 md:mb-12"
        >
          We build fast, premium websites for Swiss businesses. Fixed price.
          3–5 day delivery. No templates.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUpVariant}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 md:mb-20"
        >
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-accent-blue text-text-primary hover:bg-accent-blue-hover font-medium px-8 h-12 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-colors duration-200"
            >
              Get a Quote
            </Button>
          </Link>
          <Link href="/work">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-text-primary text-text-primary hover:bg-text-primary hover:text-background-primary font-medium px-8 h-12 md:h-14 text-base md:text-lg rounded-none w-full sm:w-auto transition-all duration-200"
            >
              See Our Work
            </Button>
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ChevronDown className="w-6 h-6 md:w-8 md:h-8 text-text-muted" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
