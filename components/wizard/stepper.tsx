"use client"

import { cn } from "@/lib/utils"
import { toPersianDigits } from "@/lib/utils"
import { Check } from "lucide-react"

interface Step {
  number: number
  label: string
}

interface StepperProps {
  steps: Step[]
  currentStep: number
  onStepClick: (step: number) => void
}

export function Stepper({ steps, currentStep, onStepClick }: StepperProps) {
  return (
    <nav aria-label="مراحل ویزارد" className="w-full">
      {/* Desktop - Horizontal */}
      <ol className="hidden md:flex items-center justify-center gap-4">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isFuture = step.number > currentStep
          const isClickable = isCompleted

          return (
            <li key={step.number} className="flex items-center">
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={isFuture}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-body-sm-semibold transition-colors",
                  isClickable && "cursor-pointer hover:bg-color-interactive-subtle",
                  isFuture && "cursor-not-allowed opacity-60",
                  isCurrent && "bg-color-interactive-default text-color-text-inverse",
                  isCompleted && "bg-color-status-success-bg text-color-status-success",
                  !isCurrent && !isCompleted && "bg-color-bg-subtle text-color-text-default"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-label-lg-semibold",
                    isCurrent && "bg-color-text-inverse text-color-interactive-default",
                    isCompleted && "bg-color-status-success text-color-text-inverse",
                    !isCurrent && !isCompleted && "bg-color-bg-muted text-color-text-subtle"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    toPersianDigits(step.number)
                  )}
                </span>
                <span>{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-2 h-px w-8",
                    step.number < currentStep
                      ? "bg-color-status-success"
                      : "bg-color-border-default"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile - Vertical */}
      <ol className="flex md:hidden flex-col gap-2">
        {steps.map((step) => {
          const isCompleted = step.number < currentStep
          const isCurrent = step.number === currentStep
          const isFuture = step.number > currentStep
          const isClickable = isCompleted

          return (
            <li key={step.number}>
              <button
                type="button"
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={isFuture}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-body-sm-semibold transition-colors",
                  isClickable && "cursor-pointer hover:bg-color-interactive-subtle",
                  isFuture && "cursor-not-allowed opacity-60",
                  isCurrent && "bg-color-interactive-default text-color-text-inverse",
                  isCompleted && "bg-color-status-success-bg text-color-status-success",
                  !isCurrent && !isCompleted && "bg-color-bg-subtle text-color-text-default"
                )}
                aria-current={isCurrent ? "step" : undefined}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-body-sm-semibold",
                    isCurrent && "bg-color-text-inverse text-color-interactive-default",
                    isCompleted && "bg-color-status-success text-color-text-inverse",
                    !isCurrent && !isCompleted && "bg-color-bg-muted text-color-text-subtle"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    toPersianDigits(step.number)
                  )}
                </span>
                <span>{step.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
