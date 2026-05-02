"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { TenantType } from "@/lib/schemas"

export interface Tenant {
  id: string
  tenant_name: string
  company_fullname: string
  company_shortname: string
  tenant_type: TenantType
  logo_url?: string
}

interface TenantContextType {
  tenants: Tenant[]
  activeTenant: Tenant | null
  isLoading: boolean
  setActiveTenant: (tenant: Tenant) => void
  refreshTenants: () => Promise<void>
  hasDirtyForms: boolean
  setHasDirtyForms: (dirty: boolean) => void
}

const TenantContext = createContext<TenantContextType | undefined>(undefined)

// Mock tenant data for demo
const MOCK_TENANTS: Tenant[] = [
  {
    id: "tenant_1",
    tenant_name: "acme-corp",
    company_fullname: "Acme Corporation",
    company_shortname: "Acme",
    tenant_type: "HOLDING",
    logo_url: undefined,
  },
  {
    id: "tenant_2",
    tenant_name: "beta-industries",
    company_fullname: "Beta Industries",
    company_shortname: "Beta",
    tenant_type: "HOLDING",
    logo_url: undefined,
  },
  {
    id: "tenant_3",
    tenant_name: "gamma-solutions",
    company_fullname: "Gamma Solutions",
    company_shortname: "Gamma",
    tenant_type: "INDEPENDENT_COMPANY",
    logo_url: undefined,
  },
]

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS)
  const [activeTenant, setActiveTenantState] = useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasDirtyForms, setHasDirtyForms] = useState(false)

  const setActiveTenant = useCallback((tenant: Tenant) => {
    setActiveTenantState(tenant)
    if (typeof window !== "undefined") {
      localStorage.setItem("dynova.active_tenant_id", tenant.id)
      // Fire custom event for tenant change
      window.dispatchEvent(new CustomEvent("tenantChanged", { detail: tenant }))
    }
  }, [])

  const refreshTenants = useCallback(async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    setTenants(MOCK_TENANTS)
    setIsLoading(false)
  }, [])

  // Load active tenant from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTenantId = localStorage.getItem("dynova.active_tenant_id")
      if (savedTenantId) {
        const tenant = MOCK_TENANTS.find((t) => t.id === savedTenantId)
        if (tenant) {
          setActiveTenantState(tenant)
        }
      } else if (MOCK_TENANTS.length > 0) {
        setActiveTenantState(MOCK_TENANTS[0])
      }
    }
  }, [])

  return (
    <TenantContext.Provider
      value={{
        tenants,
        activeTenant,
        isLoading,
        setActiveTenant,
        refreshTenants,
        hasDirtyForms,
        setHasDirtyForms,
      }}
    >
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider")
  }
  return context
}

export function useActiveTenant() {
  const { activeTenant } = useTenant()
  return activeTenant
}
