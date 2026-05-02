"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWizardStore } from "@/lib/wizard-store"
import { useT } from "@/lib/locale-context"
import { createTenant, uploadBrandingAsset } from "@/lib/api/mock-api"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Check, Loader2, X, AlertCircle, PartyPopper } from "lucide-react"

type SubmitStepStatus = "idle" | "loading" | "success" | "error"

interface SubmitStepItemProps {
  label: string
  status: SubmitStepStatus
}

function SubmitStepItem({ label, status }: SubmitStepItemProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="flex h-8 w-8 items-center justify-center">
        {status === "idle" && (
          <div className="h-2 w-2 rounded-full bg-muted-foreground" />
        )}
        {status === "loading" && (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        )}
        {status === "success" && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success-500">
            <Check className="h-4 w-4 text-white" />
          </div>
        )}
        {status === "error" && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-danger-500">
            <X className="h-4 w-4 text-white" />
          </div>
        )}
      </div>
      <span
        className={cn(
          "text-body-sm-regular",
          status === "loading" && "text-foreground",
          status === "success" && "text-success-500",
          status === "error" && "text-danger-500",
          status === "idle" && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  )
}

export function StepSubmit() {
  const router = useRouter()
  const t = useT()
  const {
    identity,
    contacts,
    branding,
    submitProgress,
    setSubmitProgress,
    isSubmitting,
    setSubmitting,
    createdTenantId,
    setCreatedTenantId,
    submitError,
    setSubmitError,
    reset,
    goToStep,
  } = useWizardStore()

  const [hasStarted, setHasStarted] = useState(false)

  const runSubmit = useCallback(async () => {
    if (hasStarted) return
    setHasStarted(true)
    setSubmitting(true)
    setSubmitError(null)

    // Step 1: Create tenant
    setSubmitProgress({ creating: "loading" })
    const tenantResult = await createTenant({
      tenant_name: identity.tenant_name,
      company_fullname: identity.company_fullname,
      company_shortname: identity.company_shortname,
      national_code: identity.national_code,
      tenant_type: identity.tenant_type,
      contacts: {
        address: contacts.address,
        phone: contacts.phone,
        email: contacts.email,
        website: contacts.website || undefined,
      },
      default_locale: branding.default_locale,
    })

    if (!tenantResult.success) {
      setSubmitProgress({ creating: "error" })
      setSubmitError(tenantResult.error)
      setSubmitting(false)

      // If conflict, go back to identity step
      if (tenantResult.field) {
        goToStep("identity")
      }
      return
    }

    setSubmitProgress({ creating: "success" })
    const tenantId = tenantResult.data.id
    setCreatedTenantId(tenantId)

    // Step 2: Upload logo (if provided)
    if (branding.logo?.file) {
      setSubmitProgress({ uploadingLogo: "loading" })
      const logoResult = await uploadBrandingAsset(
        tenantId,
        "logo",
        branding.logo.file
      )
      if (logoResult.success) {
        setSubmitProgress({ uploadingLogo: "success" })
      } else {
        setSubmitProgress({ uploadingLogo: "error" })
        setSubmitError(logoResult.error)
        setSubmitting(false)
        return
      }
    } else {
      setSubmitProgress({ uploadingLogo: "success" })
    }

    // Step 3: Upload favicon (if provided)
    if (branding.favicon?.file) {
      setSubmitProgress({ uploadingFavicon: "loading" })
      const faviconResult = await uploadBrandingAsset(
        tenantId,
        "favicon",
        branding.favicon.file
      )
      if (faviconResult.success) {
        setSubmitProgress({ uploadingFavicon: "success" })
      } else {
        setSubmitProgress({ uploadingFavicon: "error" })
        setSubmitError(faviconResult.error)
        setSubmitting(false)
        return
      }
    } else {
      setSubmitProgress({ uploadingFavicon: "success" })
    }

    // Step 4: Complete
    setSubmitProgress({ completing: "loading" })
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSubmitProgress({ completing: "success" })
    setSubmitting(false)
  }, [
    hasStarted,
    identity,
    contacts,
    branding,
    setSubmitting,
    setSubmitProgress,
    setSubmitError,
    setCreatedTenantId,
    goToStep,
  ])

  // Start submission on mount
  useEffect(() => {
    runSubmit()
  }, [])

  const isComplete =
    submitProgress.creating === "success" &&
    submitProgress.uploadingLogo === "success" &&
    submitProgress.uploadingFavicon === "success" &&
    submitProgress.completing === "success"

  const isPartialSuccess =
    submitProgress.creating === "success" &&
    (submitProgress.uploadingLogo === "error" ||
      submitProgress.uploadingFavicon === "error")

  const hasFailed =
    submitProgress.creating === "error" ||
    submitProgress.completing === "error"

  const handleGoToDashboard = () => {
    reset()
    if (createdTenantId) {
      router.push(`/tenants/${createdTenantId}/dashboard`)
    } else {
      router.push("/")
    }
  }

  const handleRetryBranding = async () => {
    setSubmitting(true)
    setSubmitError(null)

    if (
      submitProgress.uploadingLogo === "error" &&
      branding.logo?.file &&
      createdTenantId
    ) {
      setSubmitProgress({ uploadingLogo: "loading" })
      const logoResult = await uploadBrandingAsset(
        createdTenantId,
        "logo",
        branding.logo.file
      )
      if (logoResult.success) {
        setSubmitProgress({ uploadingLogo: "success" })
      } else {
        setSubmitProgress({ uploadingLogo: "error" })
        setSubmitError(logoResult.error)
        setSubmitting(false)
        return
      }
    }

    if (
      submitProgress.uploadingFavicon === "error" &&
      branding.favicon?.file &&
      createdTenantId
    ) {
      setSubmitProgress({ uploadingFavicon: "loading" })
      const faviconResult = await uploadBrandingAsset(
        createdTenantId,
        "favicon",
        branding.favicon.file
      )
      if (faviconResult.success) {
        setSubmitProgress({ uploadingFavicon: "success" })
      } else {
        setSubmitProgress({ uploadingFavicon: "error" })
        setSubmitError(faviconResult.error)
        setSubmitting(false)
        return
      }
    }

    setSubmitProgress({ completing: "success" })
    setSubmitting(false)
  }

  // Calculate progress percentage
  const progressSteps = [
    submitProgress.creating,
    submitProgress.uploadingLogo,
    submitProgress.uploadingFavicon,
    submitProgress.completing,
  ]
  const completedSteps = progressSteps.filter((s) => s === "success").length
  const progressPercent = (completedSteps / progressSteps.length) * 100

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-heading-lg text-foreground">
          {t.wizard.submit.title}
        </h2>
        <p className="mt-1 text-body-sm-regular text-muted-foreground">
          {isComplete
            ? t.wizard.submit.success.title
            : isPartialSuccess
            ? t.wizard.submit.partialSuccess.title
            : hasFailed
            ? t.wizard.submit.error.title
            : t.wizard.submit.description}
        </p>
      </div>

      {/* Progress Bar */}
      {!isComplete && !isPartialSuccess && !hasFailed && (
        <Progress value={progressPercent} className="h-2" />
      )}

      {/* Steps List */}
      <Card>
        <CardContent className="divide-y divide-border p-4">
          <SubmitStepItem
            label={t.wizard.submit.steps.creating}
            status={submitProgress.creating}
          />
          <SubmitStepItem
            label={t.wizard.submit.steps.uploadingLogo}
            status={submitProgress.uploadingLogo}
          />
          <SubmitStepItem
            label={t.wizard.submit.steps.uploadingFavicon}
            status={submitProgress.uploadingFavicon}
          />
          <SubmitStepItem
            label={t.wizard.submit.steps.completing}
            status={submitProgress.completing}
          />
        </CardContent>
      </Card>

      {/* Success State */}
      {isComplete && (
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
            <PartyPopper className="h-8 w-8 text-success-500" />
          </div>
          <div>
            <h3 className="text-body-lg-semibold text-foreground">
              {t.wizard.submit.success.title}
            </h3>
            <p className="text-body-sm-regular text-muted-foreground">
              {t.wizard.submit.success.description}
            </p>
          </div>
          <Button onClick={handleGoToDashboard}>
            {t.wizard.submit.success.goToDashboard}
          </Button>
        </div>
      )}

      {/* Partial Success State */}
      {isPartialSuccess && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.wizard.submit.partialSuccess.title}</AlertTitle>
          <AlertDescription>
            <p className="mb-3">{t.wizard.submit.partialSuccess.description}</p>
            <div className="flex gap-2">
              <Button variant="tertiary" size="sm" onClick={handleRetryBranding}>
                {t.wizard.submit.partialSuccess.retryBranding}
              </Button>
              <Button size="sm" onClick={handleGoToDashboard}>
                {t.wizard.submit.success.goToDashboard}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error State */}
      {hasFailed && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t.wizard.submit.error.title}</AlertTitle>
          <AlertDescription>
            <p className="mb-3">
              {submitError || t.wizard.submit.error.description}
            </p>
            <Button
              variant="tertiary"
              size="sm"
              onClick={() => {
                setHasStarted(false)
                setSubmitProgress({
                  creating: "idle",
                  uploadingLogo: "idle",
                  uploadingFavicon: "idle",
                  completing: "idle",
                })
                runSubmit()
              }}
            >
              {t.common.retry}
            </Button>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
