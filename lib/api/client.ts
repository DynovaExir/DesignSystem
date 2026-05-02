import type { TenantType, Tenant, CreateTenantData } from "../schemas"

// Simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const randomDelay = () => delay(200 + Math.random() * 300)

// Seeded "taken" values for demo
const TAKEN_VALUES = {
  tenant_name: ["acme-co", "beta-industries"],
  company_fullname: ["Acme Corp", "Beta Industries"],
  company_shortname: ["Acme", "Beta"],
  national_code_HOLDING: ["12345"],
  national_code_INDEPENDENT_COMPANY: ["67890"],
}

// Active tenant header
let activeTenantId: string | null = null

export function setActiveTenant(id: string | null) {
  activeTenantId = id
}

export function getActiveTenant(): string | null {
  return activeTenantId
}

// Base fetch wrapper with tenant header
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  signal?: AbortSignal
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  
  if (activeTenantId) {
    headers["X-Dynova-Tenant"] = activeTenantId
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
    signal,
  })
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  
  return response.json()
}

// Validation response type
export interface ValidationResponse {
  available: boolean
  normalized: string
  message?: string
}

// Rate limiting state
let rateLimitedUntil: number | null = null
let requestCount = 0
const RATE_LIMIT_WINDOW = 10000 // 10 seconds
const RATE_LIMIT_MAX = 20

function checkRateLimit(): boolean {
  const now = Date.now()
  
  if (rateLimitedUntil && now < rateLimitedUntil) {
    return false
  }
  
  rateLimitedUntil = null
  requestCount++
  
  if (requestCount > RATE_LIMIT_MAX) {
    rateLimitedUntil = now + RATE_LIMIT_WINDOW
    requestCount = 0
    return false
  }
  
  // Reset counter periodically
  setTimeout(() => {
    requestCount = Math.max(0, requestCount - 1)
  }, RATE_LIMIT_WINDOW / RATE_LIMIT_MAX)
  
  return true
}

export function getRateLimitCooldown(): number {
  if (!rateLimitedUntil) return 0
  return Math.max(0, rateLimitedUntil - Date.now())
}

// Mock validation endpoints
export async function validateTenantName(
  name: string,
  signal?: AbortSignal
): Promise<ValidationResponse> {
  if (!checkRateLimit()) {
    throw new Error("429")
  }
  
  await randomDelay()
  
  if (signal?.aborted) {
    throw new Error("Aborted")
  }
  
  const normalized = name.toLowerCase().trim()
  const isTaken = TAKEN_VALUES.tenant_name.includes(normalized)
  
  return {
    available: !isTaken,
    normalized,
    message: isTaken ? "This tenant name is already taken" : undefined,
  }
}

export async function validateCompany(
  fullname: string,
  shortname: string,
  signal?: AbortSignal
): Promise<{ fullname: ValidationResponse; shortname: ValidationResponse }> {
  if (!checkRateLimit()) {
    throw new Error("429")
  }
  
  await randomDelay()
  
  if (signal?.aborted) {
    throw new Error("Aborted")
  }
  
  const normalizedFullname = fullname.trim()
  const normalizedShortname = shortname.trim()
  
  const fullnameTaken = TAKEN_VALUES.company_fullname.some(
    (v) => v.toLowerCase() === normalizedFullname.toLowerCase()
  )
  const shortnameTaken = TAKEN_VALUES.company_shortname.some(
    (v) => v.toLowerCase() === normalizedShortname.toLowerCase()
  )
  
  return {
    fullname: {
      available: !fullnameTaken,
      normalized: normalizedFullname,
      message: fullnameTaken ? "This company name is already taken" : undefined,
    },
    shortname: {
      available: !shortnameTaken,
      normalized: normalizedShortname,
      message: shortnameTaken ? "This short name is already taken" : undefined,
    },
  }
}

export async function validateNationalCode(
  code: string,
  tenantType: TenantType,
  signal?: AbortSignal
): Promise<ValidationResponse> {
  if (!checkRateLimit()) {
    throw new Error("429")
  }
  
  await randomDelay()
  
  if (signal?.aborted) {
    throw new Error("Aborted")
  }
  
  const normalized = code.trim()
  const takenCodes = TAKEN_VALUES[`national_code_${tenantType}`] || []
  const isTaken = takenCodes.includes(normalized)
  
  return {
    available: !isTaken,
    normalized,
    message: isTaken
      ? `This national code is already used by another ${tenantType === "HOLDING" ? "holding" : "company"}`
      : undefined,
  }
}

// Mock tenant list for selector
export const MOCK_TENANTS: Tenant[] = [
  {
    id: "tenant-1",
    tenant_name: "acme-corp",
    company_fullname: "Acme Corp",
    company_shortname: "Acme",
    national_code: "12345",
    tenant_type: "HOLDING",
    country: "IR",
    province: "Tehran",
    city: "Tehran",
    postal_code: "1234567890",
    street: "Valiasr St.",
    phone: "+982112345678",
    email: "info@acme.com",
    website: "https://acme.com",
    logo_url: undefined,
    favicon_url: undefined,
    default_locale: "fa",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "tenant-2",
    tenant_name: "beta-industries",
    company_fullname: "Beta Industries",
    company_shortname: "Beta",
    national_code: "67890",
    tenant_type: "HOLDING",
    country: "IR",
    province: "Isfahan",
    city: "Isfahan",
    postal_code: "8123456789",
    street: "Chahar Bagh St.",
    phone: "+983112345678",
    email: "info@beta.com",
    default_locale: "fa",
    created_at: "2024-02-20T14:30:00Z",
    updated_at: "2024-02-20T14:30:00Z",
  },
  {
    id: "tenant-3",
    tenant_name: "gamma-solutions",
    company_fullname: "Gamma Solutions",
    company_shortname: "Gamma",
    national_code: "11111",
    tenant_type: "INDEPENDENT_COMPANY",
    country: "IR",
    province: "Shiraz",
    city: "Shiraz",
    postal_code: "7123456789",
    street: "Eram St.",
    phone: "+987112345678",
    email: "info@gamma.com",
    default_locale: "en",
    created_at: "2024-03-10T09:15:00Z",
    updated_at: "2024-03-10T09:15:00Z",
  },
]

export async function fetchTenants(signal?: AbortSignal): Promise<Tenant[]> {
  await randomDelay()
  
  if (signal?.aborted) {
    throw new Error("Aborted")
  }
  
  return [...MOCK_TENANTS]
}

// Mock create tenant
let tenantIdCounter = 4

export interface CreateTenantResponse {
  tenant: Tenant
}

export async function createTenant(
  data: Omit<CreateTenantData, "logo" | "favicon">,
  signal?: AbortSignal
): Promise<CreateTenantResponse> {
  await delay(800 + Math.random() * 400)
  
  if (signal?.aborted) {
    throw new Error("Aborted")
  }
  
  // Check for conflicts
  if (TAKEN_VALUES.tenant_name.includes(data.tenant_name)) {
    const error = new Error("Conflict") as Error & { field: string; status: number }
    error.status = 409
    error.field = "tenant_name"
    throw error
  }
  
  const tenant: Tenant = {
    id: `tenant-${tenantIdCounter++}`,
    tenant_name: data.tenant_name,
    company_fullname: data.company_fullname,
    company_shortname: data.company_shortname,
    national_code: data.national_code,
    tenant_type: data.tenant_type,
    country: data.country,
    province: data.province,
    city: data.city,
    postal_code: data.postal_code,
    street: data.street,
    phone: data.phone,
    email: data.email,
    website: data.website || undefined,
    default_locale: data.default_locale,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  
  return { tenant }
}

// Mock file upload
export async function uploadBrandingFile(
  tenantId: string,
  type: "logo" | "favicon",
  _file: File,
  signal?: AbortSignal
): Promise<{ url: string }> {
  await delay(500 + Math.random() * 500)
  
  if (signal?.aborted) {
    throw new Error("Aborted")
  }
  
  // Simulate occasional failure for demo (10% chance)
  if (Math.random() < 0.1) {
    throw new Error("Upload failed")
  }
  
  return {
    url: `/uploads/${tenantId}/${type}-${Date.now()}.png`,
  }
}
