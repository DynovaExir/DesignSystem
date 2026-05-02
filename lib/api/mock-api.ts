import { normalizeText } from "@/lib/normalize"
import type { TenantType, ValidationResponse, TenantResponse } from "@/lib/schemas"

// Seeded "taken" values for demo
const TAKEN_TENANT_NAMES = ["acme-co", "demo-tenant", "test-company"]
const TAKEN_COMPANY_FULLNAMES = ["Acme Corp", "شرکت آکمه"]
const TAKEN_COMPANY_SHORTNAMES = ["Acme", "آکمه"]
const TAKEN_NATIONAL_CODES: Record<TenantType, string[]> = {
  HOLDING: ["12345", "67890"],
  INDEPENDENT_COMPANY: ["11111"],
}

// Simulate network latency
function delay(ms: number = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * ms))
}

// Rate limiting state
let lastCallTime = 0
let callCount = 0
const RATE_LIMIT_WINDOW = 10000 // 10 seconds
const MAX_CALLS_PER_WINDOW = 20

function checkRateLimit(): boolean {
  const now = Date.now()
  if (now - lastCallTime > RATE_LIMIT_WINDOW) {
    callCount = 0
    lastCallTime = now
  }
  callCount++
  return callCount > MAX_CALLS_PER_WINDOW
}

// Abort controller registry for cancellation
const abortControllers = new Map<string, AbortController>()

export function getAbortController(key: string): AbortController {
  // Cancel previous request if exists
  const existing = abortControllers.get(key)
  if (existing) {
    existing.abort()
  }
  
  const controller = new AbortController()
  abortControllers.set(key, controller)
  return controller
}

export function cancelRequest(key: string): void {
  const controller = abortControllers.get(key)
  if (controller) {
    controller.abort()
    abortControllers.delete(key)
  }
}

/**
 * Validate tenant_name uniqueness
 */
export async function validateTenantName(
  name: string,
  signal?: AbortSignal
): Promise<ValidationResponse> {
  if (checkRateLimit()) {
    return { available: false, error: "RATE_LIMITED" }
  }
  
  await delay(400)
  
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError")
  }
  
  const normalized = normalizeText(name, "tenant_name")
  const available = !TAKEN_TENANT_NAMES.includes(normalized)
  
  return {
    available,
    normalized,
    error: available ? undefined : "This tenant name is already in use",
  }
}

/**
 * Validate company_fullname and company_shortname uniqueness
 */
export async function validateCompanyNames(
  fullname: string,
  shortname: string,
  signal?: AbortSignal
): Promise<{ fullname: ValidationResponse; shortname: ValidationResponse }> {
  if (checkRateLimit()) {
    return {
      fullname: { available: false, error: "RATE_LIMITED" },
      shortname: { available: false, error: "RATE_LIMITED" },
    }
  }
  
  await delay(400)
  
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError")
  }
  
  const normalizedFullname = normalizeText(fullname, "company_fullname")
  const normalizedShortname = normalizeText(shortname, "company_shortname")
  
  const fullnameAvailable = !TAKEN_COMPANY_FULLNAMES.some(
    (taken) => taken.toLowerCase() === normalizedFullname.toLowerCase()
  )
  const shortnameAvailable = !TAKEN_COMPANY_SHORTNAMES.some(
    (taken) => taken.toLowerCase() === normalizedShortname.toLowerCase()
  )
  
  return {
    fullname: {
      available: fullnameAvailable,
      normalized: normalizedFullname,
      error: fullnameAvailable ? undefined : "This company name is already in use",
    },
    shortname: {
      available: shortnameAvailable,
      normalized: normalizedShortname,
      error: shortnameAvailable ? undefined : "This short name is already in use",
    },
  }
}

/**
 * Validate national_code uniqueness per tenant_type
 */
export async function validateNationalCode(
  code: string,
  tenantType: TenantType,
  signal?: AbortSignal
): Promise<ValidationResponse> {
  if (checkRateLimit()) {
    return { available: false, error: "RATE_LIMITED" }
  }
  
  await delay(300)
  
  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError")
  }
  
  const normalized = normalizeText(code, "national_code")
  const takenCodes = TAKEN_NATIONAL_CODES[tenantType] || []
  const available = !takenCodes.includes(normalized)
  
  return {
    available,
    normalized,
    error: available ? undefined : `This national code is already used by another ${tenantType === "HOLDING" ? "holding" : "company"}`,
  }
}

/**
 * Create a new tenant
 */
export async function createTenant(data: {
  tenant_name: string
  company_fullname: string
  company_shortname: string
  national_code: string
  tenant_type: TenantType
  contacts: {
    address: {
      country: string
      province: string
      city: string
      postal_code: string
      street: string
    }
    phone: string
    email: string
    website?: string
  }
  default_locale: string
}): Promise<{ success: true; data: TenantResponse } | { success: false; error: string; field?: string }> {
  await delay(800)
  
  // Check for conflicts one more time
  if (TAKEN_TENANT_NAMES.includes(data.tenant_name)) {
    return {
      success: false,
      error: "Tenant name conflict",
      field: "tenant_name",
    }
  }
  
  // Simulate successful creation
  const tenant: TenantResponse = {
    id: `tenant_${Date.now()}`,
    tenant_name: data.tenant_name,
    company_fullname: data.company_fullname,
    company_shortname: data.company_shortname,
    national_code: data.national_code,
    tenant_type: data.tenant_type,
    created_at: new Date().toISOString(),
  }
  
  return { success: true, data: tenant }
}

/**
 * Upload branding assets
 */
export async function uploadBrandingAsset(
  tenantId: string,
  type: "logo" | "favicon",
  file: File
): Promise<{ success: true; url: string } | { success: false; error: string }> {
  await delay(600)
  
  // Validate file type
  const allowedTypes = type === "logo"
    ? ["image/png", "image/svg+xml"]
    : ["image/png", "image/x-icon", "image/vnd.microsoft.icon", "image/svg+xml"]
  
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: "Invalid file type" }
  }
  
  // Validate file size
  const maxSize = type === "logo" ? 500 * 1024 : 100 * 1024
  if (file.size > maxSize) {
    return { success: false, error: "File too large" }
  }
  
  // Simulate successful upload
  return {
    success: true,
    url: `https://cdn.dynova.app/tenants/${tenantId}/${type}/${file.name}`,
  }
}
