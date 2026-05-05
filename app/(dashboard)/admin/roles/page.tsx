"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingTable } from "@/components/ui/loading-state"
import { IconButton } from "@/components/ui/icon-button"
import {
  Shield,
  Search,
  Plus,
  Eye,
  UserPlus,
  MoreHorizontal,
  Users,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toPersianDigits } from "@/lib/utils"

/**
 * Dynova Roles Management Page
 * Based on FEAT-001-03 specifications
 * MVP Standard Roles:
 * - Platform Admin (مدیر پلتفرم)
 * - Tenant Admin (مدیر مستأجر)
 * - CFO (مدیر مالی)
 * - Risk Officer (مسئول ریسک)
 * - IT Auditor (ممیز IT)
 * - Data Steward (داده‌بان)
 * - Read Only (فقط‌خواندنی)
 */

interface Role {
  id: string
  name: string
  description: string
  type: "system" | "custom"
  usersCount: number
  permissionsCount: number
  createdAt: string
}

const mockRoles: Role[] = [
  {
    id: "platform-admin",
    name: "مدیر پلتفرم",
    description: "دسترسی کامل به تمام قابلیت‌های پلتفرم شامل مدیریت مستأجرها",
    type: "system",
    usersCount: 2,
    permissionsCount: 48,
    createdAt: "۱۴۰۴/۰۱/۰۱",
  },
  {
    id: "tenant-admin",
    name: "مدیر مستأجر",
    description: "مدیریت کامل سازمان شامل کاربران، نقش‌ها و تنظیمات",
    type: "system",
    usersCount: 3,
    permissionsCount: 35,
    createdAt: "۱۴۰۴/۰۱/۰۱",
  },
  {
    id: "cfo",
    name: "مدیر مالی",
    description: "دسترسی به گزارش‌ها و داشبوردهای مالی و تأیید داده‌های EPM",
    type: "system",
    usersCount: 1,
    permissionsCount: 22,
    createdAt: "۱۴۰۴/۰۱/۰۱",
  },
  {
    id: "risk-officer",
    name: "مسئول ریسک",
    description: "مدیریت و پایش ریسک‌های سازمانی و دسترسی به گزارش‌های مربوطه",
    type: "system",
    usersCount: 2,
    permissionsCount: 18,
    createdAt: "۱۴۰۴/۰۱/۰۱",
  },
  {
    id: "it-auditor",
    name: "ممیز IT",
    description: "دسترسی فقط‌خواندنی به لاگ‌ها و گزارش‌های امنیتی",
    type: "system",
    usersCount: 1,
    permissionsCount: 12,
    createdAt: "۱۴۰۴/۰۱/۰۱",
  },
  {
    id: "data-steward",
    name: "داده‌بان",
    description: "مدیریت کیفیت داده، دیکشنری داده و حاکمیت داده",
    type: "system",
    usersCount: 5,
    permissionsCount: 28,
    createdAt: "۱۴۰۴/۰۱/۰۱",
  },
  {
    id: "read-only",
    name: "فقط‌خواندنی",
    description: "دسترسی فقط‌خواندنی به داشبوردها و گزارش‌های عمومی",
    type: "system",
    usersCount: 8,
    permissionsCount: 8,
    createdAt: "۱۴۰۴/۰۱/۰۱",
  },
]

export default function RolesPage() {
  const [roles, setRoles] = React.useState<Role[]>(mockRoles)
  const [search, setSearch] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [selectedRole, setSelectedRole] = React.useState<Role | null>(null)

  const filteredRoles = roles.filter(
    (role) =>
      role.name.includes(search) ||
      role.description.includes(search)
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">مدیریت نقش‌ها</h1>
          <p className="text-muted-foreground">
            نقش‌های سیستمی و سفارشی سازمان را مدیریت کنید
          </p>
        </div>
        <Button disabled>
          <Plus className="h-4 w-4 me-2" />
          نقش جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(roles.length)}
                </p>
                <p className="text-sm text-muted-foreground">تعداد نقش‌ها</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(roles.reduce((sum, r) => sum + r.usersCount, 0))}
                </p>
                <p className="text-sm text-muted-foreground">کاربران دارای نقش</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info-bg">
                <Shield className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(roles.filter((r) => r.type === "system").length)}
                </p>
                <p className="text-sm text-muted-foreground">نقش‌های سیستمی</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Roles Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>لیست نقش‌ها</CardTitle>
              <CardDescription>
                نقش‌های استاندارد MVP و نقش‌های سفارشی سازمان
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="جستجوی نقش..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable rows={5} />
          ) : filteredRoles.length === 0 ? (
            <EmptyState
              variant="search"
              title="نقشی یافت نشد"
              description="نتیجه‌ای با معیارهای جستجوی شما یافت نشد"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>نام نقش</TableHead>
                  <TableHead>توضیحات</TableHead>
                  <TableHead>نوع</TableHead>
                  <TableHead>تعداد کاربران</TableHead>
                  <TableHead>تعداد مجوزها</TableHead>
                  <TableHead className="w-[100px]">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate text-muted-foreground">
                      {role.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant={role.type === "system" ? "secondary" : "outline"}>
                        {role.type === "system" ? "سیستمی" : "سفارشی"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {toPersianDigits(role.usersCount)} کاربر
                    </TableCell>
                    <TableCell>
                      {toPersianDigits(role.permissionsCount)} مجوز
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <IconButton
                              variant="tertiary"
                              size="sm"
                              tooltipLabel="مشاهده جزئیات"
                              onClick={() => setSelectedRole(role)}
                            >
                              <Eye className="h-4 w-4" />
                            </IconButton>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{role.name}</DialogTitle>
                              <DialogDescription>
                                {role.description}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">نوع:</span>
                                  <p className="font-medium">
                                    {role.type === "system" ? "سیستمی" : "سفارشی"}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">تاریخ ایجاد:</span>
                                  <p className="font-medium">{role.createdAt}</p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">تعداد کاربران:</span>
                                  <p className="font-medium">
                                    {toPersianDigits(role.usersCount)} نفر
                                  </p>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">تعداد مجوزها:</span>
                                  <p className="font-medium">
                                    {toPersianDigits(role.permissionsCount)} مجوز
                                  </p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="secondary" asChild>
                                <Link href={`/admin/roles/${role.id}/users`}>
                                  <Users className="h-4 w-4 me-2" />
                                  مشاهده کاربران
                                </Link>
                              </Button>
                              <Button asChild>
                                <Link href={`/admin/roles/${role.id}/permissions`}>
                                  مشاهده مجوزها
                                </Link>
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <IconButton
                              variant="tertiary"
                              size="sm"
                              tooltipLabel="گزینه‌های بیشتر"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </IconButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/roles/${role.id}/users`}>
                                <Users className="h-4 w-4 me-2" />
                                مشاهده کاربران
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/users?assignRole=${role.id}`}>
                                <UserPlus className="h-4 w-4 me-2" />
                                تخصیص کاربر جدید
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                              ویرایش نقش
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
