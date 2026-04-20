import React from 'react'

interface Step {
  n: string
  title: string
  text: string
  marker: string
}

const steps: Step[] = [
  { n: '01', title: 'Brief',  text: 'You tell us about your business, your goals, and your timeline.', marker: 'Day 0' },
  { n: '02', title: 'Plan',   text: 'We map out every page and section before writing a single line of code.', marker: 'Day 1' },
  { n: '03', title: 'Build',  text: 'Your site is built in 3–5 days. You get progress updates along the way.', marker: 'Day 2–4' },
  { n: '04', title: 'Launch', text: 'We connect your domain, go live, and hand over the keys.', marker: 'Day 5' },
]

export default function Process() {
  return (
    <section className="relative w-full py-24 md:py-32 border-t border-[color:var(--border-subtle)]">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-16 md:mb-20">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-6">Chapter II — Process</p>
            <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]">
              From brief to launch,{' '}
              <span className="serif-italic text-[color:var(--ink-soft)]">in four moves.</span>
            </h2>
          </div>
        </div>

        {/* Ledger timeline — giant cyan tabular numbers, tight rows */}
        <ol className="border-t border-[color:var(--border-default)]">
          {steps.map((step, i) => (
            <li
              key={step.n}
              className={`group grid grid-cols-[auto_1fr_auto] gap-6 md:gap-12 items-baseline py-10 md:py-12 ${
                i < steps.length - 1 ? 'border-b border-[color:var(--border-subtle)]' : ''
              } transition-colors hover:bg-[oklch(1_0_0/0.015)]`}
            >
              <span
                className="display-sans tabular text-[clamp(2rem,4vw,3.2rem)] leading-none text-[color:var(--ink-faint)] w-[2ch]"
              >
                {step.n}
              </span>
              <div>
                <h3 className="display text-2xl md:text-[2.1rem] leading-tight text-[color:var(--ink)] mb-3">
                  {step.title}
                </h3>
                <p className="measure text-[15px] md:text-base text-[color:var(--ink-muted)] leading-relaxed">
                  {step.text}
                </p>
              </div>
              <span className="eyebrow shrink-0">{step.marker}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
