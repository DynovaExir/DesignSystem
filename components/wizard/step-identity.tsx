"use client"

import { useCallback, useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocale } from "@/lib/contexts/locale-context"
import { useWizardStore } from "@/lib/stores/wizard-store"
import { identitySchema, type IdentityFormData, type TenantType } from "@/lib/schemas"
import { normalizeText } from "@/lib/normalize"
import {
  validateTenantName,
  validateCompany,
  validateNationalCode,
  getRateLimitCooldown,
} from "@/lib/api/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UniquenessIndicator } from "./uniqueness-indicator"
import { cn } from "@/lib/utils"
import { Building2, Building, Info, Lock } from "lucide-react"

interface StepIdentityProps {
  onValidChange: (isValid: boolean) => void
}

export function StepIdentity({ onValidChange }: StepIdentityProps) {
  const { t, locale } = useLocale()
  const {
    identity,
    setIdentity,
    validationState,
    setValidationState,
    validationMessages,
    setValidationMessage,
    normalizedValues,
    setNormalizedValue,
  } = useWizardStore()

  const abortControllers = useRef<Record<string, AbortController>>({})
  const rateLimitBannerRef = useRef<HTMLDivElement>(null)

  const {
    register,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<IdentityFormData>({
    resolver: zodResolver(identitySchema),
    mode: "onChange",
    defaultValues: {
      tenant_name: identity.tenant_name,
      company_fullname: identity.company_fullname,
      company_shortname: identity.company_shortname,
      national_code: identity.national_code,
      tenant_type: identity.tenant_type as TenantType,
    },
  })

  const tenantType = watch("tenant_type")
  const tenantName = watch("tenant_name")
  const companyFullname = watch("company_fullname")
  const companyShortname = watch("company_shortname")
  const nationalCode = watch("national_code")

  // Sync form values to store
  useEffect(() => {
    setIdentity({
      tenant_name: tenantName,
      company_fullname: companyFullname,
      company_shortname: companyShortname,
      national_code: nationalCode,
      tenant_type: tenantType,
    })
  }, [tenantName, companyFullname, companyShortname, nationalCode, tenantType, setIdentity])

  // Report validity
  useEffect(() => {
    const allFieldsAvailable =
      validationState.tenant_name === "available" &&
      validationState.company_fullname === "available" &&
      validationState.company_shortname === "available" &&
      validationState.national_code === "available"

    onValidChange(isValid && allFieldsAvailable && !!tenantType)
  }, [isValid, validationState, tenantType, onValidChange])

  // Cancel pending request helper
  const cancelRequest = useCallback((key: string) => {
    if (abortControllers.current[key]) {
      abortControllers.current[key].abort()
    }
    abortControllers.current[key] = new AbortController()
    return abortControllers.current[key].signal
  }, [])

  // Handle rate limit
  const handleRateLimitError = useCallback(() => {
    const cooldown = getRateLimitCooldown()
    if (cooldown > 0 && rateLimitBannerRef.current) {
      rateLimitBannerRef.current.style.display = "block"
      setTimeout(() => {
        if (rateLimitBannerRef.current) {
          rateLimitBannerRef.current.style.display = "none"
        }
      }, cooldown)
    }
  }, [])

  // Validate tenant name on blur
  const handleTenantNameBlur = useCallback(async () => {
    const value = normalizeText(tenantName, "tenant_name")
    if (!value || value.length < 3) return

    setValidationState("tenant_name", "checking")
    const signal = cancelRequest("tenant_name")

    try {
      const result = await validateTenantName(value, signal)
      setValidationState("tenant_name", result.available ? "available" : "taken")
      setValidationMessage("tenant_name", result.message)
      setNormalizedValue("tenant_name", result.normalized)
      if (result.normalized !== value) {
        setValue("tenant_name", result.normalized)
      }
    } catch (error) {
      if ((error as Error).message === "429") {
        handleRateLimitError()
        setValidationState("tenant_name", "error")
      } else if ((error as Error).message !== "Aborted") {
        setValidationState("tenant_name", "error")
      }
    }
  }, [tenantName, cancelRequest, setValidationState, setValidationMessage, setNormalizedValue, setValue, handleRateLimitError])

  // Validate company names on blur
  const handleCompanyBlur = useCallback(async () => {
    const fullname = normalizeText(companyFullname, "company_fullname")
    const shortname = normalizeText(companyShortname, "company_shortname")
    if (!fullname || fullname.length < 3 || !shortname || shortname.length < 2) return

    setValidationState("company_fullname", "checking")
    setValidationState("company_shortname", "checking")
    const signal = cancelRequest("company")

    try {
      const result = await validateCompany(fullname, shortname, signal)
      
      setValidationState("company_fullname", result.fullname.available ? "available" : "taken")
      setValidationMessage("company_fullname", result.fullname.message)
      setNormalizedValue("company_fullname", result.fullname.normalized)
      
      setValidationState("company_shortname", result.shortname.available ? "available" : "taken")
      setValidationMessage("company_shortname", result.shortname.message)
      setNormalizedValue("company_shortname", result.shortname.normalized)
    } catch (error) {
      if ((error as Error).message === "429") {
        handleRateLimitError()
        setValidationState("company_fullname", "error")
        setValidationState("company_shortname", "error")
      } else if ((error as Error).message !== "Aborted") {
        setValidationState("company_fullname", "error")
        setValidationState("company_shortname", "error")
      }
    }
  }, [companyFullname, companyShortname, cancelRequest, setValidationState, setValidationMessage, setNormalizedValue, handleRateLimitError])

  // Validate national code on blur (also re-check when tenant_type changes)
  const handleNationalCodeBlur = useCallback(async () => {
    const value = normalizeText(nationalCode, "national_code")
    if (!value || !tenantType) return

    setValidationState("national_code", "checking")
    const signal = cancelRequest("national_code")

    try {
      const result = await validateNationalCode(value, tenantType, signal)
      setValidationState("national_code", result.available ? "available" : "taken")
      setValidationMessage("national_code", result.message)
      setNormalizedValue("national_code", result.normalized)
    } catch (error) {
      if ((error as Error).message === "429") {
        handleRateLimitError()
        setValidationState("national_code", "error")
      } else if ((error as Error).message !== "Aborted") {
        setValidationState("national_code", "error")
      }
    }
  }, [nationalCode, tenantType, cancelRequest, setValidationState, setValidationMessage, setNormalizedValue, handleRateLimitError])

  // Re-validate national code when tenant type changes
  useEffect(() => {
    if (tenantType && nationalCode && validationState.national_code !== "idle") {
      handleNationalCodeBlur()
    }
  }, [tenantType]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTenantTypeChange = (type: TenantType) => {
    setValue("tenant_type", type)
    trigger("tenant_type")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          {t.identity.title}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {t.identity.description}
        </p>
      </div>

      {/* Rate limit banner */}
      <div
        ref={rateLimitBannerRef}
        className="hidden"
      >
        <Alert variant="warning">
          <AlertDescription>{t.httpErrors.tooManyRequests}</AlertDescription>
        </Alert>
      </div>

      <div className="space-y-4">
        {/* Tenant Name */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="tenant_name">{t.identity.tenantName}</Label>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Lock className="h-3 w-3" />
              {t.immutable}
            </Badge>
          </div>
          <div className="relative">
            <Input
              id="tenant_name"
              {...register("tenant_name")}
              className={cn(
                "font-mono-hint pe-32",
                errors.tenant_name && "border-destructive"
              )}
              placeholder="acme-corp"
              onBlur={handleTenantNameBlur}
              dir="ltr"
            />
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              <UniquenessIndicator
                state={validationState.tenant_name}
                message={validationMessages.tenant_name}
                normalizedValue={normalizedValues.tenant_name}
                originalValue={tenantName}
                onRetry={handleTenantNameBlur}
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t.identity.tenantNameHint}
          </p>
          {errors.tenant_name && (
            <p className="text-xs text-destructive">
              {t.validation[errors.tenant_name.message as keyof typeof t.validation]}
            </p>
          )}
        </div>

        {/* Company Full Name */}
        <div className="space-y-2">
          <Label htmlFor="company_fullname">{t.identity.companyFullname}</Label>
          <div className="relative">
            <Input
              id="company_fullname"
              {...register("company_fullname")}
              className={cn(
                "pe-32",
                errors.company_fullname && "border-destructive"
              )}
              onBlur={handleCompanyBlur}
            />
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              <UniquenessIndicator
                state={validationState.company_fullname}
                message={validationMessages.company_fullname}
                normalizedValue={normalizedValues.company_fullname}
                originalValue={companyFullname}
                onRetry={handleCompanyBlur}
              />
            </div>
          </div>
          {errors.company_fullname && (
            <p className="text-xs text-destructive">
              {t.validation[errors.company_fullname.message as keyof typeof t.validation]}
            </p>
          )}
        </div>

        {/* Company Short Name */}
        <div className="space-y-2">
          <Label htmlFor="company_shortname">{t.identity.companyShortname}</Label>
          <div className="relative">
            <Input
              id="company_shortname"
              {...register("company_shortname")}
              className={cn(
                "pe-32",
                errors.company_shortname && "border-destructive"
              )}
              onBlur={handleCompanyBlur}
            />
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              <UniquenessIndicator
                state={validationState.company_shortname}
                message={validationMessages.company_shortname}
                normalizedValue={normalizedValues.company_shortname}
                originalValue={companyShortname}
                onRetry={handleCompanyBlur}
              />
            </div>
          </div>
          {errors.company_shortname && (
            <p className="text-xs text-destructive">
              {t.validation[errors.company_shortname.message as keyof typeof t.validation]}
            </p>
          )}
        </div>

        {/* National Code */}
        <div className="space-y-2">
          <Label htmlFor="national_code">{t.identity.nationalCode}</Label>
          <div className="relative">
            <Input
              id="national_code"
              {...register("national_code")}
              className={cn(
                "pe-32",
                errors.national_code && "border-destructive"
              )}
              onBlur={handleNationalCodeBlur}
            />
            <div className="absolute end-3 top-1/2 -translate-y-1/2">
              <UniquenessIndicator
                state={validationState.national_code}
                message={validationMessages.national_code}
                normalizedValue={normalizedValues.national_code}
                originalValue={nationalCode}
                onRetry={handleNationalCodeBlur}
              />
            </div>
          </div>
          {errors.national_code && (
            <p className="text-xs text-destructive">
              {t.validation[errors.national_code.message as keyof typeof t.validation]}
            </p>
          )}
        </div>

        {/* Tenant Type */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Label>{t.identity.tenantType}</Label>
            <Badge variant="secondary" className="gap-1 text-xs">
              <Lock className="h-3 w-3" />
              {t.immutable}
            </Badge>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Holding Tile */}
            <button
              type="button"
              onClick={() => handleTenantTypeChange("HOLDING")}
              className={cn(
                "relative flex flex-col items-center gap-3 rounded-md border-2 p-6 text-center transition-all",
                "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                tenantType === "HOLDING"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <Building2 className="h-10 w-10 text-primary" />
              <div>
                <p className="font-medium">{t.tenantTypeHolding}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.tenantTypeHoldingDesc}
                </p>
              </div>
              {tenantType === "HOLDING" && (
                <div className="absolute end-3 top-3 h-3 w-3 rounded-full bg-primary" />
              )}
            </button>

            {/* Independent Company Tile */}
            <button
              type="button"
              onClick={() => handleTenantTypeChange("INDEPENDENT_COMPANY")}
              className={cn(
                "relative flex flex-col items-center gap-3 rounded-md border-2 p-6 text-center transition-all",
                "hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                tenantType === "INDEPENDENT_COMPANY"
                  ? "border-primary bg-primary/5"
                  : "border-border"
              )}
            >
              <Building className="h-10 w-10 text-primary" />
              <div>
                <p className="font-medium">{t.tenantTypeIndependent}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.tenantTypeIndependentDesc}
                </p>
              </div>
              {tenantType === "INDEPENDENT_COMPANY" && (
                <div className="absolute end-3 top-3 h-3 w-3 rounded-full bg-primary" />
              )}
            </button>
          </div>

          {/* Independent company warning */}
          {tenantType === "INDEPENDENT_COMPANY" && (
            <Alert variant="info">
              <Info className="h-4 w-4" />
              <AlertDescription>
                {t.independentCompanyWarning}
              </AlertDescription>
            </Alert>
          )}

          {errors.tenant_type && (
            <p className="text-xs text-destructive">
              {t.validation.tenantTypeRequired}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
