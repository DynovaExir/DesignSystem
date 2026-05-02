"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTenant, type Tenant } from "./tenant-provider"
import { useLocale, useT } from "@/lib/locale-context"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Check, ChevronDown, Plus, RefreshCw, Search, Building2 } from "lucide-react"

function TenantAvatar({ tenant, size = "sm" }: { tenant: Tenant; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-6 w-6" : "h-8 w-8"
  const textClass = size === "sm" ? "text-label-sm-semibold" : "text-label-lg-semibold"

  if (tenant.logo_url) {
    return (
      <img
        src={tenant.logo_url}
        alt=""
        className={cn(sizeClass, "rounded-sm object-cover")}
      />
    )
  }

  // Monogram fallback
  const initials = tenant.company_shortname.slice(0, 2).toUpperCase()
  return (
    <div
      className={cn(
        sizeClass,
        "flex items-center justify-center rounded-sm bg-primary text-primary-foreground",
        textClass
      )}
    >
      {initials}
    </div>
  )
}

export function TenantSelector() {
  const router = useRouter()
  const { tenants, activeTenant, isLoading, setActiveTenant, refreshTenants, hasDirtyForms } = useTenant()
  const t = useT()
  const { direction } = useLocale()

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [pendingTenant, setPendingTenant] = useState<Tenant | null>(null)

  // Hide if only one tenant
  if (tenants.length <= 1 && !isLoading) {
    return null
  }

  // Filter tenants by search
  const filteredTenants = useMemo(() => {
    if (!searchQuery.trim()) return tenants
    const query = searchQuery.toLowerCase()
    return tenants.filter(
      (tenant) =>
        tenant.company_shortname.toLowerCase().includes(query) ||
        tenant.company_fullname.toLowerCase().includes(query) ||
        tenant.tenant_name.toLowerCase().includes(query)
    )
  }, [tenants, searchQuery])

  const showSearch = tenants.length > 7

  const handleTenantSelect = (tenant: Tenant) => {
    if (tenant.id === activeTenant?.id) {
      setOpen(false)
      return
    }

    if (hasDirtyForms) {
      setPendingTenant(tenant)
      setConfirmDialogOpen(true)
      return
    }

    setActiveTenant(tenant)
    setOpen(false)
    setSearchQuery("")
  }

  const confirmSwitch = () => {
    if (pendingTenant) {
      setActiveTenant(pendingTenant)
      setPendingTenant(null)
    }
    setConfirmDialogOpen(false)
    setOpen(false)
    setSearchQuery("")
  }

  const handleCreateTenant = () => {
    setOpen(false)
    router.push("/tenants/new")
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-40" />
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2" aria-label={t.tenantSelector.title}>
            {activeTenant && <TenantAvatar tenant={activeTenant} />}
            <span className="max-w-[120px] truncate">
              {activeTenant?.company_shortname || t.tenantSelector.title}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={direction === "rtl" ? "start" : "end"}
          className="w-64"
        >
          <DropdownMenuLabel>{t.tenantSelector.title}</DropdownMenuLabel>

          {showSearch && (
            <div className="p-2">
              <div className="relative">
                <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t.tenantSelector.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 ps-9"
                />
              </div>
            </div>
          )}

          <DropdownMenuSeparator />

          <div className="max-h-60 overflow-y-auto">
            {filteredTenants.map((tenant) => (
              <DropdownMenuItem
                key={tenant.id}
                onClick={() => handleTenantSelect(tenant)}
                className="flex items-center gap-3 py-2"
              >
                <TenantAvatar tenant={tenant} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-body-sm-semibold truncate">
                      {tenant.company_shortname}
                    </span>
                    <Badge variant="secondary" className="text-label-sm-semibold">
                      {tenant.tenant_type === "HOLDING"
                        ? t.tenantSelector.types.holding
                        : t.tenantSelector.types.independent}
                    </Badge>
                  </div>
                </div>
                {tenant.id === activeTenant?.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}

            {filteredTenants.length === 0 && (
              <div className="p-4 text-center text-body-sm-regular text-muted-foreground">
                {t.common.search} - {searchQuery}
              </div>
            )}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => refreshTenants()}>
            <RefreshCw className="h-4 w-4" />
            <span>{t.tenantSelector.refresh}</span>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleCreateTenant}>
            <Plus className="h-4 w-4" />
            <span>{t.tenantSelector.create}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirm Switch Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.tenantSelector.switchConfirm.title}</DialogTitle>
            <DialogDescription>
              {t.tenantSelector.switchConfirm.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button variant="destructive" onClick={confirmSwitch}>
              {t.common.yes}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
