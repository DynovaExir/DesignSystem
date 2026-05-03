"use client"

import { Button } from "@/components/ui/button"
import { Stepper } from "./stepper"

const STEPS = [
  { number: 1, label: "هویت" },
  { number: 2, label: "اطلاعات تماس" },
  { number: 3, label: "برندینگ" },
  { number: 4, label: "تأیید" },
  { number: 5, label: "ارسال" },
]

interface WizardShellProps {
  currentStep: number
  onStepClick: (step: number) => void
  onCancel: () => void
  onPrevious: () => void
  onNext: () => void
  isNextDisabled?: boolean
  isPreviousDisabled?: boolean
  nextLabel?: string
  children: React.ReactNode
  showFooter?: boolean
  footerContent?: React.ReactNode
}

export function WizardShell({
  currentStep,
  onStepClick,
  onCancel,
  onPrevious,
  onNext,
  isNextDisabled = false,
  isPreviousDisabled = false,
  nextLabel = "بعدی",
  children,
  showFooter = true,
  footerContent,
}: WizardShellProps) {
  return (
    <div className="min-h-screen bg-color-bg-default">
      {/* Page Header */}
      <header className="sticky top-0 z-40 border-b border-color-border-default bg-color-bg-subtle">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <h1 className="text-heading-lg text-color-text-default">ایجاد مستأجر جدید</h1>
          <Button variant="ghost" onClick={onCancel}>
            انصراف
          </Button>
        </div>
      </header>

      {/* Stepper */}
      <div className="border-b border-color-border-default bg-color-bg-subtle py-4">
        <div className="mx-auto max-w-4xl px-4">
          <Stepper steps={STEPS} currentStep={currentStep} onStepClick={onStepClick} />
        </div>
      </div>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>

      {/* Footer */}
      {showFooter && (
        <footer className="sticky bottom-0 border-t border-color-border-default bg-color-bg-subtle">
          <div className="mx-auto flex h-20 max-w-4xl items-center justify-between px-4">
            <div className="flex-1 flex justify-start">
              <Button
                variant="tertiary"
                onClick={onPrevious}
                disabled={isPreviousDisabled}
              >
                قبلی
              </Button>
            </div>
            <div className="flex-1 flex justify-end gap-2">
              {footerContent || (
                <Button variant="default" onClick={onNext} disabled={isNextDisabled}>
                  {nextLabel}
                </Button>
              )}
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
