import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function HeroContent() {
  return (
    <section className="relative w-full bg-background-primary">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 pt-28 md:pt-32 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[78svh]">
          {/* LEFT — editorial statement */}
          <div className="lg:col-span-7">
            <p className="font-mono text-[10px] md:text-[11px] text-text-muted tracking-[0.3em] uppercase mb-8 md:mb-12">
              CL Solutions — Swiss website studio
            </p>

            <h1 className="text-[clamp(2.6rem,7.2vw,6.2rem)] font-light text-text-primary leading-[0.98] tracking-[-0.035em]">
              Websites that carry
              <br />
              <span className="font-[family-name:var(--font-display)] italic font-normal text-[#C8956C]">
                their own weight.
              </span>
            </h1>

            <p className="mt-8 md:mt-10 max-w-md text-base md:text-lg text-text-secondary leading-[1.65]">
              A small Swiss studio. We build quiet, deliberate websites
              for businesses that would rather be understood than loud.
            </p>

            <div className="mt-10 md:mt-14">
              <Link
                href="/contact/start"
                className="group inline-flex items-center gap-3 px-7 py-4 text-sm font-medium bg-text-primary text-background-primary hover:bg-text-primary/90 transition-colors duration-200"
              >
                Start a project
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* RIGHT — single ambient photo panel */}
          <div className="lg:col-span-5 relative w-full h-[60svh] lg:h-[72svh] overflow-hidden">
            <Image
              src="/images/hero/swiss-mountains.jpeg"
              alt="Swiss mountains"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
              style={{ objectPosition: 'center 30%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
