"use client"

import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col gap-3", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "group/accordion-item relative rounded-[var(--radius-md)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-1)]/80 backdrop-blur-sm overflow-hidden transition-colors data-[panel-open]:border-[color:var(--accent)]/45 data-[panel-open]:bg-[color:var(--surface-1)]",
        className
      )}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger flex flex-1 items-center justify-between gap-6 px-5 md:px-6 py-5 md:py-6 text-left text-[15px] md:text-base font-medium text-[color:var(--ink)] transition-colors outline-none hover:text-[color:var(--accent-bright)] focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]/50 focus-visible:ring-offset-0",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-default)] bg-[color:var(--surface-2)] text-[color:var(--ink-muted)] transition-all group-aria-expanded/accordion-trigger:rotate-45 group-aria-expanded/accordion-trigger:border-[color:var(--accent)] group-aria-expanded/accordion-trigger:text-[color:var(--accent-bright)] group-aria-expanded/accordion-trigger:shadow-[0_0_16px_var(--accent-glow)]"
        >
          <Plus className="h-3.5 w-3.5" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) px-5 md:px-6 pb-5 md:pb-6 text-[color:var(--ink-muted)] leading-relaxed data-ending-style:h-0 data-starting-style:h-0 [&_a]:text-[color:var(--accent-bright)] [&_a]:underline-offset-4 [&_a:hover]:text-[color:var(--ink)]",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
