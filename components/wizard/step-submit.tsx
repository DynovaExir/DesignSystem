"use client"

import { useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/lib/contexts/locale-context"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { useTenantStore } from "@/lib/stores/tenant-store"
import { createTenant, uploadBrandingFile } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Loader2, Check, X, AlertCircle, ArrowRight, RefreshCw, PartyPopper } from "lucide-react"
import type { TenantType, LocaleType } from "@/lib/schemas"

interface StepSubmitProps {
  onGoToStep: (step: number) => void
}

export function StepSubmit({ onGoToStep }: StepSubmitProps) {
  const { t, dir } = useLocale()
  const router = useRouter()
  const {
    identity,
    contacts,
    branding,
    isSubmitting,
    setIsSubmitting,
    submitProgress,
    setSubmitProgress,
    createdTenantId,
    setCreatedTenantId,
    submitError,
    setSubmitError,
    reset,
  } = useWizardStore()
  const { addTenant, setActiveTenant } = useTenantStore()

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitProgress({ tenant: "in-progress", logo: "pending", favicon: "pending" })

    try {
      // Create tenant
      const result = await createTenant({
        tenant_name: identity.tenant_name,
        company_fullname: identity.company_fullname,
        company_shortname: identity.company_shortname,
        national_code: identity.national_code,
        tenant_type: identity.tenant_type as TenantType,
        country: contacts.country,
        province: contacts.province,
        city: contacts.city,
        postal_code: contacts.postal_code,
        street: contacts.street,
        phone: contacts.phone,
        email: contacts.email,
        website: contacts.website || undefined,
        default_locale: branding.default_locale as LocaleType,
      })

      setSubmitProgress({ tenant: "done" })
      setCreatedTenantId(result.tenant.id)
      addTenant(result.tenant)

      // Upload logo if provided
      if (branding.logo) {
        setSubmitProgress({ logo: "in-progress" })
        try {
          await uploadBrandingFile(result.tenant.id, "logo", branding.logo)
          setSubmitProgress({ logo: "done" })
        } catch {
          setSubmitProgress({ logo: "error" })
        }
      } else {
        setSubmitProgress({ logo: "skipped" })
      }

      // Upload favicon if provided
      if (branding.favicon) {
        setSubmitProgress({ favicon: "in-progress" })
        try {
          await uploadBrandingFile(result.tenant.id, "favicon", branding.favicon)
          setSubmitProgress({ favicon: "done" })
        } catch {
          setSubmitProgress({ favicon: "error" })
        }
      } else {
        setSubmitProgress({ favicon: "skipped" })
      }

      setIsSubmitting(false)
    } catch (error) {
      setIsSubmitting(false)
      setSubmitProgress({ tenant: "error" })

      // Handle 409 conflict
      const err = error as Error & { status?: number; field?: string }
      if (err.status === 409 && err.field) {
        // Go back to step 1 and focus the field
        onGoToStep(0)
        setSubmitError(`Conflict on field: ${err.field}`)
      } else {
        setSubmitError(t.httpErrors.serverError)
      }
    }
  }, [
    identity,
    contacts,
    branding,
    setIsSubmitting,
    setSubmitError,
    setSubmitProgress,
    setCreatedTenantId,
    addTenant,
    onGoToStep,
    t.httpErrors.serverError,
  ])

  // Auto-start submission on mount
  useEffect(() => {
    if (!isSubmitting && submitProgress.tenant === "pending") {
      handleSubmit()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRetryBranding = useCallback(async () => {
    if (!createdTenantId) return

    setIsSubmitting(true)

    // Retry logo if needed
    if (submitProgress.logo === "error" && branding.logo) {
      setSubmitProgress({ logo: "in-progress" })
      try {
        await uploadBrandingFile(createdTenantId, "logo", branding.logo)
        setSubmitProgress({ logo: "done" })
      } catch {
        setSubmitProgress({ logo: "error" })
      }
    }

    // Retry favicon if needed
    if (submitProgress.favicon === "error" && branding.favicon) {
      setSubmitProgress({ favicon: "in-progress" })
      try {
        await uploadBrandingFile(createdTenantId, "favicon", branding.favicon)
        setSubmitProgress({ favicon: "done" })
      } catch {
        setSubmitProgress({ favicon: "error" })
      }
    }

    setIsSubmitting(false)
  }, [createdTenantId, submitProgress, branding, setIsSubmitting, setSubmitProgress])

  const handleGoToDashboard = useCallback(() => {
    if (createdTenantId) {
      setActiveTenant(createdTenantId)
      reset()
      router.push(`/tenants/${createdTenantId}/dashboard`)
    }
  }, [createdTenantId, setActiveTenant, reset, router])

  const isFullSuccess =
    submitProgress.tenant === "done" &&
    (submitProgress.logo === "done" || submitProgress.logo === "skipped") &&
    (submitProgress.favicon === "done" || submitProgress.favicon === "skipped")

  const isPartialSuccess =
    submitProgress.tenant === "done" &&
    (submitProgress.logo === "error" || submitProgress.favicon === "error")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />
      case "in-progress":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />
      case "done":
        return <Check className="h-5 w-5 text-success" />
      case "error":
        return <X className="h-5 w-5 text-destructive" />
      case "skipped":
        return <div className="h-5 w-5 rounded-full border-2 border-muted bg-muted" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {isFullSuccess ? (
        <Card className="border-success/50 bg-success/5">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <PartyPopper className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-success">{t.submitStep.success}</CardTitle>
            <CardDescription>
              {identity.company_fullname}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleGoToDashboard} size="lg">
              {t.submitStep.goToDashboard}
              <ArrowRight className={cn("h-4 w-4 ms-2", dir === "rtl" && "rtl-flip")} />
            </Button>
          </CardContent>
        </Card>
      ) : isPartialSuccess ? (
        <Card className="border-warning/50 bg-warning/5">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-warning/10">
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
            <CardTitle className="text-warning">{t.submitStep.partialSuccess}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <ProgressItem
                label={t.submitStep.creatingTenant}
                status={submitProgress.tenant}
                icon={getStatusIcon(submitProgress.tenant)}
              />
              {branding.logo && (
                <ProgressItem
                  label={t.submitStep.uploadingLogo}
                  status={submitProgress.logo}
                  icon={getStatusIcon(submitProgress.logo)}
                />
              )}
              {branding.favicon && (
                <ProgressItem
                  label={t.submitStep.uploadingFavicon}
                  status={submitProgress.favicon}
                  icon={getStatusIcon(submitProgress.favicon)}
                />
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button
                variant="outline"
                onClick={handleRetryBranding}
                disabled={isSubmitting}
              >
                <RefreshCw className={cn("h-4 w-4 me-2", isSubmitting && "animate-spin")} />
                {t.submitStep.retryBranding}
              </Button>
              <Button onClick={handleGoToDashboard}>
                {t.submitStep.goToDashboard}
                <ArrowRight className={cn("h-4 w-4 ms-2", dir === "rtl" && "rtl-flip")} />
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : submitError ? (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <X className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-destructive">{t.error}</CardTitle>
            <CardDescription>{submitError}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => onGoToStep(0)}>
              {t.confirm.editSection}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">
              {t.submitStep.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t.submitStep.description}
            </p>
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            <ProgressItem
              label={t.submitStep.creatingTenant}
              status={submitProgress.tenant}
              icon={getStatusIcon(submitProgress.tenant)}
            />
            {branding.logo && (
              <ProgressItem
                label={t.submitStep.uploadingLogo}
                status={submitProgress.logo}
                icon={getStatusIcon(submitProgress.logo)}
              />
            )}
            {branding.favicon && (
              <ProgressItem
                label={t.submitStep.uploadingFavicon}
                status={submitProgress.favicon}
                icon={getStatusIcon(submitProgress.favicon)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ProgressItem({
  label,
  status,
  icon,
}: {
  label: string
  status: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
      {icon}
      <span
        className={cn(
          "text-sm",
          status === "done" && "text-foreground",
          status === "in-progress" && "text-primary font-medium",
          status === "pending" && "text-muted-foreground",
          status === "error" && "text-destructive",
          status === "skipped" && "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  )
}
