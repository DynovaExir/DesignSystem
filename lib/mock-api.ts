import { randomDelay } from "./utils"
import { v4 as uuidv4 } from "uuid"

// State toggle for controlling mock API behavior
export type MockApiState = {
  // Field validation behaviors
  fieldValidation: "normal" | "all-taken" | "network-error" | "rate-limited"
  // Submission behaviors
  submission:
    | "full-success"
    | "partial-logo-fail"
    | "partial-both-fail"
    | "hard-409-conflict"
    | "hard-422-validation"
    | "network-fail"
}

// Global state for demo purposes
let mockState: MockApiState = {
  fieldValidation: "normal",
  submission: "full-success",
}

export function setMockState(newState: Partial<MockApiState>) {
  mockState = { ...mockState, ...newState }
}

export function getMockState(): MockApiState {
  return mockState
}

// RFC 7807 error response
export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  instance?: string
  field?: string
}

// Validate tenant name
export interface ValidateNameResult {
  available: boolean
  normalized: string
}

export async function validateName(value: string): Promise<ValidateNameResult | ApiError> {
  await randomDelay(300, 800)

  if (mockState.fieldValidation === "network-error") {
    return {
      type: "about:blank",
      title: "خطای شبکه",
      status: 500,
      detail: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
    }
  }

  if (mockState.fieldValidation === "rate-limited") {
    return {
      type: "about:blank",
      title: "محدودیت نرخ",
      status: 429,
      detail: "بررسی‌های یکتایی موقتاً محدود شده است. چند ثانیه دیگر دوباره تلاش کنید.",
    }
  }

  const takenNames = ["acme-co", "dynova", "taken-name"]
  const normalized = value.toLowerCase().replace(/[^a-z0-9-]/g, "-")

  if (mockState.fieldValidation === "all-taken" || takenNames.includes(normalized)) {
    return { available: false, normalized }
  }

  return { available: true, normalized }
}

// Validate company names
export interface ValidateCompanyResult {
  fullname_available: boolean
  shortname_available: boolean
  normalized: {
    fullname: string
    shortname: string
  }
}

export async function validateCompany(
  fullname?: string,
  shortname?: string
): Promise<ValidateCompanyResult | ApiError> {
  await randomDelay(300, 800)

  if (mockState.fieldValidation === "network-error") {
    return {
      type: "about:blank",
      title: "خطای شبکه",
      status: 500,
      detail: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
    }
  }

  if (mockState.fieldValidation === "rate-limited") {
    return {
      type: "about:blank",
      title: "محدودیت نرخ",
      status: 429,
      detail: "بررسی‌های یکتایی موقتاً محدود شده است. چند ثانیه دیگر دوباره تلاش کنید.",
    }
  }

  const takenFullnames = ["Acme Corp", "شرکت آلفا"]
  const takenShortnames = ["Beta", "بتا"]

  const normalizedFullname = (fullname || "").trim()
  const normalizedShortname = (shortname || "").trim()

  const fullnameAvailable =
    mockState.fieldValidation !== "all-taken" && !takenFullnames.includes(normalizedFullname)
  const shortnameAvailable =
    mockState.fieldValidation !== "all-taken" && !takenShortnames.includes(normalizedShortname)

  return {
    fullname_available: fullnameAvailable,
    shortname_available: shortnameAvailable,
    normalized: {
      fullname: normalizedFullname,
      shortname: normalizedShortname,
    },
  }
}

// Validate national code
export interface ValidateNationalCodeResult {
  available: boolean
  normalized: string
}

export async function validateNationalCode(
  value: string,
  tenantType: "HOLDING" | "INDEPENDENT"
): Promise<ValidateNationalCodeResult | ApiError> {
  await randomDelay(300, 800)

  if (mockState.fieldValidation === "network-error") {
    return {
      type: "about:blank",
      title: "خطای شبکه",
      status: 500,
      detail: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
    }
  }

  if (mockState.fieldValidation === "rate-limited") {
    return {
      type: "about:blank",
      title: "محدودیت نرخ",
      status: 429,
      detail: "بررسی‌های یکتایی موقتاً محدود شده است. چند ثانیه دیگر دوباره تلاش کنید.",
    }
  }

  const normalized = value.replace(/[^0-9]/g, "")

  // 12345 is taken only for HOLDING
  const isTaken =
    mockState.fieldValidation === "all-taken" ||
    (normalized === "12345" && tenantType === "HOLDING")

  return {
    available: !isTaken,
    normalized,
  }
}

// Tenant creation
export interface TenantPayload {
  tenant_name: string
  tenant_type: "HOLDING" | "INDEPENDENT"
  company_fullname: string
  company_shortname: string
  national_code: string
  country?: string
  province?: string
  city?: string
  postal_code?: string
  street?: string
  phone?: string
  email?: string
  website?: string
  default_locale?: string
}

export interface CreateTenantResult {
  id: string
  tenant_name: string
  tenant_type: "HOLDING" | "INDEPENDENT"
  company_fullname: string
  company_shortname: string
  national_code: string
}

export async function createTenant(
  payload: TenantPayload
): Promise<CreateTenantResult | ApiError> {
  await randomDelay(500, 1000)

  if (mockState.submission === "network-fail") {
    return {
      type: "about:blank",
      title: "خطای شبکه",
      status: 500,
      detail: "خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.",
    }
  }

  if (mockState.submission === "hard-409-conflict") {
    return {
      type: "about:blank",
      title: "تداخل",
      status: 409,
      detail: "شناسه فنی مستأجر قبلاً استفاده شده است.",
      field: "tenant_name",
    }
  }

  if (mockState.submission === "hard-422-validation") {
    return {
      type: "about:blank",
      title: "خطای اعتبارسنجی",
      status: 422,
      detail: "کد پستی معتبر نیست.",
      field: "postal_code",
    }
  }

  return {
    id: uuidv4(),
    tenant_name: payload.tenant_name,
    tenant_type: payload.tenant_type,
    company_fullname: payload.company_fullname,
    company_shortname: payload.company_shortname,
    national_code: payload.national_code,
  }
}

// Upload logo
export interface UploadResult {
  success: boolean
  url?: string
}

export async function uploadLogo(
  _tenantId: string,
  _file: File
): Promise<UploadResult | ApiError> {
  await randomDelay(400, 900)

  if (
    mockState.submission === "partial-logo-fail" ||
    mockState.submission === "partial-both-fail"
  ) {
    return {
      type: "about:blank",
      title: "خطای بارگذاری",
      status: 400,
      detail: "ابعاد نامعتبر",
    }
  }

  return {
    success: true,
    url: "/placeholder-logo.png",
  }
}

// Upload favicon
export async function uploadFavicon(
  _tenantId: string,
  _file: File
): Promise<UploadResult | ApiError> {
  await randomDelay(300, 700)

  if (mockState.submission === "partial-both-fail") {
    return {
      type: "about:blank",
      title: "خطای بارگذاری",
      status: 400,
      detail: "فرمت نامعتبر",
    }
  }

  return {
    success: true,
    url: "/placeholder-favicon.png",
  }
}

// Helper to check if a result is an error
export function isApiError(result: unknown): result is ApiError {
  return typeof result === "object" && result !== null && "status" in result && "detail" in result
}
