"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingTable } from "@/components/ui/loading-state"
import {
  Key,
  Search,
  Shield,
  Users,
  Building2,
  Database,
  FileText,
  BarChart3,
  Settings,
  Check,
  X,
} from "lucide-react"
import { cn, toPersianDigits } from "@/lib/utils"

/**
 * Dynova Permissions Catalog Page
 * Based on FEAT-001-03 specifications
 * Displays all available permissions grouped by module
 */

interface Permission {
  id: string
  name: string
  code: string
  description: string
  module: string
}

interface PermissionModule {
  id: string
  name: string
  icon: React.ElementType
  permissions: Permission[]
}

const permissionModules: PermissionModule[] = [
  {
    id: "persons",
    name: "اشخاص و کاربران",
    icon: Users,
    permissions: [
      { id: "p1", name: "مشاهده اشخاص", code: "person:read", description: "دسترسی به لیست و جزئیات اشخاص", module: "persons" },
      { id: "p2", name: "ایجاد شخص", code: "person:create", description: "ایجاد شخص جدید در سیستم", module: "persons" },
      { id: "p3", name: "ویرایش شخص", code: "person:update", description: "ویرایش اطلاعات اشخاص موجود", module: "persons" },
      { id: "p4", name: "حذف شخص", code: "person:delete", description: "حذف اشخاص از سیستم", module: "persons" },
    ],
  },
  {
    id: "org-units",
    name: "ساختار سازمانی",
    icon: Building2,
    permissions: [
      { id: "o1", name: "مشاهده واحدها", code: "org-unit:read", description: "دسترسی به درخت واحدهای سازمانی", module: "org-units" },
      { id: "o2", name: "ایجاد واحد", code: "org-unit:create", description: "ایجاد واحد سازمانی جدید", module: "org-units" },
      { id: "o3", name: "ویرایش واحد", code: "org-unit:update", description: "ویرایش واحدهای موجود", module: "org-units" },
      { id: "o4", name: "حذف واحد", code: "org-unit:delete", description: "حذف واحدهای سازمانی", module: "org-units" },
    ],
  },
  {
    id: "governance",
    name: "حاکمیت داده",
    icon: Database,
    permissions: [
      { id: "g1", name: "مشاهده دامنه‌ها", code: "domain:read", description: "دسترسی به دامنه‌های داده", module: "governance" },
      { id: "g2", name: "مدیریت دامنه‌ها", code: "domain:manage", description: "ایجاد و ویرایش دامنه‌ها", module: "governance" },
      { id: "g3", name: "مشاهده مدل‌ها", code: "model:read", description: "دسترسی به مدل‌های داده", module: "governance" },
      { id: "g4", name: "مدیریت مدل‌ها", code: "model:manage", description: "ایجاد و ویرایش مدل‌های داده", module: "governance" },
      { id: "g5", name: "مشاهده موجودیت‌ها", code: "entity:read", description: "دسترسی به موجودیت‌های داده", module: "governance" },
      { id: "g6", name: "مدیریت موجودیت‌ها", code: "entity:manage", description: "ایجاد و ویرایش موجودیت‌ها", module: "governance" },
    ],
  },
  {
    id: "dictionary",
    name: "دیکشنری داده",
    icon: FileText,
    permissions: [
      { id: "d1", name: "مشاهده دیکشنری", code: "dictionary:read", description: "دسترسی به دیکشنری داده", module: "dictionary" },
      { id: "d2", name: "مدیریت دیکشنری", code: "dictionary:manage", description: "ویرایش تعاریف دیکشنری", module: "dictionary" },
    ],
  },
  {
    id: "reports",
    name: "گزارش‌ها",
    icon: BarChart3,
    permissions: [
      { id: "r1", name: "مشاهده گزارش‌ها", code: "report:read", description: "دسترسی به گزارش‌های سیستم", module: "reports" },
      { id: "r2", name: "ایجاد گزارش", code: "report:create", description: "ایجاد گزارش‌های سفارشی", module: "reports" },
      { id: "r3", name: "خروجی گزارش", code: "report:export", description: "دانلود و خروجی گزارش‌ها", module: "reports" },
    ],
  },
  {
    id: "admin",
    name: "مدیریت سیستم",
    icon: Settings,
    permissions: [
      { id: "a1", name: "مشاهده نقش‌ها", code: "role:read", description: "دسترسی به لیست نقش‌ها", module: "admin" },
      { id: "a2", name: "مدیریت نقش‌ها", code: "role:manage", description: "ایجاد و ویرایش نقش‌ها", module: "admin" },
      { id: "a3", name: "مشاهده مجوزها", code: "permission:read", description: "مشاهده کاتالوگ مجوزها", module: "admin" },
      { id: "a4", name: "مدیریت کاربران", code: "user:manage", description: "مدیریت کاربران مستأجر", module: "admin" },
      { id: "a5", name: "تنظیمات مستأجر", code: "settings:manage", description: "مدیریت تنظیمات سازمان", module: "admin" },
      { id: "a6", name: "مدیریت مستأجر", code: "tenant:manage", description: "ایجاد و مدیریت مستأجرها", module: "admin" },
    ],
  },
]

// Permission matrix for roles
const rolePermissions: Record<string, string[]> = {
  "platform-admin": ["*"],
  "tenant-admin": [
    "person:read", "person:create", "person:update", "person:delete",
    "org-unit:read", "org-unit:create", "org-unit:update", "org-unit:delete",
    "domain:read", "domain:manage", "model:read", "model:manage",
    "dictionary:read", "dictionary:manage",
    "report:read", "report:create", "report:export",
    "role:read", "role:manage", "permission:read", "user:manage", "settings:manage",
  ],
  "cfo": [
    "person:read",
    "org-unit:read",
    "report:read", "report:export",
  ],
  "risk-officer": [
    "person:read",
    "org-unit:read",
    "report:read",
  ],
  "it-auditor": [
    "person:read",
    "org-unit:read",
    "report:read",
  ],
  "data-steward": [
    "person:read", "person:create", "person:update",
    "org-unit:read",
    "domain:read", "domain:manage", "model:read", "model:manage", "entity:read", "entity:manage",
    "dictionary:read", "dictionary:manage",
    "report:read",
  ],
  "read-only": [
    "person:read",
    "org-unit:read",
    "domain:read", "model:read", "entity:read",
    "dictionary:read",
    "report:read",
  ],
}

const roleNames: Record<string, string> = {
  "platform-admin": "مدیر پلتفرم",
  "tenant-admin": "مدیر مستأجر",
  "cfo": "مدیر مالی",
  "risk-officer": "مسئول ریسک",
  "it-auditor": "ممیز IT",
  "data-steward": "داده‌بان",
  "read-only": "فقط‌خواندنی",
}

export default function PermissionsPage() {
  const [search, setSearch] = React.useState("")
  const [activeTab, setActiveTab] = React.useState("catalog")

  const allPermissions = permissionModules.flatMap((m) => m.permissions)
  const filteredPermissions = allPermissions.filter(
    (p) =>
      p.name.includes(search) ||
      p.code.includes(search) ||
      p.description.includes(search)
  )

  const hasPermission = (roleId: string, permCode: string) => {
    const perms = rolePermissions[roleId]
    return perms?.includes("*") || perms?.includes(permCode)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold">کاتالوگ مجوزها</h1>
        <p className="text-muted-foreground">
          مشاهده تمام مجوزهای سیستم و ماتریس دسترسی نقش‌ها
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Key className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(allPermissions.length)}
                </p>
                <p className="text-sm text-muted-foreground">کل مجوزها</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info-bg">
                <Database className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(permissionModules.length)}
                </p>
                <p className="text-sm text-muted-foreground">ماژول</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(Object.keys(rolePermissions).length)}
                </p>
                <p className="text-sm text-muted-foreground">نقش</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="catalog">کاتالوگ مجوزها</TabsTrigger>
          <TabsTrigger value="matrix">ماتریس دسترسی</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>لیست مجوزها</CardTitle>
                  <CardDescription>
                    تمام مجوزهای سیستم به تفکیک ماژول
                  </CardDescription>
                </div>
                <div className="relative w-64">
                  <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="جستجوی مجوز..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pe-10"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {search ? (
                // Search results
                filteredPermissions.length === 0 ? (
                  <EmptyState
                    variant="search"
                    title="مجوزی یافت نشد"
                  />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>نام مجوز</TableHead>
                        <TableHead>کد</TableHead>
                        <TableHead>توضیحات</TableHead>
                        <TableHead>ماژول</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPermissions.map((perm) => (
                        <TableRow key={perm.id}>
                          <TableCell className="font-semibold">{perm.name}</TableCell>
                          <TableCell>
                            <code className="bg-muted px-2 py-1 rounded text-xs" dir="ltr">
                              {perm.code}
                            </code>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {perm.description}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {permissionModules.find((m) => m.id === perm.module)?.name}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )
              ) : (
                // Grouped by module
                <div className="space-y-8">
                  {permissionModules.map((module) => {
                    const Icon = module.icon
                    return (
                      <div key={module.id}>
                        <div className="flex items-center gap-2 mb-4">
                          <Icon className="h-5 w-5 text-muted-foreground" />
                          <h3 className="font-semibold">{module.name}</h3>
                          <Badge variant="secondary">
                            {toPersianDigits(module.permissions.length)} مجوز
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {module.permissions.map((perm) => (
                            <div
                              key={perm.id}
                              className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                            >
                              <Key className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium">{perm.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {perm.description}
                                </p>
                                <code className="text-xs text-muted-foreground" dir="ltr">
                                  {perm.code}
                                </code>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="matrix" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ماتریس دسترسی نقش‌ها</CardTitle>
              <CardDescription>
                مقایسه مجوزهای اختصاص یافته به هر نقش
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky right-0 bg-card z-10">مجوز</TableHead>
                      {Object.keys(roleNames).map((roleId) => (
                        <TableHead key={roleId} className="text-center min-w-[100px]">
                          {roleNames[roleId]}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {permissionModules.map((module) => (
                      <React.Fragment key={module.id}>
                        <TableRow className="bg-muted/50">
                          <TableCell
                            colSpan={Object.keys(roleNames).length + 1}
                            className="font-semibold"
                          >
                            {module.name}
                          </TableCell>
                        </TableRow>
                        {module.permissions.map((perm) => (
                          <TableRow key={perm.id}>
                            <TableCell className="sticky right-0 bg-card">
                              <span className="text-sm">{perm.name}</span>
                            </TableCell>
                            {Object.keys(roleNames).map((roleId) => (
                              <TableCell key={roleId} className="text-center">
                                {hasPermission(roleId, perm.code) ? (
                                  <Check className="h-4 w-4 mx-auto text-success" />
                                ) : (
                                  <X className="h-4 w-4 mx-auto text-muted-foreground/30" />
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </React.Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
