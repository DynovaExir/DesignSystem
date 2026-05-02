import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Tenant } from "../schemas"

export interface TenantState {
  tenants: Tenant[]
  activeTenantId: string | null
  isLoading: boolean
  error: string | null
  
  // Actions
  setTenants: (tenants: Tenant[]) => void
  setActiveTenant: (id: string | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  addTenant: (tenant: Tenant) => void
  getActiveTenant: () => Tenant | undefined
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      tenants: [],
      activeTenantId: null,
      isLoading: false,
      error: null,
      
      setTenants: (tenants) => set({ tenants, error: null }),
      
      setActiveTenant: (id) => {
        set({ activeTenantId: id })
        // Dispatch custom event for other components to react
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("tenantChanged", { detail: { id } }))
        }
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      addTenant: (tenant) =>
        set((state) => ({
          tenants: [...state.tenants, tenant],
        })),
      
      getActiveTenant: () => {
        const state = get()
        return state.tenants.find((t) => t.id === state.activeTenantId)
      },
    }),
    {
      name: "dynova.active_tenant_id",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeTenantId: state.activeTenantId,
      }),
    }
  )
)
