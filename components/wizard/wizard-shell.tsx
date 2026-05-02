"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useWizardStore } from "@/lib/wizard-store"
import { useT, useLocale } from "@/lib/locale-context"
import { WIZARD_STEPS, getStepIndex, type WizardStep } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Stepper } from "./stepper"
import { StepIdentity } from "./step-identity"
import { StepContacts } from "./step-contacts"
import { StepBranding } from "./step-branding"
import { StepConfirm } from "./step-confirm"
import { StepSubmit } from "./step-submit"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function WizardShell() {
  const router = useRouter()
  const t = useT()
  const { direction } = useLocale()
  
  const {
    currentStep,
    nextStep,
    prevStep,
    canProceed,
    reset,
    isSubmitting,
  } = useWizardStore()

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)

  const currentIndex = getStepIndex(currentStep)
  const isFirstStep = currentIndex === 0
  const isLastStep = currentIndex === WIZARD_STEPS.length - 1
  const isSubmitStep = currentStep === "submit"

  const handleCancel = useCallback(() => {
    setCancelDialogOpen(true)
  }, [])

  const confirmCancel = useCallback(() => {
    reset()
    setCancelDialogOpen(false)
    router.push("/")
  }, [reset, router])

  const handleNext = useCallback(() => {
    if (canProceed(currentStep)) {
      nextStep()
    }
  }, [canProceed, currentStep, nextStep])

  const handlePrev = useCallback(() => {
    prevStep()
  }, [prevStep])

  const renderStep = () => {
    switch (currentStep) {
      case "identity":
        return <StepIdentity />
      case "contacts":
        return <StepContacts />
      case "branding":
        return <StepBranding />
      case "confirm":
        return <StepConfirm />
      case "submit":
        return <StepSubmit />
      default:
        return null
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] w-full bg-background py-6 px-4">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-display-md text-foreground">{t.wizard.title}</h1>
          <p className="mt-2 text-body-sm-regular text-muted-foreground">
            {t.wizard.subtitle}
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-6">
          <Stepper currentStep={currentStep} />
        </div>

        {/* Step Content Card */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            {/* Live region for step changes */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {t.wizard.steps[currentStep]}
            </div>

            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Footer */}
        {!isSubmitStep && (
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {t.common.cancel}
            </Button>

            <div className="flex items-center gap-3">
              {!isFirstStep && (
                <Button
                  variant="tertiary"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                >
                  {t.common.previous}
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={!canProceed(currentStep) || isSubmitting}
              >
                {currentStep === "confirm" ? t.common.submit : t.common.next}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.wizard.discard.title}</DialogTitle>
            <DialogDescription>{t.wizard.discard.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              {t.common.no}
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              {t.common.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
