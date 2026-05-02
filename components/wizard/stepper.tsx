"use client"

import { useT } from "@/lib/locale-context"
import { WIZARD_STEPS, getStepIndex, type WizardStep } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface StepperProps {
  currentStep: WizardStep
}

const stepIcons: Record<WizardStep, string> = {
  identity: "1",
  contacts: "2",
  branding: "3",
  confirm: "4",
  submit: "5",
}

export function Stepper({ currentStep }: StepperProps) {
  const t = useT()
  const currentIndex = getStepIndex(currentStep)

  return (
    <nav aria-label="Wizard progress">
      {/* Desktop horizontal stepper */}
      <ol className="hidden md:flex items-center justify-between">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <li
              key={step}
              className={cn(
                "flex items-center",
                index < WIZARD_STEPS.length - 1 && "flex-1"
              )}
            >
              <div
                className="flex items-center gap-3"
                aria-current={isCurrent ? "step" : undefined}
              >
                {/* Step indicator */}
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                    isCompleted && "border-primary bg-primary text-primary-foreground",
                    isCurrent && "border-primary bg-card text-primary",
                    isUpcoming && "border-border bg-card text-muted-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <span className="text-body-sm-semibold">{stepIcons[step]}</span>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={cn(
                    "text-body-sm-semibold whitespace-nowrap",
                    isCurrent && "text-foreground",
                    !isCurrent && "text-muted-foreground"
                  )}
                >
                  {t.wizard.steps[step]}
                </span>
              </div>

              {/* Connector line */}
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-4 h-0.5 flex-1",
                    isCompleted ? "bg-primary" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>

      {/* Mobile vertical stepper */}
      <ol className="flex flex-col gap-4 md:hidden">
        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = index < currentIndex
          const isCurrent = index === currentIndex
          const isUpcoming = index > currentIndex

          return (
            <li
              key={step}
              className="flex items-center gap-3"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Step indicator */}
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-card text-primary",
                  isUpcoming && "border-border bg-card text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <span className="text-label-lg-semibold">{stepIcons[step]}</span>
                )}
              </div>

              {/* Step label */}
              <span
                className={cn(
                  "text-body-sm-semibold",
                  isCurrent && "text-foreground",
                  !isCurrent && "text-muted-foreground"
                )}
              >
                {t.wizard.steps[step]}
              </span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
