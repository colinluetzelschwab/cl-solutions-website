'use client'

import React, { useEffect, useRef, useState } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
}

const directionTransforms = {
  up: 'translateY(30px)',
  down: 'translateY(-30px)',
  left: 'translateX(30px)',
  right: 'translateX(-30px)',
  none: 'translate(0)',
}

function useIntersection(once = true) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )

    observer.observe(el)

    // Safety fallback: under Lenis smooth scroll the observer can miss
    // elements that enter and leave the viewport within a single animation
    // frame, leaving them permanently invisible. Reveal anyway after 900ms.
    const fallback = window.setTimeout(() => {
      setIsVisible(true)
      observer.disconnect()
    }, 900)

    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [once])

  // After React commits the reveal, force a reflow. Chrome occasionally
  // skips painting the opacity/transform transition when the element was
  // not in the initial viewport at the moment the style changed, leaving
  // it stuck at opacity:0 despite inline style saying opacity:1. Toggling
  // display forces the compositor to recommit the new state.
  useEffect(() => {
    if (!isVisible) return
    const el = ref.current
    if (!el) return
    const prev = el.style.display
    el.style.display = 'none'
    void el.offsetHeight
    el.style.display = prev
  }, [isVisible])

  return { ref, isVisible }
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
}: ScrollRevealProps) {
  const { ref, isVisible } = useIntersection(once)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : directionTransforms[direction],
        transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.1,
}: StaggerContainerProps) {
  const { ref, isVisible } = useIntersection(true)

  let staggerIndex = 0

  return (
    <div ref={ref} className={className}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === StaggerItem) {
          const currentIndex = staggerIndex++
          return React.cloneElement(child as React.ReactElement<{ isVisible?: boolean; delay?: number }>, {
            isVisible,
            delay: currentIndex * staggerDelay,
          })
        }
        return child
      })}
    </div>
  )
}

export function StaggerItem({
  children,
  className,
  direction = 'up',
  duration = 0.5,
  isVisible = false,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  isVisible?: boolean
  delay?: number
}) {
  return (
    <div
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : directionTransforms[direction],
        transition: `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}
