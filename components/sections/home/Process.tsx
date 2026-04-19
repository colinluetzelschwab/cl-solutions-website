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
            <p className="eyebrow mb-6">Chapter II · Process</p>
            <h2 className="display text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.02]">
              From brief to launch,{' '}
              <span className="serif-italic text-[color:var(--accent)]">in four moves.</span>
            </h2>
          </div>
        </div>

        {/* Editorial timeline — typographic, flat, ledger-style */}
        <ol className="border-t border-[color:var(--border-default)]">
          {steps.map((step, i) => (
            <li
              key={step.n}
              className={`grid grid-cols-[56px_1fr_auto] gap-6 md:gap-10 items-start py-9 md:py-11 ${
                i < steps.length - 1 ? 'border-b border-[color:var(--border-subtle)]' : ''
              }`}
            >
              <span className="eyebrow text-[color:var(--accent)] tabular pt-1">
                {step.n}
              </span>
              <div>
                <h3 className="display text-2xl md:text-[2rem] leading-tight text-[color:var(--ink)] mb-2">
                  {step.title}
                </h3>
                <p className="measure text-[15px] md:text-base text-[color:var(--ink-muted)] leading-relaxed">
                  {step.text}
                </p>
              </div>
              <span className="eyebrow shrink-0 pt-2">{step.marker}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
