"use client"

import { useCallback, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { FieldWrapper } from "@/components/wizard/field-wrapper"
import { Banner } from "@/components/wizard/banner"
import type { IdentityStepData, FieldState } from "@/lib/wizard-types"
import {
  validateName,
  validateCompany,
  validateNationalCode,
  isApiError,
} from "@/lib/mock-api"
import { toPersianDigits, toAsciiDigits } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface StepIdentityProps {
  data: IdentityStepData
  onChange: (data: IdentityStepData) => void
  serverError?: { message: string; field?: string }
}

export function StepIdentity({ data, onChange, serverError }: StepIdentityProps) {
  const cooldownTimers = useRef<Record<string, NodeJS.Timeout>>({})
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})

  // Update a single field
  const updateField = useCallback(
    (fieldName: keyof IdentityStepData, value: FieldState | string) => {
      onChange({ ...data, [fieldName]: value })
    },
    [data, onChange]
  )

  // Validate tenant name on blur
  const handleTenantNameBlur = useCallback(async () => {
    const value = data.tenant_name.value.trim()
    if (!value) {
      updateField("tenant_name", { ...data.tenant_name, status: "idle" })
      return
    }

    updateField("tenant_name", { ...data.tenant_name, status: "checking" })

    const result = await validateName(value)

    if (isApiError(result)) {
      if (result.status === 429) {
        updateField("tenant_name", { ...data.tenant_name, status: "cooldown" })
        // Set 10s cooldown
        cooldownTimers.current["tenant_name"] = setTimeout(() => {
          updateField("tenant_name", { value, status: "idle" })
        }, 10000)
      } else {
        updateField("tenant_name", {
          ...data.tenant_name,
          status: "error",
          message: result.detail,
        })
      }
      return
    }

    // Check if normalized value is different
    if (result.normalized !== value) {
      updateField("tenant_name", {
        value: result.normalized,
        status: result.available ? "available" : "taken",
        normalized: result.normalized,
      })
    } else {
      updateField("tenant_name", {
        ...data.tenant_name,
        status: result.available ? "available" : "taken",
      })
    }
  }, [data.tenant_name, updateField])

  // Validate company fullname on blur
  const handleFullnameBlur = useCallback(async () => {
    const value = data.company_fullname.value.trim()
    if (!value) {
      updateField("company_fullname", { ...data.company_fullname, status: "idle" })
      return
    }

    updateField("company_fullname", { ...data.company_fullname, status: "checking" })

    const result = await validateCompany(value, undefined)

    if (isApiError(result)) {
      if (result.status === 429) {
        updateField("company_fullname", { ...data.company_fullname, status: "cooldown" })
        cooldownTimers.current["company_fullname"] = setTimeout(() => {
          updateField("company_fullname", { value, status: "idle" })
        }, 10000)
      } else {
        updateField("company_fullname", {
          ...data.company_fullname,
          status: "error",
          message: result.detail,
        })
      }
      return
    }

    updateField("company_fullname", {
      ...data.company_fullname,
      status: result.fullname_available ? "available" : "taken",
    })
  }, [data.company_fullname, updateField])

  // Validate company shortname on blur
  const handleShortnameBlur = useCallback(async () => {
    const value = data.company_shortname.value.trim()
    if (!value) {
      updateField("company_shortname", { ...data.company_shortname, status: "idle" })
      return
    }

    updateField("company_shortname", { ...data.company_shortname, status: "checking" })

    const result = await validateCompany(undefined, value)

    if (isApiError(result)) {
      if (result.status === 429) {
        updateField("company_shortname", { ...data.company_shortname, status: "cooldown" })
        cooldownTimers.current["company_shortname"] = setTimeout(() => {
          updateField("company_shortname", { value, status: "idle" })
        }, 10000)
      } else {
        updateField("company_shortname", {
          ...data.company_shortname,
          status: "error",
          message: result.detail,
        })
      }
      return
    }

    updateField("company_shortname", {
      ...data.company_shortname,
      status: result.shortname_available ? "available" : "taken",
    })
  }, [data.company_shortname, updateField])

  // Validate national code on blur or tenant type change
  const validateNationalCodeField = useCallback(async () => {
    const value = toAsciiDigits(data.national_code.value.trim())
    if (!value) {
      updateField("national_code", { ...data.national_code, status: "idle" })
      return
    }

    updateField("national_code", { ...data.national_code, status: "checking" })

    const result = await validateNationalCode(value, data.tenant_type)

    if (isApiError(result)) {
      if (result.status === 429) {
        updateField("national_code", { ...data.national_code, status: "cooldown" })
        cooldownTimers.current["national_code"] = setTimeout(() => {
          updateField("national_code", { value: toPersianDigits(value), status: "idle" })
        }, 10000)
      } else {
        updateField("national_code", {
          ...data.national_code,
          status: "error",
          message: result.detail,
        })
      }
      return
    }

    updateField("national_code", {
      value: toPersianDigits(result.normalized),
      status: result.available ? "available" : "taken",
      normalized: result.normalized,
    })
  }, [data.national_code, data.tenant_type, updateField])

  // Re-validate national code when tenant type changes
  useEffect(() => {
    if (data.national_code.value.trim() && data.national_code.status !== "idle") {
      // Debounce the re-validation
      clearTimeout(debounceTimers.current["national_code_type"])
      debounceTimers.current["national_code_type"] = setTimeout(() => {
        validateNationalCodeField()
      }, 300)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.tenant_type])

  // Cleanup timers
  useEffect(() => {
    return () => {
      Object.values(cooldownTimers.current).forEach(clearTimeout)
      Object.values(debounceTimers.current).forEach(clearTimeout)
    }
  }, [])

  const hasFieldError = (fieldName: string) =>
    serverError?.field === fieldName

  return (
    <div className="space-y-6">
      <h2 className="text-heading-lg text-color-text-default">هویت</h2>

      {/* Server error banner */}
      {serverError && (
        <Banner variant="danger">{serverError.message}</Banner>
      )}

      <div className="space-y-4">
        {/* Tenant Name - LTR input */}
        <FieldWrapper
          label="شناسه فنی مستأجر"
          htmlFor="tenant_name"
          status={data.tenant_name.status}
          statusMessage={data.tenant_name.message}
          showImmutabilityWarning
          error={hasFieldError("tenant_name") ? serverError?.message : undefined}
        >
          <Input
            id="tenant_name"
            dir="ltr"
            value={data.tenant_name.value}
            onChange={(e) =>
              updateField("tenant_name", { value: e.target.value, status: "idle" })
            }
            onBlur={handleTenantNameBlur}
            placeholder="tenant-name"
            error={data.tenant_name.status === "taken" || data.tenant_name.status === "error" || hasFieldError("tenant_name")}
            className={cn(
              "ps-10", // Make room for status indicator
              data.tenant_name.status !== "idle" && "ps-10"
            )}
          />
        </FieldWrapper>

        {/* Tenant Type - Radio Group */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>نوع مستأجر</Label>
            <span className="cursor-help text-color-status-warning">
              {/* Immutability warning handled inline */}
            </span>
          </div>
          <RadioGroup
            value={data.tenant_type}
            onValueChange={(value) =>
              updateField("tenant_type", value as "HOLDING" | "INDEPENDENT")
            }
            className="flex gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="HOLDING" id="type-holding" />
              <Label htmlFor="type-holding" className="font-normal cursor-pointer">
                هلدینگ
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="INDEPENDENT" id="type-independent" />
              <Label htmlFor="type-independent" className="font-normal cursor-pointer">
                شرکت مستقل
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Company Fullname */}
        <FieldWrapper
          label="نام کامل قانونی شرکت"
          htmlFor="company_fullname"
          status={data.company_fullname.status}
          statusMessage={data.company_fullname.message}
        >
          <Input
            id="company_fullname"
            value={data.company_fullname.value}
            onChange={(e) =>
              updateField("company_fullname", { value: e.target.value, status: "idle" })
            }
            onBlur={handleFullnameBlur}
            placeholder="شرکت نمونه"
            error={data.company_fullname.status === "taken" || data.company_fullname.status === "error"}
            className={cn(data.company_fullname.status !== "idle" && "ps-10")}
          />
        </FieldWrapper>

        {/* Company Shortname */}
        <FieldWrapper
          label="نام کوتاه شرکت"
          htmlFor="company_shortname"
          status={data.company_shortname.status}
          statusMessage={data.company_shortname.message}
        >
          <Input
            id="company_shortname"
            value={data.company_shortname.value}
            onChange={(e) =>
              updateField("company_shortname", { value: e.target.value, status: "idle" })
            }
            onBlur={handleShortnameBlur}
            placeholder="نمونه"
            error={data.company_shortname.status === "taken" || data.company_shortname.status === "error"}
            className={cn(data.company_shortname.status !== "idle" && "ps-10")}
          />
        </FieldWrapper>

        {/* National Code */}
        <FieldWrapper
          label="شناسه ملی"
          htmlFor="national_code"
          status={data.national_code.status}
          statusMessage={data.national_code.message}
        >
          <Input
            id="national_code"
            value={data.national_code.value}
            onChange={(e) => {
              // Accept both Persian and ASCII digits
              const newValue = e.target.value
              updateField("national_code", { value: newValue, status: "idle" })
            }}
            onBlur={validateNationalCodeField}
            placeholder="۱۲۳۴۵۶۷۸۹۰"
            error={data.national_code.status === "taken" || data.national_code.status === "error"}
            className={cn(data.national_code.status !== "idle" && "ps-10")}
          />
        </FieldWrapper>
      </div>
    </div>
  )
}
