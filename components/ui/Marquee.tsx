'use client'

import React from 'react'

interface MarqueeProps {
  children: React.ReactNode
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
  fade?: boolean
}

// Horizontal infinite marquee. Content is rendered twice for a seamless
// translate(-50%) loop (`@keyframes ticker` defined in globals.css).
export default function Marquee({
  children,
  reverse = false,
  className = '',
  pauseOnHover = true,
  fade = true,
}: MarqueeProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={
        fade
          ? {
              // Soften edges so the seam is invisible
              WebkitMaskImage:
                'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
              maskImage:
                'linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)',
            }
          : undefined
      }
    >
      <div
        className={`flex w-max items-center gap-8 whitespace-nowrap will-change-transform ${
          reverse ? 'animate-ticker-reverse' : 'animate-ticker'
        } ${pauseOnHover ? 'hover:[animation-play-state:paused]' : ''}`}
      >
        <div className="flex items-center gap-8">{children}</div>
        <div aria-hidden className="flex items-center gap-8">{children}</div>
      </div>
    </div>
  )
}
