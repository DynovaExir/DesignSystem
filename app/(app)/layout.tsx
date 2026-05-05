"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { AppShell } from "@/components/layout/app-shell"

/**
 * App Layout
 * Wraps all app pages with AppShell (Sidebar + Header)
 */

// Mock user data - replace with actual auth context
const mockUser = {
  id: "1",
  name: "علی محمدی",
  email: "ali@company.com",
  avatar: undefined,
  role: {
    id: "tenant-admin",
    name: "مدیر مستأجر",
  },
}

const mockTenant = {
  id: "1",
  name: "شرکت توسعه نرم‌افزار پارسیان",
  logo: undefined,
}

const mockTenants = [
  mockTenant,
  { id: "2", name: "گروه صنعتی ایران خودرو" },
  { id: "3", name: "بانک ملت" },
]

// Mock permissions for tenant admin
const mockPermissions = [
  "*", // Full access for demo
  "person:read",
  "person:write",
  "org-unit:read",
  "governance:read",
  "dictionary:read",
  "report:read",
  "role:manage",
  "permission:read",
  "user:manage",
  "settings:manage",
]

// Breadcrumb mapping
const breadcrumbMap: Record<string, Array<{ label: string; href?: string }>> = {
  "/": [{ label: "داشبورد" }],
  "/organization/persons": [
    { label: "سازمان", href: "/" },
    { label: "اشخاص" },
  ],
  "/organization/units": [
    { label: "سازمان", href: "/" },
    { label: "واحدهای سازمانی" },
  ],
  "/governance/data-dictionary": [
    { label: "حاکمیت داده", href: "/" },
    { label: "دیکشنری داده" },
  ],
  "/admin/roles": [
    { label: "مدیریت", href: "/" },
    { label: "نقش‌ها" },
  ],
  "/admin/permissions": [
    { label: "مدیریت", href: "/" },
    { label: "مجوزها" },
  ],
  "/admin/users": [
    { label: "مدیریت", href: "/" },
    { label: "کاربران مستأجر" },
  ],
  "/admin/create-tenant": [
    { label: "مدیریت", href: "/" },
    { label: "ایجاد مستأجر جدید" },
  ],
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = () => {
    router.push("/login")
  }

  const handleTenantChange = (tenantId: string) => {
    console.log("Switching to tenant:", tenantId)
    // Would refresh context with new tenant data
    router.refresh()
  }

  const breadcrumbs = breadcrumbMap[pathname] || []

  return (
    <AppShell
      user={mockUser}
      tenant={mockTenant}
      tenants={mockTenants}
      userPermissions={mockPermissions}
      breadcrumbs={breadcrumbs}
      onLogout={handleLogout}
      onTenantChange={handleTenantChange}
    >
      {children}
    </AppShell>
  )
}
