"use client"

import { useCallback, useEffect, useState } from "react"
import { useWizardStore } from "@/lib/wizard-store"
import { useT } from "@/lib/locale-context"
import { TenantType, type UniquenessStatus } from "@/lib/schemas"
import { normalizeText } from "@/lib/normalize"
import {
  validateTenantName,
  validateCompanyNames,
  validateNationalCode,
  getAbortController,
} from "@/lib/api/mock-api"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UniquenessIndicator } from "./uniqueness-indicator"
import { Building2, Building, Info, Lock } from "lucide-react"

interface UniquenessState {
  tenant_name: UniquenessStatus
  company_fullname: UniquenessStatus
  company_shortname: UniquenessStatus
  national_code: UniquenessStatus
}

interface UniquenessMessages {
  tenant_name?: string
  company_fullname?: string
  company_shortname?: string
  national_code?: string
}

export function StepIdentity() {
  const t = useT()
  const { identity, setIdentity } = useWizardStore()
  
  const [uniqueness, setUniqueness] = useState<UniquenessState>({
    tenant_name: "idle",
    company_fullname: "idle",
    company_shortname: "idle",
    national_code: "idle",
  })
  
  const [messages, setMessages] = useState<UniquenessMessages>({})

  // Check tenant_name uniqueness on blur
  const checkTenantName = useCallback(async () => {
    const value = identity.tenant_name.trim()
    if (value.length < 3) return

    setUniqueness((prev) => ({ ...prev, tenant_name: "checking" }))
    
    try {
      const controller = getAbortController("tenant_name")
      const result = await validateTenantName(value, controller.signal)
      
      if (result.error === "RATE_LIMITED") {
        setUniqueness((prev) => ({ ...prev, tenant_name: "cooldown" }))
        return
      }
      
      setUniqueness((prev) => ({
        ...prev,
        tenant_name: result.available ? "available" : "taken",
      }))
      setMessages((prev) => ({ ...prev, tenant_name: result.error }))
      
      // Update with normalized value if different
      if (result.normalized && result.normalized !== value) {
        setIdentity({ tenant_name: result.normalized })
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return
      setUniqueness((prev) => ({ ...prev, tenant_name: "error" }))
    }
  }, [identity.tenant_name, setIdentity])

  // Check company names on blur
  const checkCompanyNames = useCallback(async () => {
    const fullname = identity.company_fullname.trim()
    const shortname = identity.company_shortname.trim()
    if (fullname.length < 3 || shortname.length < 2) return

    setUniqueness((prev) => ({
      ...prev,
      company_fullname: "checking",
      company_shortname: "checking",
    }))
    
    try {
      const controller = getAbortController("company_names")
      const result = await validateCompanyNames(fullname, shortname, controller.signal)
      
      if (result.fullname.error === "RATE_LIMITED") {
        setUniqueness((prev) => ({
          ...prev,
          company_fullname: "cooldown",
          company_shortname: "cooldown",
        }))
        return
      }
      
      setUniqueness((prev) => ({
        ...prev,
        company_fullname: result.fullname.available ? "available" : "taken",
        company_shortname: result.shortname.available ? "available" : "taken",
      }))
      setMessages((prev) => ({
        ...prev,
        company_fullname: result.fullname.error,
        company_shortname: result.shortname.error,
      }))
    } catch (error) {
      if ((error as Error).name === "AbortError") return
      setUniqueness((prev) => ({
        ...prev,
        company_fullname: "error",
        company_shortname: "error",
      }))
    }
  }, [identity.company_fullname, identity.company_shortname])

  // Check national_code on blur or tenant_type change
  const checkNationalCode = useCallback(async () => {
    const value = identity.national_code.trim()
    if (value.length < 1) return

    setUniqueness((prev) => ({ ...prev, national_code: "checking" }))
    
    try {
      const controller = getAbortController("national_code")
      const result = await validateNationalCode(
        value,
        identity.tenant_type,
        controller.signal
      )
      
      if (result.error === "RATE_LIMITED") {
        setUniqueness((prev) => ({ ...prev, national_code: "cooldown" }))
        return
      }
      
      setUniqueness((prev) => ({
        ...prev,
        national_code: result.available ? "available" : "taken",
      }))
      setMessages((prev) => ({ ...prev, national_code: result.error }))
    } catch (error) {
      if ((error as Error).name === "AbortError") return
      setUniqueness((prev) => ({ ...prev, national_code: "error" }))
    }
  }, [identity.national_code, identity.tenant_type])

  // Re-check national_code when tenant_type changes
  useEffect(() => {
    if (identity.national_code.trim().length > 0) {
      checkNationalCode()
    }
  }, [identity.tenant_type])

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-heading-lg text-foreground">
          {t.wizard.identity.title}
        </h2>
        <p className="mt-1 text-body-sm-regular text-muted-foreground">
          {t.wizard.identity.description}
        </p>
      </div>

      {/* Tenant Name */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="tenant_name">
            {t.wizard.identity.tenantName.label}
          </Label>
          <Badge variant="warning" className="gap-1">
            <Lock className="h-3 w-3" />
            {t.wizard.identity.tenantName.immutable}
          </Badge>
        </div>
        <div className="flex items-center gap-3">
          <Input
            id="tenant_name"
            value={identity.tenant_name}
            onChange={(e) => {
              const normalized = normalizeText(e.target.value, "tenant_name")
              setIdentity({ tenant_name: normalized })
              setUniqueness((prev) => ({ ...prev, tenant_name: "idle" }))
            }}
            onBlur={checkTenantName}
            placeholder={t.wizard.identity.tenantName.placeholder}
            className="font-mono flex-1"
            aria-describedby="tenant_name_hint"
          />
          <UniquenessIndicator
            status={uniqueness.tenant_name}
            message={messages.tenant_name}
            onRetry={checkTenantName}
          />
        </div>
        <p id="tenant_name_hint" className="text-label-lg-regular text-muted-foreground">
          {t.wizard.identity.tenantName.hint}
        </p>
      </div>

      {/* Company Fullname */}
      <div className="space-y-2">
        <Label htmlFor="company_fullname">
          {t.wizard.identity.companyFullname.label}
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="company_fullname"
            value={identity.company_fullname}
            onChange={(e) => {
              setIdentity({ company_fullname: e.target.value })
              setUniqueness((prev) => ({ ...prev, company_fullname: "idle" }))
            }}
            onBlur={checkCompanyNames}
            placeholder={t.wizard.identity.companyFullname.placeholder}
            className="flex-1"
            aria-describedby="company_fullname_hint"
          />
          <UniquenessIndicator
            status={uniqueness.company_fullname}
            message={messages.company_fullname}
            onRetry={checkCompanyNames}
          />
        </div>
        <p id="company_fullname_hint" className="text-label-lg-regular text-muted-foreground">
          {t.wizard.identity.companyFullname.hint}
        </p>
      </div>

      {/* Company Shortname */}
      <div className="space-y-2">
        <Label htmlFor="company_shortname">
          {t.wizard.identity.companyShortname.label}
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="company_shortname"
            value={identity.company_shortname}
            onChange={(e) => {
              setIdentity({ company_shortname: e.target.value })
              setUniqueness((prev) => ({ ...prev, company_shortname: "idle" }))
            }}
            onBlur={checkCompanyNames}
            placeholder={t.wizard.identity.companyShortname.placeholder}
            className="flex-1"
            aria-describedby="company_shortname_hint"
          />
          <UniquenessIndicator
            status={uniqueness.company_shortname}
            message={messages.company_shortname}
            onRetry={checkCompanyNames}
          />
        </div>
        <p id="company_shortname_hint" className="text-label-lg-regular text-muted-foreground">
          {t.wizard.identity.companyShortname.hint}
        </p>
      </div>

      {/* National Code */}
      <div className="space-y-2">
        <Label htmlFor="national_code">
          {t.wizard.identity.nationalCode.label}
        </Label>
        <div className="flex items-center gap-3">
          <Input
            id="national_code"
            value={identity.national_code}
            onChange={(e) => {
              setIdentity({ national_code: e.target.value })
              setUniqueness((prev) => ({ ...prev, national_code: "idle" }))
            }}
            onBlur={checkNationalCode}
            placeholder={t.wizard.identity.nationalCode.placeholder}
            className="flex-1"
            aria-describedby="national_code_hint"
          />
          <UniquenessIndicator
            status={uniqueness.national_code}
            message={messages.national_code}
            onRetry={checkNationalCode}
          />
        </div>
        <p id="national_code_hint" className="text-label-lg-regular text-muted-foreground">
          {t.wizard.identity.nationalCode.hint}
        </p>
      </div>

      {/* Tenant Type */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Label>{t.wizard.identity.tenantType.label}</Label>
          <Badge variant="warning" className="gap-1">
            <Lock className="h-3 w-3" />
            {t.wizard.identity.tenantName.immutable}
          </Badge>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Holding */}
          <button
            type="button"
            onClick={() => setIdentity({ tenant_type: TenantType.HOLDING })}
            className={cn(
              "flex flex-col items-center gap-3 rounded-lg border-2 p-5 text-center transition-colors",
              identity.tenant_type === TenantType.HOLDING
                ? "border-primary bg-primary-100/30"
                : "border-border bg-card hover:border-primary/50"
            )}
            aria-pressed={identity.tenant_type === TenantType.HOLDING}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                identity.tenant_type === TenantType.HOLDING
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-body-lg-semibold text-foreground">
                {t.wizard.identity.tenantType.holding.title}
              </p>
              <p className="mt-1 text-label-lg-regular text-muted-foreground">
                {t.wizard.identity.tenantType.holding.description}
              </p>
            </div>
          </button>

          {/* Independent Company */}
          <button
            type="button"
            onClick={() => setIdentity({ tenant_type: TenantType.INDEPENDENT_COMPANY })}
            className={cn(
              "flex flex-col items-center gap-3 rounded-lg border-2 p-5 text-center transition-colors",
              identity.tenant_type === TenantType.INDEPENDENT_COMPANY
                ? "border-primary bg-primary-100/30"
                : "border-border bg-card hover:border-primary/50"
            )}
            aria-pressed={identity.tenant_type === TenantType.INDEPENDENT_COMPANY}
          >
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                identity.tenant_type === TenantType.INDEPENDENT_COMPANY
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Building className="h-6 w-6" />
            </div>
            <div>
              <p className="text-body-lg-semibold text-foreground">
                {t.wizard.identity.tenantType.independent.title}
              </p>
              <p className="mt-1 text-label-lg-regular text-muted-foreground">
                {t.wizard.identity.tenantType.independent.description}
              </p>
            </div>
          </button>
        </div>

        {/* Independent Company Warning */}
        {identity.tenant_type === TenantType.INDEPENDENT_COMPANY && (
          <Alert variant="info">
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t.wizard.identity.tenantType.independentWarning}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
