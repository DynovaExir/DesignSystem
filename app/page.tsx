"use client"

import Link from "next/link"
import { useT } from "@/lib/locale-context"
import { useTenant } from "@/components/tenant-selector/tenant-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Plus, ArrowRight } from "lucide-react"

export default function HomePage() {
  const t = useT()
  const { tenants, activeTenant, isLoading } = useTenant()

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-display-md text-foreground">{t.nav.dashboard}</h1>
        <p className="mt-2 text-body-sm-regular text-muted-foreground">
          {t.app.tagline}
        </p>
      </div>

      {/* Active Tenant Card */}
      {activeTenant && (
        <Card className="mb-8 border-primary/20 bg-primary-100/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-heading-lg">
                    {activeTenant.company_fullname}
                  </CardTitle>
                  <CardDescription>
                    {activeTenant.tenant_name}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={activeTenant.tenant_type === "HOLDING" ? "default" : "secondary"}>
                {activeTenant.tenant_type === "HOLDING"
                  ? t.tenantSelector.types.holding
                  : t.tenantSelector.types.independent}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/tenants/${activeTenant.id}/dashboard`}>
                {t.nav.dashboard}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Tenants List */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-heading-lg text-foreground">{t.nav.tenants}</h2>
        <Button asChild>
          <Link href="/tenants/new">
            <Plus className="h-4 w-4" />
            {t.tenantSelector.create}
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <Skeleton className="mt-3 h-5 w-3/4" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tenants.map((tenant) => (
            <Card
              key={tenant.id}
              className={
                tenant.id === activeTenant?.id
                  ? "border-primary ring-1 ring-primary"
                  : ""
              }
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                    <span className="text-body-lg-semibold">
                      {tenant.company_shortname.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <Badge
                    variant={
                      tenant.tenant_type === "HOLDING" ? "default" : "secondary"
                    }
                    className="text-label-sm-semibold"
                  >
                    {tenant.tenant_type === "HOLDING"
                      ? t.tenantSelector.types.holding
                      : t.tenantSelector.types.independent}
                  </Badge>
                </div>
                <div className="mt-3">
                  <h3 className="text-body-lg-semibold text-foreground">
                    {tenant.company_shortname}
                  </h3>
                  <p className="text-body-sm-regular text-muted-foreground">
                    {tenant.company_fullname}
                  </p>
                </div>
                {tenant.id === activeTenant?.id && (
                  <Badge variant="success" className="mt-3">
                    Active
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
