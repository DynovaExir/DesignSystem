"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useT } from "@/lib/locale-context"
import { useTenant } from "@/components/tenant-selector/tenant-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Building2, 
  Users, 
  Settings, 
  ArrowRight,
  BarChart3,
  FileText,
  Shield
} from "lucide-react"

export default function TenantDashboardPage() {
  const params = useParams()
  const tenantId = params.id as string
  const t = useT()
  const { tenants } = useTenant()
  
  const tenant = tenants.find((t) => t.id === tenantId)

  if (!tenant) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-5xl">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-body-lg-regular text-muted-foreground">
              Tenant not found
            </p>
            <Button asChild className="mt-4">
              <Link href="/">Go Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const dashboardCards = [
    {
      title: "Analytics",
      titleFa: "تحلیل‌ها",
      description: "View performance metrics",
      descriptionFa: "مشاهده معیارهای عملکرد",
      icon: BarChart3,
      href: "#",
    },
    {
      title: "Users",
      titleFa: "کاربران",
      description: "Manage team members",
      descriptionFa: "مدیریت اعضای تیم",
      icon: Users,
      href: "#",
    },
    {
      title: "Documents",
      titleFa: "اسناد",
      description: "Access documents",
      descriptionFa: "دسترسی به اسناد",
      icon: FileText,
      href: "#",
    },
    {
      title: "Security",
      titleFa: "امنیت",
      description: "Security settings",
      descriptionFa: "تنظیمات امنیتی",
      icon: Shield,
      href: "#",
    },
    {
      title: "Settings",
      titleFa: "تنظیمات",
      description: "Configure tenant",
      descriptionFa: "پیکربندی مستأجر",
      icon: Settings,
      href: "#",
    },
  ]

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-display-md text-foreground">
              {tenant.company_fullname}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <code className="text-body-sm-regular text-muted-foreground">
                {tenant.tenant_name}
              </code>
              <Badge
                variant={
                  tenant.tenant_type === "HOLDING" ? "default" : "secondary"
                }
              >
                {tenant.tenant_type === "HOLDING"
                  ? t.tenantSelector.types.holding
                  : t.tenantSelector.types.independent}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      <Card className="mb-8 border-success-500/20 bg-success-100/30">
        <CardContent className="py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success-500 text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-body-lg-semibold text-foreground">
                {t.wizard.submit.success.title}
              </p>
              <p className="text-body-sm-regular text-muted-foreground">
                {t.wizard.submit.success.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dashboardCards.map((card) => (
          <Card
            key={card.title}
            className="transition-shadow hover:shadow-md cursor-pointer"
          >
            <CardHeader className="pb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <card.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-body-lg-semibold">
                {card.titleFa}
              </CardTitle>
              <CardDescription className="mt-1">
                {card.descriptionFa}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
