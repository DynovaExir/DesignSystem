"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { setMockState, getMockState, type MockApiState } from "@/lib/mock-api"
import type { WizardState, SubmissionState } from "@/lib/wizard-types"
import { ChevronDown, ChevronUp, Settings } from "lucide-react"
import { toPersianDigits } from "@/lib/utils"

interface StateTogglePanelProps {
  wizardState: WizardState
  submissionState: SubmissionState
  onUpdateWizardState: (state: WizardState) => void
  onUpdateSubmissionState: (state: SubmissionState) => void
  onTriggerDraftRestore: () => void
  onTriggerCancelDialog: () => void
}

export function StateTogglePanel({
  wizardState,
  submissionState,
  onUpdateWizardState,
  onUpdateSubmissionState,
  onTriggerDraftRestore,
  onTriggerCancelDialog,
}: StateTogglePanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const mockState = getMockState()

  // Field validation state setter
  const handleFieldValidationChange = (value: MockApiState["fieldValidation"]) => {
    setMockState({ fieldValidation: value })
  }

  // Submission state setter
  const handleSubmissionChange = (value: MockApiState["submission"]) => {
    setMockState({ submission: value })
  }

  // Jump to step
  const jumpToStep = (step: number) => {
    onUpdateWizardState({ ...wizardState, currentStep: step })
  }

  // Set field status for identity fields
  const setIdentityFieldStatus = (
    field: "tenant_name" | "company_fullname" | "company_shortname" | "national_code",
    status: "idle" | "checking" | "available" | "taken" | "error" | "cooldown"
  ) => {
    onUpdateWizardState({
      ...wizardState,
      identity: {
        ...wizardState.identity,
        [field]: {
          ...wizardState.identity[field],
          status,
          value: wizardState.identity[field].value || "test-value",
        },
      },
    })
  }

  // Simulate submission phases
  const simulateSubmissionPhase = (phase: SubmissionState["phase"]) => {
    if (phase === "partial-success") {
      onUpdateSubmissionState({
        phase: "partial-success",
        tenantId: "mock-tenant-id",
        logoResult: { success: false, error: "ابعاد نامعتبر" },
        faviconResult: { success: true },
      })
    } else if (phase === "error") {
      onUpdateSubmissionState({
        phase: "error",
        error: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
      })
    } else {
      onUpdateSubmissionState({ phase })
    }
  }

  // Pre-fill steps 1 and 2 for draft restoration demo
  const prefillForDraftDemo = () => {
    onUpdateWizardState({
      ...wizardState,
      currentStep: 2,
      identity: {
        tenant_name: { value: "demo-tenant", status: "available" },
        tenant_type: "INDEPENDENT",
        company_fullname: { value: "شرکت نمونه آزمایشی", status: "available" },
        company_shortname: { value: "نمونه", status: "available" },
        national_code: { value: toPersianDigits("1234567890"), status: "available", normalized: "1234567890" },
      },
      contacts: {
        country: "ایران",
        province: "تهران",
        city: "تهران",
        postal_code: toPersianDigits("1234567890"),
        street: "خیابان ولیعصر، پلاک ۱۲۳",
        phone: toPersianDigits("02112345678"),
        email: "info@demo.com",
        website: "https://demo.com",
      },
    })
  }

  return (
    <div className="fixed bottom-4 start-4 z-50 w-80 rounded-lg border-2 border-dashed border-color-status-warning bg-color-bg-subtle shadow-lg">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-start"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-color-status-warning" />
          <span className="text-body-sm-semibold text-color-status-warning">
            حالت‌های نمایشی
          </span>
        </div>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-color-status-warning" />
        ) : (
          <ChevronUp className="h-4 w-4 text-color-status-warning" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="border-t border-color-border-default p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Current State Info */}
          <div className="rounded bg-color-bg-default p-2 text-label-lg-regular text-color-text-subtle">
            مرحله فعلی: {toPersianDigits(wizardState.currentStep)} | وضعیت ارسال: {submissionState.phase}
          </div>

          {/* Jump to Step */}
          <div className="space-y-2">
            <label className="text-label-lg-semibold text-color-text-default">پرش به مرحله</label>
            <div className="flex gap-1 flex-wrap">
              {[1, 2, 3, 4, 5].map((step) => (
                <Button
                  key={step}
                  variant={wizardState.currentStep === step ? "default" : "tertiary"}
                  onClick={() => jumpToStep(step)}
                  className="h-8 px-3 text-label-lg-semibold"
                >
                  {toPersianDigits(step)}
                </Button>
              ))}
            </div>
          </div>

          {/* Field Validation Behavior */}
          <div className="space-y-2">
            <label className="text-label-lg-semibold text-color-text-default">رفتار بررسی فیلدها</label>
            <Select value={mockState.fieldValidation} onValueChange={handleFieldValidationChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">عادی</SelectItem>
                <SelectItem value="all-taken">همه گرفته شده</SelectItem>
                <SelectItem value="network-error">خطای شبکه</SelectItem>
                <SelectItem value="rate-limited">محدودیت نرخ (۴۲۹)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Status Simulation */}
          <div className="space-y-2">
            <label className="text-label-lg-semibold text-color-text-default">وضعیت فیلد شناسه</label>
            <div className="flex gap-1 flex-wrap">
              {(["idle", "checking", "available", "taken", "error", "cooldown"] as const).map((status) => (
                <Button
                  key={status}
                  variant="tertiary"
                  onClick={() => setIdentityFieldStatus("tenant_name", status)}
                  className="h-7 px-2 text-label-sm-semibold"
                >
                  {status === "idle" && "خالی"}
                  {status === "checking" && "در حال بررسی"}
                  {status === "available" && "موجود"}
                  {status === "taken" && "گرفته شده"}
                  {status === "error" && "خطا"}
                  {status === "cooldown" && "توقف موقت"}
                </Button>
              ))}
            </div>
          </div>

          {/* Submission Behavior */}
          <div className="space-y-2">
            <label className="text-label-lg-semibold text-color-text-default">رفتار ارسال</label>
            <Select value={mockState.submission} onValueChange={handleSubmissionChange}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-success">موفقیت کامل</SelectItem>
                <SelectItem value="partial-logo-fail">موفقیت جزئی - لوگو ناموفق</SelectItem>
                <SelectItem value="partial-both-fail">موفقیت جزئی - هر دو ناموفق</SelectItem>
                <SelectItem value="hard-409-conflict">خطای ۴۰۹ - تداخل</SelectItem>
                <SelectItem value="hard-422-validation">خطای ۴۲۲ - اعتبارسنجی</SelectItem>
                <SelectItem value="network-fail">خطای شبکه</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Submission Phase Simulation */}
          <div className="space-y-2">
            <label className="text-label-lg-semibold text-color-text-default">شبیه‌سازی فاز ارسال</label>
            <div className="flex gap-1 flex-wrap">
              <Button
                variant="tertiary"
                onClick={() => simulateSubmissionPhase("creating-tenant")}
                className="h-7 px-2 text-label-sm-semibold"
              >
                ایجاد
              </Button>
              <Button
                variant="tertiary"
                onClick={() => simulateSubmissionPhase("uploading-logo")}
                className="h-7 px-2 text-label-sm-semibold"
              >
                لوگو
              </Button>
              <Button
                variant="tertiary"
                onClick={() => simulateSubmissionPhase("success")}
                className="h-7 px-2 text-label-sm-semibold"
              >
                موفق
              </Button>
              <Button
                variant="tertiary"
                onClick={() => simulateSubmissionPhase("partial-success")}
                className="h-7 px-2 text-label-sm-semibold"
              >
                جزئی
              </Button>
              <Button
                variant="tertiary"
                onClick={() => simulateSubmissionPhase("error")}
                className="h-7 px-2 text-label-sm-semibold"
              >
                خطا
              </Button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-color-border-default" />

          {/* Special Actions */}
          <div className="space-y-2">
            <label className="text-label-lg-semibold text-color-text-default">عملیات خاص</label>
            <div className="space-y-2">
              <Button
                variant="tertiary"
                onClick={prefillForDraftDemo}
                className="w-full h-9 text-body-sm-regular"
              >
                پیش‌پر کردن برای بازیابی پیش‌نویس
              </Button>
              <Button
                variant="tertiary"
                onClick={onTriggerDraftRestore}
                className="w-full h-9 text-body-sm-regular"
              >
                شبیه‌سازی بازیابی پیش‌نویس
              </Button>
              <Button
                variant="tertiary"
                onClick={onTriggerCancelDialog}
                className="w-full h-9 text-body-sm-regular"
              >
                نمایش دیالوگ انصراف
              </Button>
            </div>
          </div>

          {/* National Code Demo */}
          <div className="space-y-2">
            <label className="text-label-lg-semibold text-color-text-default">نمایش تغییر نوع مستأجر</label>
            <p className="text-label-lg-regular text-color-text-subtle">
              شناسه ملی ۱۲۳۴۵ را وارد کنید، سپس نوع مستأجر را تغییر دهید.
            </p>
            <Button
              variant="tertiary"
              onClick={() => {
                onUpdateWizardState({
                  ...wizardState,
                  currentStep: 1,
                  identity: {
                    ...wizardState.identity,
                    national_code: { value: toPersianDigits("12345"), status: "idle" },
                    tenant_type: "HOLDING",
                  },
                })
              }}
              className="w-full h-9 text-body-sm-regular"
            >
              تنظیم برای نمایش
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
