"use client"

import Link from "next/link"
import { useLocale } from "@/lib/contexts/locale-context"
import { useTenantStore } from "@/lib/stores/tenant-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Building2, Building, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { fetchTenants } from "@/lib/api/client"

export default function HomePage() {
  const { t, dir } = useLocale()
  const { tenants, isLoading, setTenants, setLoading } = useTenantStore()

  // Fetch tenants on mount
  useEffect(() => {
    const loadTenants = async () => {
      setLoading(true)
      try {
        const data = await fetchTenants()
        setTenants(data)
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

  const getMonogram = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {t.tenantSelector.title}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t.identity.description}
            </p>
          </div>
          <Button asChild>
            <Link href="/tenants/new">
              <Plus className="h-4 w-4 me-2" />
              {t.tenantSelector.createNew}
            </Link>
          </Button>
        </div>

        {/* Tenant Grid */}
        {isLoading && tenants.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : tenants.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">No tenants yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your first tenant to get started
                </p>
              </div>
              <Button asChild>
                <Link href="/tenants/new">
                  <Plus className="h-4 w-4 me-2" />
                  {t.tenantSelector.createNew}
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenants.map((tenant) => (
              <Card
                key={tenant.id}
                className="group hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardHeader className="flex flex-row items-start gap-4">
                  <Avatar className="h-12 w-12 rounded-md">
                    {tenant.logo_url ? (
                      <AvatarImage
                        src={tenant.logo_url}
                        alt={tenant.company_shortname}
                      />
                    ) : null}
                    <AvatarFallback className="rounded-md bg-primary/10 text-primary font-semibold">
                      {getMonogram(tenant.company_shortname)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base truncate">
                        {tenant.company_shortname}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px] shrink-0",
                          tenant.tenant_type === "HOLDING"
                            ? "bg-muted"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        {tenant.tenant_type === "HOLDING" ? (
                          <Building2 className="h-3 w-3 me-1" />
                        ) : (
                          <Building className="h-3 w-3 me-1" />
                        )}
                        {tenant.tenant_type === "HOLDING"
                          ? t.tenantTypeHolding
                          : t.tenantTypeIndependent}
                      </Badge>
                    </div>
                    <CardDescription className="truncate mt-1">
                      {tenant.company_fullname}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground truncate">
                      {tenant.city}, {t.countries[tenant.country as keyof typeof t.countries] || tenant.country}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      asChild
                    >
                      <Link href={`/tenants/${tenant.id}/dashboard`}>
                        <ArrowRight className={cn("h-4 w-4", dir === "rtl" && "rtl-flip")} />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
