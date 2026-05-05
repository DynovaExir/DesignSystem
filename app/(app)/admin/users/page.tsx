"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { LoadingTable } from "@/components/ui/loading-state"
import { IconButton } from "@/components/ui/icon-button"
import { toast } from "@/components/ui/sonner"
import {
  Users,
  Search,
  Plus,
  Eye,
  Shield,
  MoreHorizontal,
  Mail,
  UserCheck,
  UserX,
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
 * Dynova Users Management Page
 * Based on FEAT-001-03 specifications
 * User-role assignment and management
 */

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: {
    id: string
    name: string
  }
  status: "active" | "inactive" | "pending"
  lastLogin?: string
  createdAt: string
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "علی محمدی",
    email: "ali@company.com",
    role: { id: "tenant-admin", name: "مدیر مستأجر" },
    status: "active",
    lastLogin: "۵ دقیقه پیش",
    createdAt: "۱۴۰۴/۰۱/۱۵",
  },
  {
    id: "2",
    name: "مریم احمدی",
    email: "maryam@company.com",
    role: { id: "data-steward", name: "داده‌بان" },
    status: "active",
    lastLogin: "۲ ساعت پیش",
    createdAt: "۱۴۰۴/۰۲/۰۱",
  },
  {
    id: "3",
    name: "رضا کریمی",
    email: "reza@company.com",
    role: { id: "cfo", name: "مدیر مالی" },
    status: "active",
    lastLogin: "دیروز",
    createdAt: "۱۴۰۴/۰۲/۱۰",
  },
  {
    id: "4",
    name: "سارا حسینی",
    email: "sara@company.com",
    role: { id: "read-only", name: "فقط‌خواندنی" },
    status: "pending",
    createdAt: "۱۴۰۴/۰۳/۰۵",
  },
  {
    id: "5",
    name: "محمد رضایی",
    email: "mohammad@company.com",
    role: { id: "data-steward", name: "داده‌بان" },
    status: "inactive",
    lastLogin: "۱ ماه پیش",
    createdAt: "۱۴۰۳/۱۱/۲۰",
  },
]

const roles = [
  { id: "tenant-admin", name: "مدیر مستأجر" },
  { id: "cfo", name: "مدیر مالی" },
  { id: "risk-officer", name: "مسئول ریسک" },
  { id: "it-auditor", name: "ممیز IT" },
  { id: "data-steward", name: "داده‌بان" },
  { id: "read-only", name: "فقط‌خواندنی" },
]

const statusConfig = {
  active: { label: "فعال", variant: "success" as const },
  inactive: { label: "غیرفعال", variant: "danger" as const },
  pending: { label: "در انتظار تأیید", variant: "warning" as const },
}

export default function UsersPage() {
  const [users] = React.useState<User[]>(mockUsers)
  const [search, setSearch] = React.useState("")
  const [roleFilter, setRoleFilter] = React.useState<string>("all")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isLoading] = React.useState(false)
  const [isInviteDialogOpen, setIsInviteDialogOpen] = React.useState(false)
  const [inviteData, setInviteData] = React.useState({
    email: "",
    name: "",
    roleId: "",
  })
  const [isInviting, setIsInviting] = React.useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.includes(search) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role.id === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
  }

  const handleInvite = async () => {
    setIsInviting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success("دعوت‌نامه ارسال شد", {
      description: `دعوت‌نامه با موفقیت به ${inviteData.email} ارسال شد`,
    })
    setIsInviteDialogOpen(false)
    setInviteData({ email: "", name: "", roleId: "" })
    setIsInviting(false)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">مدیریت کاربران</h1>
          <p className="text-muted-foreground">
            کاربران مستأجر و نقش‌های آن‌ها را مدیریت کنید
          </p>
        </div>
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 me-2" />
              دعوت کاربر جدید
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>دعوت کاربر جدید</DialogTitle>
              <DialogDescription>
                یک دعوت‌نامه به ایمیل کاربر ارسال می‌شود تا به سازمان بپیوندد
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-name">نام و نام خانوادگی</Label>
                <Input
                  id="invite-name"
                  placeholder="نام کاربر"
                  value={inviteData.name}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-email">ایمیل</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="user@company.com"
                  value={inviteData.email}
                  onChange={(e) =>
                    setInviteData({ ...inviteData, email: e.target.value })
                  }
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invite-role">نقش</Label>
                <Select
                  value={inviteData.roleId}
                  onValueChange={(value) =>
                    setInviteData({ ...inviteData, roleId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب نقش کاربر" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="ghost"
                onClick={() => setIsInviteDialogOpen(false)}
              >
                انصراف
              </Button>
              <Button
                onClick={handleInvite}
                loading={isInviting}
                disabled={!inviteData.email || !inviteData.name || !inviteData.roleId}
              >
                <Mail className="h-4 w-4 me-2" />
                ارسال دعوت‌نامه
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(users.length)}
                </p>
                <p className="text-sm text-muted-foreground">کل کاربران</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success-bg">
                <UserCheck className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(users.filter((u) => u.status === "active").length)}
                </p>
                <p className="text-sm text-muted-foreground">کاربران فعال</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning-bg">
                <Mail className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(users.filter((u) => u.status === "pending").length)}
                </p>
                <p className="text-sm text-muted-foreground">در انتظار تأیید</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <UserX className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {toPersianDigits(users.filter((u) => u.status === "inactive").length)}
                </p>
                <p className="text-sm text-muted-foreground">غیرفعال</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <CardTitle>لیست کاربران</CardTitle>
              <CardDescription>
                کاربران فعلی سازمان و وضعیت آن‌ها
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="جستجوی کاربر..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pe-10"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="همه نقش‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه نقش‌ها</SelectItem>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="همه وضعیت‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <LoadingTable rows={5} />
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              variant="users"
              title="کاربری یافت نشد"
              description="نتیجه‌ای با معیارهای جستجوی شما یافت نشد"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>کاربر</TableHead>
                  <TableHead>نقش</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>آخرین ورود</TableHead>
                  <TableHead>تاریخ عضویت</TableHead>
                  <TableHead className="w-[100px]">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-sm text-muted-foreground" dir="ltr">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        {user.role.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[user.status].variant}>
                        {statusConfig[user.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.lastLogin || "هرگز"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.createdAt}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <IconButton
                          variant="tertiary"
                          size="sm"
                          tooltipLabel="مشاهده جزئیات"
                        >
                          <Eye className="h-4 w-4" />
                        </IconButton>
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
                            <DropdownMenuItem>
                              <Shield className="h-4 w-4 me-2" />
                              تغییر نقش
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 me-2" />
                              ارسال مجدد دعوت‌نامه
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <UserX className="h-4 w-4 me-2" />
                                غیرفعال کردن
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <UserCheck className="h-4 w-4 me-2" />
                                فعال کردن
                              </DropdownMenuItem>
                            )}
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
