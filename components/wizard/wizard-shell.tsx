"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/lib/contexts/locale-context"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { useDirtyFormsStore } from "@/lib/hooks/use-dirty-forms"
import { Stepper, type Step } from "./stepper"
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
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight, X } from "lucide-react"

export function WizardShell() {
  const { t, dir } = useLocale()
  const router = useRouter()
  const { currentStep, setStep, reset, isSubmitting } = useWizardStore()
  const { registerDirtyForm, unregisterDirtyForm } = useDirtyFormsStore()

  const [stepValidity, setStepValidity] = useState<Record<number, boolean>>({
    0: false,
    1: false,
    2: true, // Branding is always valid (optional)
    3: false,
    4: true, // Submit step handles its own logic
  })
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  // Register as dirty form when wizard has data
  useEffect(() => {
    registerDirtyForm("tenant-wizard")
    return () => unregisterDirtyForm("tenant-wizard")
  }, [registerDirtyForm, unregisterDirtyForm])

  const steps: Step[] = [
    { id: 0, label: t.steps.identity },
    { id: 1, label: t.steps.contacts },
    { id: 2, label: t.steps.branding },
    { id: 3, label: t.steps.confirm },
    { id: 4, label: t.steps.submit },
  ]

  const handleValidChange = useCallback((step: number, isValid: boolean) => {
    setStepValidity((prev) => ({ ...prev, [step]: isValid }))
  }, [])

  const handleNext = useCallback(() => {
    if (currentStep < 4) {
      setStep(currentStep + 1)
    }
  }, [currentStep, setStep])

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setStep(currentStep - 1)
    }
  }, [currentStep, setStep])

  const handleGoToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step <= 4) {
        setStep(step)
      }
    },
    [setStep]
  )

  const handleCancel = useCallback(() => {
    setShowCancelDialog(true)
  }, [])

  const handleConfirmCancel = useCallback(() => {
    reset()
    unregisterDirtyForm("tenant-wizard")
    router.push("/")
  }, [reset, unregisterDirtyForm, router])

  const isLastStep = currentStep === 4
  const canGoNext = stepValidity[currentStep] && !isSubmitting
  const canGoPrev = currentStep > 0 && !isSubmitting && currentStep < 4

  // Announce step changes for screen readers
  useEffect(() => {
    const announcement = document.getElementById("step-announcement")
    if (announcement) {
      announcement.textContent = `${steps[currentStep].label}`
    }
  }, [currentStep, steps])

  return (
    <>
      {/* Screen reader announcement */}
      <div
        id="step-announcement"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <div className="min-h-screen bg-background py-8 px-4">
        <Card className="mx-auto max-w-3xl shadow-md">
          <CardContent className="p-6 md:p-8">
            {/* Stepper */}
            <Stepper
              steps={steps}
              currentStep={currentStep}
              className="mb-8"
            />

            {/* Step Content */}
            <div className="min-h-[400px]">
              {currentStep === 0 && (
                <StepIdentity
                  onValidChange={(isValid) => handleValidChange(0, isValid)}
                />
              )}
              {currentStep === 1 && (
                <StepContacts
                  onValidChange={(isValid) => handleValidChange(1, isValid)}
                />
              )}
              {currentStep === 2 && (
                <StepBranding
                  onValidChange={(isValid) => handleValidChange(2, isValid)}
                />
              )}
              {currentStep === 3 && (
                <StepConfirm
                  onValidChange={(isValid) => handleValidChange(3, isValid)}
                  onGoToStep={handleGoToStep}
                />
              )}
              {currentStep === 4 && (
                <StepSubmit onGoToStep={handleGoToStep} />
              )}
            </div>

            {/* Footer Navigation */}
            {currentStep < 4 && (
              <div className="flex items-center justify-between border-t border-border pt-6 mt-8">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4 me-2" />
                  {t.cancel}
                </Button>

                <div className="flex items-center gap-3">
                  {canGoPrev && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      <ArrowLeft className={cn("h-4 w-4 me-2", dir === "rtl" && "rtl-flip")} />
                      {t.previous}
                    </Button>
                  )}

                  {!isLastStep && (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!canGoNext}
                    >
                      {currentStep === 3 ? t.submit : t.next}
                      <ArrowRight className={cn("h-4 w-4 ms-2", dir === "rtl" && "rtl-flip")} />
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.cancelDialog.title}</DialogTitle>
            <DialogDescription>{t.cancelDialog.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              {t.cancelDialog.cancel}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
            >
              {t.cancelDialog.confirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
