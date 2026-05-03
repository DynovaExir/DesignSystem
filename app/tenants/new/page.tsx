"use client"

import { useState, useEffect, useCallback } from "react"
import { WizardShell } from "@/components/wizard/wizard-shell"
import { StepIdentity } from "@/components/wizard/steps/step-identity"
import { StepContacts } from "@/components/wizard/steps/step-contacts"
import { StepBranding } from "@/components/wizard/steps/step-branding"
import { StepConfirm } from "@/components/wizard/steps/step-confirm"
import { StepSubmit } from "@/components/wizard/steps/step-submit"
import { StateTogglePanel } from "@/components/wizard/state-toggle-panel"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  createInitialWizardState,
  saveWizardDraft,
  loadWizardDraft,
  clearWizardDraft,
  type WizardState,
  type SubmissionState,
} from "@/lib/wizard-types"
import {
  createTenant,
  uploadLogo,
  uploadFavicon,
  isApiError,
  getMockState,
} from "@/lib/mock-api"

export default function TenantCreationWizardPage() {
  const [wizardState, setWizardState] = useState<WizardState>(createInitialWizardState)
  const [submissionState, setSubmissionState] = useState<SubmissionState>({ phase: "idle" })
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [serverError, setServerError] = useState<{ message: string; field?: string } | undefined>()
  const [showFileNotice, setShowFileNotice] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load draft on mount
  useEffect(() => {
    const savedDraft = loadWizardDraft()
    if (savedDraft) {
      setWizardState(savedDraft)
      // Show notice if we're past branding step
      if (savedDraft.currentStep >= 3) {
        setShowFileNotice(true)
      }
    }
    setIsHydrated(true)
  }, [])

  // Save draft on state change
  useEffect(() => {
    if (isHydrated && submissionState.phase === "idle") {
      saveWizardDraft(wizardState)
    }
  }, [wizardState, submissionState.phase, isHydrated])

  // Step validation
  const isStep1Valid = useCallback(() => {
    const { identity } = wizardState
    // All fields must have values
    if (
      !identity.tenant_name.value.trim() ||
      !identity.company_fullname.value.trim() ||
      !identity.company_shortname.value.trim() ||
      !identity.national_code.value.trim()
    ) {
      return false
    }
    // None can be "taken" or "error" or "checking"
    const fields = [
      identity.tenant_name,
      identity.company_fullname,
      identity.company_shortname,
      identity.national_code,
    ]
    return !fields.some(
      (f) => f.status === "taken" || f.status === "error" || f.status === "checking"
    )
  }, [wizardState])

  const isStep2Valid = useCallback(() => {
    const { contacts } = wizardState
    // Minimal validation - province and city required
    return contacts.province.trim().length > 0 && contacts.city.trim().length > 0
  }, [wizardState])

  const isStep3Valid = useCallback(() => {
    // Branding is optional
    const { branding } = wizardState
    // Just check no active errors
    return !branding.logoError && !branding.faviconError
  }, [wizardState])

  const isStep4Valid = useCallback(() => {
    return wizardState.acknowledged
  }, [wizardState])

  // Navigation handlers
  const handleStepClick = (step: number) => {
    if (step < wizardState.currentStep) {
      setWizardState((prev) => ({ ...prev, currentStep: step }))
      setServerError(undefined)
    }
  }

  const handlePrevious = () => {
    if (wizardState.currentStep > 1) {
      setWizardState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }))
      setServerError(undefined)
    }
  }

  const handleNext = () => {
    if (wizardState.currentStep < 5) {
      setWizardState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }))
      setServerError(undefined)
      setShowFileNotice(false)
    }
  }

  // Submission handler
  const handleSubmit = useCallback(async () => {
    setSubmissionState({ phase: "creating-tenant" })

    const { identity, contacts, branding } = wizardState

    // Create tenant
    const tenantResult = await createTenant({
      tenant_name: identity.tenant_name.value,
      tenant_type: identity.tenant_type,
      company_fullname: identity.company_fullname.value,
      company_shortname: identity.company_shortname.value,
      national_code: identity.national_code.normalized || identity.national_code.value,
      country: contacts.country,
      province: contacts.province,
      city: contacts.city,
      postal_code: contacts.postal_code,
      street: contacts.street,
      phone: contacts.phone,
      email: contacts.email,
      website: contacts.website,
      default_locale: branding.default_locale,
    })

    if (isApiError(tenantResult)) {
      if (tenantResult.status === 409 || tenantResult.status === 422) {
        // Jump back to relevant step
        const targetStep = tenantResult.field === "postal_code" ? 2 : 1
        setWizardState((prev) => ({ ...prev, currentStep: targetStep }))
        setServerError({ message: tenantResult.detail, field: tenantResult.field })
        setSubmissionState({ phase: "idle" })
      } else {
        setSubmissionState({
          phase: "error",
          error: tenantResult.detail,
        })
      }
      return
    }

    const tenantId = tenantResult.id

    // Upload logo if selected
    let logoResult: { success: boolean; error?: string } | undefined
    if (branding.logo) {
      setSubmissionState({ phase: "uploading-logo", tenantId })
      const logoUploadResult = await uploadLogo(tenantId, branding.logo)
      if (isApiError(logoUploadResult)) {
        logoResult = { success: false, error: logoUploadResult.detail }
      } else {
        logoResult = { success: true }
      }
    }

    // Upload favicon if selected
    let faviconResult: { success: boolean; error?: string } | undefined
    if (branding.favicon) {
      setSubmissionState({ phase: "uploading-favicon", tenantId, logoResult })
      const faviconUploadResult = await uploadFavicon(tenantId, branding.favicon)
      if (isApiError(faviconUploadResult)) {
        faviconResult = { success: false, error: faviconUploadResult.detail }
      } else {
        faviconResult = { success: true }
      }
    }

    // Determine final state
    const hasLogoError = logoResult && !logoResult.success
    const hasFaviconError = faviconResult && !faviconResult.success

    if (hasLogoError || hasFaviconError) {
      setSubmissionState({
        phase: "partial-success",
        tenantId,
        logoResult,
        faviconResult,
      })
    } else {
      clearWizardDraft()
      setSubmissionState({
        phase: "success",
        tenantId,
        logoResult,
        faviconResult,
      })
    }
  }, [wizardState])

  // Retry handlers
  const handleRetry = () => {
    setSubmissionState({ phase: "idle" })
    handleSubmit()
  }

  const handleRetryBranding = useCallback(async () => {
    const { branding } = wizardState
    const tenantId = submissionState.tenantId!

    let newLogoResult = submissionState.logoResult
    let newFaviconResult = submissionState.faviconResult

    // Retry logo if it failed
    if (newLogoResult && !newLogoResult.success && branding.logo) {
      setSubmissionState((prev) => ({ ...prev, phase: "uploading-logo" }))
      const logoUploadResult = await uploadLogo(tenantId, branding.logo)
      if (isApiError(logoUploadResult)) {
        newLogoResult = { success: false, error: logoUploadResult.detail }
      } else {
        newLogoResult = { success: true }
      }
    }

    // Retry favicon if it failed
    if (newFaviconResult && !newFaviconResult.success && branding.favicon) {
      setSubmissionState((prev) => ({ ...prev, phase: "uploading-favicon" }))
      const faviconUploadResult = await uploadFavicon(tenantId, branding.favicon)
      if (isApiError(faviconUploadResult)) {
        newFaviconResult = { success: false, error: faviconUploadResult.detail }
      } else {
        newFaviconResult = { success: true }
      }
    }

    // Check if all succeeded now
    const hasLogoError = newLogoResult && !newLogoResult.success
    const hasFaviconError = newFaviconResult && !newFaviconResult.success

    if (hasLogoError || hasFaviconError) {
      setSubmissionState({
        phase: "partial-success",
        tenantId,
        logoResult: newLogoResult,
        faviconResult: newFaviconResult,
      })
    } else {
      clearWizardDraft()
      setSubmissionState({
        phase: "success",
        tenantId,
        logoResult: newLogoResult,
        faviconResult: newFaviconResult,
      })
    }
  }, [wizardState, submissionState])

  const handleSkipAndFinish = () => {
    clearWizardDraft()
    setSubmissionState((prev) => ({ ...prev, phase: "success" }))
  }

  const handleNavigateToDashboard = () => {
    // In a real app, this would navigate to the dashboard
    alert("در یک برنامه واقعی به داشبورد هدایت می‌شوید.")
  }

  // Cancel handlers
  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const handleConfirmCancel = () => {
    clearWizardDraft()
    setShowCancelDialog(false)
    // In a real app, navigate away
    alert("پیش‌نویس حذف شد. در یک برنامه واقعی به صفحه قبلی هدایت می‌شوید.")
    setWizardState(createInitialWizardState())
    setSubmissionState({ phase: "idle" })
  }

  // Draft restoration simulation
  const handleTriggerDraftRestore = () => {
    const savedDraft = loadWizardDraft()
    if (savedDraft) {
      setWizardState(savedDraft)
      if (savedDraft.currentStep >= 3) {
        setShowFileNotice(true)
      }
    }
  }

  // Determine if Next is disabled
  const isNextDisabled = () => {
    switch (wizardState.currentStep) {
      case 1:
        return !isStep1Valid()
      case 2:
        return !isStep2Valid()
      case 3:
        return !isStep3Valid()
      case 4:
        return !isStep4Valid()
      default:
        return false
    }
  }

  // Get next button label
  const getNextLabel = () => {
    if (wizardState.currentStep === 4) return "ارسال"
    return "بعدی"
  }

  // Handle Next action
  const handleNextAction = () => {
    if (wizardState.currentStep === 4) {
      handleNext() // Go to step 5
      handleSubmit()
    } else {
      handleNext()
    }
  }

  // Don't render until hydrated to avoid SSR mismatch
  if (!isHydrated) {
    return null
  }

  // Step 5 has custom footer
  const isStep5 = wizardState.currentStep === 5

  return (
    <>
      <WizardShell
        currentStep={wizardState.currentStep}
        onStepClick={handleStepClick}
        onCancel={handleCancel}
        onPrevious={handlePrevious}
        onNext={handleNextAction}
        isNextDisabled={isNextDisabled()}
        isPreviousDisabled={wizardState.currentStep === 1 || isStep5}
        nextLabel={getNextLabel()}
        showFooter={!isStep5}
      >
        {wizardState.currentStep === 1 && (
          <StepIdentity
            data={wizardState.identity}
            onChange={(identity) => setWizardState((prev) => ({ ...prev, identity }))}
            serverError={serverError}
          />
        )}

        {wizardState.currentStep === 2 && (
          <StepContacts
            data={wizardState.contacts}
            onChange={(contacts) => setWizardState((prev) => ({ ...prev, contacts }))}
            serverError={serverError}
          />
        )}

        {wizardState.currentStep === 3 && (
          <StepBranding
            data={wizardState.branding}
            onChange={(branding) => setWizardState((prev) => ({ ...prev, branding }))}
            showFileNotice={showFileNotice}
          />
        )}

        {wizardState.currentStep === 4 && (
          <StepConfirm
            wizardState={wizardState}
            acknowledged={wizardState.acknowledged}
            onAcknowledgedChange={(acknowledged) =>
              setWizardState((prev) => ({ ...prev, acknowledged }))
            }
            onEditStep={handleStepClick}
          />
        )}

        {wizardState.currentStep === 5 && (
          <StepSubmit
            submissionState={submissionState}
            onRetry={handleRetry}
            onRetryBranding={handleRetryBranding}
            onSkipAndFinish={handleSkipAndFinish}
            onNavigateToDashboard={handleNavigateToDashboard}
          />
        )}
      </WizardShell>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>دور انداختن پیش‌نویس؟</DialogTitle>
            <DialogDescription>
              اطلاعات وارد شده ذخیره نمی‌شود.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="tertiary" onClick={() => setShowCancelDialog(false)}>
              بازگشت
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel}>
              دور انداختن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* State Toggle Panel - Development Tool */}
      <StateTogglePanel
        wizardState={wizardState}
        submissionState={submissionState}
        onUpdateWizardState={setWizardState}
        onUpdateSubmissionState={setSubmissionState}
        onTriggerDraftRestore={handleTriggerDraftRestore}
        onTriggerCancelDialog={() => setShowCancelDialog(true)}
      />
    </>
  )
}
