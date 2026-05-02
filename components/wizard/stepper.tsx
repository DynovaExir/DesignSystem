"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"
import { useLocale } from "@/lib/contexts/locale-context"

export interface Step {
  id: number
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  const { dir } = useLocale()

  return (
    <nav
      aria-label="Progress"
      className={cn("w-full", className)}
    >
      {/* Horizontal stepper for desktop */}
      <ol className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <li
              key={step.id}
              className={cn(
                "relative flex-1",
                index !== steps.length - 1 && "pe-8"
              )}
            >
              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 h-0.5 w-full",
                    dir === "rtl" ? "start-0 -translate-x-1/2" : "start-8",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}

              <div
                className="relative flex flex-col items-center group"
                aria-current={isCurrent ? "step" : undefined}
              >
                {/* Step circle */}
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary",
                    isUpcoming && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    "mt-2 text-sm font-medium text-center",
                    isCurrent && "text-primary",
                    isUpcoming && "text-muted-foreground",
                    isCompleted && "text-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          )
        })}
      </ol>

      {/* Vertical stepper for mobile */}
      <ol className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <li
              key={step.id}
              className="relative"
              aria-current={isCurrent ? "step" : undefined}
            >
              <div className="flex items-center gap-4">
                {/* Step circle */}
                <span
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-background text-primary",
                    isUpcoming && "border-border bg-background text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    "text-sm font-medium",
                    isCurrent && "text-primary",
                    isUpcoming && "text-muted-foreground",
                    isCompleted && "text-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-8 h-6 w-0.5",
                    dir === "rtl" ? "end-[15px]" : "start-[15px]",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
