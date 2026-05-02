"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/lib/contexts/locale-context"
import { useTenantStore } from "@/lib/stores/tenant-store"
import { useDirtyFormsStore } from "@/lib/hooks/use-dirty-forms"
import { fetchTenants } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { ChevronDown, Check, RefreshCw, Plus, Building2 } from "lucide-react"
import type { Tenant } from "@/lib/schemas"

interface TenantSelectorProps {
  isPlatformAdmin?: boolean
}

export function TenantSelector({ isPlatformAdmin = true }: TenantSelectorProps) {
  const { t, dir } = useLocale()
  const router = useRouter()
  const {
    tenants,
    activeTenantId,
    isLoading,
    setTenants,
    setActiveTenant,
    setLoading,
    getActiveTenant,
  } = useTenantStore()
  const { hasDirtyForms } = useDirtyFormsStore()

  const [open, setOpen] = useState(false)
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [pendingTenantId, setPendingTenantId] = useState<string | null>(null)

  const activeTenant = getActiveTenant()
  const showSearch = tenants.length > 7

  // Fetch tenants on mount
  useEffect(() => {
    const loadTenants = async () => {
      setLoading(true)
      try {
        const data = await fetchTenants()
        setTenants(data)
        // Set first tenant as active if none selected
        if (!activeTenantId && data.length > 0) {
          setActiveTenant(data[0].id)
        }
      } catch (error) {
        console.error("Failed to fetch tenants:", error)
      } finally {
        setLoading(false)
      }
    }

    if (tenants.length === 0) {
      loadTenants()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchTenants()
      setTenants(data)
    } catch (error) {
      console.error("Failed to refresh tenants:", error)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setTenants])

  const handleSelectTenant = useCallback(
    (tenantId: string) => {
      if (tenantId === activeTenantId) {
        setOpen(false)
        return
      }

      // Check for dirty forms
      if (hasDirtyForms()) {
        setPendingTenantId(tenantId)
        setShowWarningDialog(true)
        setOpen(false)
        return
      }

      setActiveTenant(tenantId)
      setOpen(false)
    },
    [activeTenantId, hasDirtyForms, setActiveTenant]
  )

  const handleConfirmSwitch = useCallback(() => {
    if (pendingTenantId) {
      setActiveTenant(pendingTenantId)
      setPendingTenantId(null)
    }
    setShowWarningDialog(false)
  }, [pendingTenantId, setActiveTenant])

  const handleCancelSwitch = useCallback(() => {
    setPendingTenantId(null)
    setShowWarningDialog(false)
  }, [])

  const handleCreateNew = useCallback(() => {
    setOpen(false)
    router.push("/tenants/new")
  }, [router])

  // Don't show selector if only one tenant
  if (tenants.length <= 1 && !isPlatformAdmin) {
    return null
  }

  // Loading skeleton
  if (isLoading && tenants.length === 0) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-4 w-24" />
      </div>
    )
  }

  const getMonogram = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  const content = showSearch ? (
    // Combobox for many tenants
    <Command>
      <CommandInput placeholder={t.tenantSelector.search} />
      <CommandList>
        <CommandEmpty>No tenants found</CommandEmpty>
        <CommandGroup>
          {tenants.map((tenant) => (
            <CommandItem
              key={tenant.id}
              value={tenant.company_shortname}
              onSelect={() => handleSelectTenant(tenant.id)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Avatar className="h-6 w-6 rounded-md">
                {tenant.logo_url ? (
                  <AvatarImage src={tenant.logo_url} alt={tenant.company_shortname} />
                ) : null}
                <AvatarFallback className="rounded-md text-xs bg-muted">
                  {getMonogram(tenant.company_shortname)}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate">{tenant.company_shortname}</span>
              <Badge
                variant="secondary"
                className={cn(
                  "text-[10px]",
                  tenant.tenant_type === "HOLDING" ? "bg-muted" : "bg-primary/10 text-primary"
                )}
              >
                {tenant.tenant_type === "HOLDING" ? t.tenantTypeHolding : t.tenantTypeIndependent}
              </Badge>
              {tenant.id === activeTenantId && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
      <div className="border-t border-border p-2 space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4 me-2", isLoading && "animate-spin")} />
          {t.tenantSelector.refresh}
        </Button>
        {isPlatformAdmin && (
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-primary"
            onClick={handleCreateNew}
          >
            <Plus className="h-4 w-4 me-2" />
            {t.tenantSelector.createNew}
          </Button>
        )}
      </div>
    </Command>
  ) : (
    // Simple dropdown for few tenants
    <>
      <DropdownMenuLabel>{t.tenantSelector.title}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {tenants.map((tenant) => (
        <DropdownMenuItem
          key={tenant.id}
          onClick={() => handleSelectTenant(tenant.id)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <Avatar className="h-6 w-6 rounded-md">
            {tenant.logo_url ? (
              <AvatarImage src={tenant.logo_url} alt={tenant.company_shortname} />
            ) : null}
            <AvatarFallback className="rounded-md text-xs bg-muted">
              {getMonogram(tenant.company_shortname)}
            </AvatarFallback>
          </Avatar>
          <span className="flex-1 truncate">{tenant.company_shortname}</span>
          <Badge
            variant="secondary"
            className={cn(
              "text-[10px]",
              tenant.tenant_type === "HOLDING" ? "bg-muted" : "bg-primary/10 text-primary"
            )}
          >
            {tenant.tenant_type === "HOLDING" ? t.tenantTypeHolding : t.tenantTypeIndependent}
          </Badge>
          {tenant.id === activeTenantId && (
            <Check className="h-4 w-4 text-primary" />
          )}
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleRefresh} disabled={isLoading}>
        <RefreshCw className={cn("h-4 w-4 me-2", isLoading && "animate-spin")} />
        {t.tenantSelector.refresh}
      </DropdownMenuItem>
      {isPlatformAdmin && (
        <DropdownMenuItem onClick={handleCreateNew} className="text-primary">
          <Plus className="h-4 w-4 me-2" />
          {t.tenantSelector.createNew}
        </DropdownMenuItem>
      )}
    </>
  )

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label={t.tenantSelector.title}
          >
            {activeTenant ? (
              <>
                <Avatar className="h-5 w-5 rounded-md">
                  {activeTenant.logo_url ? (
                    <AvatarImage
                      src={activeTenant.logo_url}
                      alt={activeTenant.company_shortname}
                    />
                  ) : null}
                  <AvatarFallback className="rounded-md text-[10px] bg-muted">
                    {getMonogram(activeTenant.company_shortname)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate hidden sm:inline">
                  {activeTenant.company_shortname}
                </span>
              </>
            ) : (
              <>
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">{t.tenantSelector.title}</span>
              </>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={dir === "rtl" ? "start" : "end"}
          className={cn("w-72", showSearch && "p-0")}
        >
          {content}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dirty forms warning dialog */}
      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.tenantSelector.switchWarning}</DialogTitle>
            <DialogDescription>
              {t.cancelDialog.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelSwitch}>
              {t.tenantSelector.switchCancel}
            </Button>
            <Button onClick={handleConfirmSwitch}>
              {t.tenantSelector.switchConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
