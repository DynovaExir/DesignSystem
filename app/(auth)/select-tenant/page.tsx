"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Building2, Search, Check, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Dynova Tenant Selection Page
 * For multi-tenant users to select their workspace
 * Persian-only UI
 */

interface Tenant {
  id: string
  name: string
  logo?: string
  role: string
  lastAccess?: string
  isDefault?: boolean
}

const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "شرکت توسعه نرم‌افزار پارسیان",
    role: "مدیر مستأجر",
    lastAccess: "۵ دقیقه پیش",
    isDefault: true,
  },
  {
    id: "2",
    name: "گروه صنعتی ایران خودرو",
    role: "داده‌بان",
    lastAccess: "۲ روز پیش",
  },
  {
    id: "3",
    name: "بانک ملت",
    role: "فقط‌خواندنی",
    lastAccess: "۱ هفته پیش",
  },
]

export default function SelectTenantPage() {
  const router = useRouter()
  const [search, setSearch] = React.useState("")
  const [selectedTenant, setSelectedTenant] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  const filteredTenants = mockTenants.filter((tenant) =>
    tenant.name.includes(search)
  )

  const handleSelectTenant = async () => {
    if (!selectedTenant) return
    
    setIsLoading(true)
    // Simulate tenant context switch
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/dashboard")
  }

  const handleLogout = () => {
    router.push("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <span className="text-2xl font-semibold">د</span>
          </div>
          <h1 className="text-2xl font-semibold">انتخاب سازمان</h1>
          <p className="mt-1 text-muted-foreground">
            سازمان مورد نظر خود را برای ادامه انتخاب کنید
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              سازمان‌های شما
            </CardTitle>
            <CardDescription>
              شما به {mockTenants.length} سازمان دسترسی دارید
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجوی سازمان..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10"
              />
            </div>

            {/* Tenant List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredTenants.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  سازمانی با این نام یافت نشد
                </div>
              ) : (
                filteredTenants.map((tenant) => (
                  <button
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant.id)}
                    className={cn(
                      "w-full flex items-center gap-3 rounded-lg border p-4 text-right transition-colors hover:bg-accent",
                      selectedTenant === tenant.id && "border-primary bg-accent"
                    )}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{tenant.name}</span>
                        {tenant.isDefault && (
                          <Badge variant="secondary" className="shrink-0">
                            پیش‌فرض
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                        <span>{tenant.role}</span>
                        {tenant.lastAccess && (
                          <>
                            <span>•</span>
                            <span>آخرین دسترسی: {tenant.lastAccess}</span>
                          </>
                        )}
                      </div>
                    </div>
                    {selectedTenant === tenant.id && (
                      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <Button
                variant="ghost"
                onClick={handleLogout}
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 me-2" />
                بازگشت
              </Button>
              <Button
                className="flex-1"
                onClick={handleSelectTenant}
                disabled={!selectedTenant || isLoading}
                loading={isLoading}
              >
                ادامه
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          برای درخواست دسترسی به سازمان جدید با مدیر سیستم تماس بگیرید
        </p>
      </div>
    </div>
  )
}
