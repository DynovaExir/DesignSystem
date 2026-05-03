"use client"

import { Button } from "@/components/ui/button"
import { Banner } from "@/components/wizard/banner"
import { Spinner } from "@/components/ui/spinner"
import type { SubmissionState } from "@/lib/wizard-types"
import { Check, X, AlertTriangle, RefreshCw } from "lucide-react"

interface StepSubmitProps {
  submissionState: SubmissionState
  onRetry: () => void
  onRetryBranding: () => void
  onSkipAndFinish: () => void
  onNavigateToDashboard: () => void
}

export function StepSubmit({
  submissionState,
  onRetry,
  onRetryBranding,
  onSkipAndFinish,
  onNavigateToDashboard,
}: StepSubmitProps) {
  const { phase, logoResult, faviconResult, error } = submissionState

  // Submitting state
  if (phase === "creating-tenant" || phase === "uploading-logo" || phase === "uploading-favicon") {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <Spinner size="lg" className="text-color-interactive-default" />
        <div className="text-center space-y-2">
          <p className="text-heading-lg text-color-text-default">
            {phase === "creating-tenant" && "در حال ایجاد مستأجر…"}
            {phase === "uploading-logo" && "در حال بارگذاری لوگو…"}
            {phase === "uploading-favicon" && "در حال بارگذاری فاوآیکون…"}
          </p>
          <ProgressSteps currentPhase={phase} />
        </div>
      </div>
    )
  }

  // Full success
  if (phase === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-color-status-success-bg">
          <Check className="h-8 w-8 text-color-status-success" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-heading-lg text-color-text-default">مستأجر با موفقیت ایجاد شد</p>
          <p className="text-body-sm-regular text-color-text-subtle">
            در حال هدایت به داشبورد…
          </p>
        </div>
        <Button onClick={onNavigateToDashboard}>هدایت به داشبورد</Button>
      </div>
    )
  }

  // Partial success - some uploads failed
  if (phase === "partial-success") {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center py-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-color-status-warning-bg">
            <AlertTriangle className="h-8 w-8 text-color-status-warning" />
          </div>
          <p className="text-heading-lg text-color-text-default">مستأجر ایجاد شد</p>
          <p className="text-body-sm-regular text-color-text-subtle text-center">
            برخی از فایل‌های برندینگ با خطا مواجه شدند.
          </p>
        </div>

        {/* Asset status rows */}
        <div className="space-y-3">
          <AssetRow
            label="مستأجر"
            success={true}
          />
          {logoResult && (
            <AssetRow
              label="لوگو"
              success={logoResult.success}
              error={logoResult.error}
            />
          )}
          {faviconResult && (
            <AssetRow
              label="فاوآیکون"
              success={faviconResult.success}
              error={faviconResult.error}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4">
          <Button variant="default" onClick={onRetryBranding}>
            <RefreshCw className="h-4 w-4 me-2" />
            تلاش مجدد بارگذاری برندینگ
          </Button>
          <Button variant="secondary" onClick={onSkipAndFinish}>
            عبور و اتمام
          </Button>
        </div>
      </div>
    )
  }

  // Hard error
  if (phase === "error") {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-color-status-danger-bg">
          <X className="h-8 w-8 text-color-status-danger" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-heading-lg text-color-text-default">خطا در ایجاد مستأجر</p>
          {error && <Banner variant="danger">{error}</Banner>}
        </div>
        <Button onClick={onRetry}>
          <RefreshCw className="h-4 w-4 me-2" />
          تلاش مجدد
        </Button>
      </div>
    )
  }

  // Idle - shouldn't normally show
  return null
}

// Progress steps component
function ProgressSteps({ currentPhase }: { currentPhase: string }) {
  const steps = [
    { key: "creating-tenant", label: "ایجاد مستأجر" },
    { key: "uploading-logo", label: "بارگذاری لوگو" },
    { key: "uploading-favicon", label: "بارگذاری فاوآیکون" },
  ]

  const currentIndex = steps.findIndex((s) => s.key === currentPhase)

  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center gap-2">
          <span
            className={
              index < currentIndex
                ? "text-label-lg-semibold text-color-status-success"
                : index === currentIndex
                ? "text-label-lg-semibold text-color-interactive-default"
                : "text-label-lg-regular text-color-text-subtle"
            }
          >
            {step.label}
          </span>
          {index < steps.length - 1 && (
            <span className="text-color-text-subtle">→</span>
          )}
        </div>
      ))}
    </div>
  )
}

// Asset status row
interface AssetRowProps {
  label: string
  success: boolean
  error?: string
}

function AssetRow({ label, success, error }: AssetRowProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-color-border-default bg-color-bg-subtle px-4 py-3">
      <div className="flex items-center gap-3">
        {success ? (
          <Check className="h-5 w-5 text-color-status-success" />
        ) : (
          <X className="h-5 w-5 text-color-status-danger" />
        )}
        <span className="text-body-sm-semibold text-color-text-default">{label}</span>
      </div>
      {error && (
        <span className="text-label-lg-regular text-color-status-danger">{error}</span>
      )}
    </div>
  )
}
