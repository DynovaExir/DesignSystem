"use client"

import { useState } from "react"
import {
  User,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Mail,
  Phone,
  Building2,
  Download,
  Upload,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { EmptyState } from "@/components/ui/empty-state"

interface Person {
  id: string
  nationalId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  orgUnit: string
  position: string
  status: "active" | "inactive" | "pending"
  isUser: boolean
  createdAt: string
}

const personsData: Person[] = [
  {
    id: "1",
    nationalId: "۰۰۱۲۳۴۵۶۷۸",
    firstName: "علی",
    lastName: "محمدی",
    email: "a.mohammadi@example.com",
    phone: "۰۹۱۲۱۲۳۴۵۶۷",
    orgUnit: "معاونت مالی",
    position: "مدیر مالی",
    status: "active",
    isUser: true,
    createdAt: "۱۴۰۳/۰۱/۱۵",
  },
  {
    id: "2",
    nationalId: "۰۰۲۳۴۵۶۷۸۹",
    firstName: "مریم",
    lastName: "احمدی",
    email: "m.ahmadi@example.com",
    phone: "۰۹۱۲۲۳۴۵۶۷۸",
    orgUnit: "معاونت فناوری اطلاعات",
    position: "کارشناس امنیت",
    status: "active",
    isUser: true,
    createdAt: "۱۴۰۳/۰۲/۰۱",
  },
  {
    id: "3",
    nationalId: "۰۰۳۴۵۶۷۸۹۰",
    firstName: "رضا",
    lastName: "کریمی",
    email: "r.karimi@example.com",
    phone: "۰۹۱۲۳۴۵۶۷۸۹",
    orgUnit: "حسابداری",
    position: "حسابدار ارشد",
    status: "active",
    isUser: false,
    createdAt: "۱۴۰۳/۰۳/۱۰",
  },
  {
    id: "4",
    nationalId: "۰۰۴۵۶۷۸۹۰۱",
    firstName: "سارا",
    lastName: "حسینی",
    email: "s.hosseini@example.com",
    phone: "۰۹۱۲۴۵۶۷۸۹۰",
    orgUnit: "منابع انسانی",
    position: "کارشناس جذب",
    status: "pending",
    isUser: true,
    createdAt: "۱۴۰۳/۰۵/۲۰",
  },
  {
    id: "5",
    nationalId: "۰۰۵۶۷۸۹۰۱۲",
    firstName: "امیر",
    lastName: "رضایی",
    email: "a.rezaei@example.com",
    phone: "۰۹۱۲۵۶۷۸۹۰۱",
    orgUnit: "معاونت مالی",
    position: "تحلیلگر مالی",
    status: "inactive",
    isUser: false,
    createdAt: "۱۴۰۲/۱۱/۰۵",
  },
  {
    id: "6",
    nationalId: "۰۰۶۷۸۹۰۱۲۳",
    firstName: "زهرا",
    lastName: "نوری",
    email: "z.noori@example.com",
    phone: "۰۹۱۲۶۷۸۹۰۱۲",
    orgUnit: "توسعه نرم‌افزار",
    position: "توسعه‌دهنده ارشد",
    status: "active",
    isUser: true,
    createdAt: "۱۴۰۳/۰۴/۱۵",
  },
]

const statusLabels = {
  active: "فعال",
  inactive: "غیرفعال",
  pending: "در انتظار",
}

const statusVariants = {
  active: "success" as const,
  inactive: "secondary" as const,
  pending: "warning" as const,
}

export default function PersonsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)

  const filteredPersons = personsData.filter(
    (person) =>
      person.firstName.includes(searchQuery) ||
      person.lastName.includes(searchQuery) ||
      person.nationalId.includes(searchQuery) ||
      person.email.includes(searchQuery)
  )

  const toggleRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    if (selectedRows.length === filteredPersons.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredPersons.map((p) => p.id))
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            دایرکتوری اشخاص
          </h1>
          <p className="text-sm text-muted-foreground">
            مدیریت اطلاعات پرسنل و اشخاص سازمان
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 me-2" />
            بارگذاری
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 me-2" />
            خروجی
          </Button>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 me-2" />
            شخص جدید
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی نام، کد ملی یا ایمیل..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="واحد سازمانی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه واحدها</SelectItem>
                  <SelectItem value="finance">معاونت مالی</SelectItem>
                  <SelectItem value="it">معاونت فناوری اطلاعات</SelectItem>
                  <SelectItem value="hr">منابع انسانی</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Persons Table */}
      <Card>
        <CardHeader className="border-b py-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              لیست اشخاص
              <Badge variant="secondary" className="me-2">
                {filteredPersons.length} نفر
              </Badge>
            </CardTitle>
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedRows.length} مورد انتخاب شده
                </span>
                <Button variant="outline" size="sm">
                  حذف انتخاب‌شده‌ها
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filteredPersons.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={User}
                title="شخصی یافت نشد"
                description="با معیارهای جستجوی فعلی هیچ شخصی یافت نشد."
                action={{
                  label: "افزودن شخص جدید",
                  onClick: () => setIsCreateDialogOpen(true),
                }}
              />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedRows.length === filteredPersons.length}
                      onCheckedChange={toggleAllRows}
                    />
                  </TableHead>
                  <TableHead>شخص</TableHead>
                  <TableHead>کد ملی</TableHead>
                  <TableHead>واحد سازمانی</TableHead>
                  <TableHead>سمت</TableHead>
                  <TableHead>اطلاعات تماس</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>کاربر سیستم</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersons.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedRows.includes(person.id)}
                        onCheckedChange={() => toggleRow(person.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="" />
                          <AvatarFallback className="text-xs">
                            {getInitials(person.firstName, person.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            {person.firstName} {person.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ثبت: {person.createdAt}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {person.nationalId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {person.orgUnit}
                      </div>
                    </TableCell>
                    <TableCell>{person.position}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs">{person.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs font-mono">
                            {person.phone}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[person.status]}>
                        {statusLabels[person.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {person.isUser ? (
                        <Badge variant="outline" className="text-primary">
                          کاربر
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 me-2" />
                            مشاهده جزئیات
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedPerson(person)
                              setIsCreateDialogOpen(true)
                            }}
                          >
                            <Edit className="h-4 w-4 me-2" />
                            ویرایش
                          </DropdownMenuItem>
                          {!person.isUser && (
                            <DropdownMenuItem>
                              <User className="h-4 w-4 me-2" />
                              ایجاد کاربر
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 me-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          نمایش ۱ تا {filteredPersons.length} از {personsData.length} مورد
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            قبلی
          </Button>
          <Button variant="outline" size="sm" disabled>
            بعدی
          </Button>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedPerson ? "ویرایش اطلاعات شخص" : "افزودن شخص جدید"}
            </DialogTitle>
            <DialogDescription>
              اطلاعات فردی و سازمانی شخص را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">نام</Label>
                <Input
                  id="firstName"
                  placeholder="نام"
                  defaultValue={selectedPerson?.firstName}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">نام خانوادگی</Label>
                <Input
                  id="lastName"
                  placeholder="نام خانوادگی"
                  defaultValue={selectedPerson?.lastName}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nationalId">کد ملی</Label>
              <Input
                id="nationalId"
                placeholder="۰۰۱۲۳۴۵۶۷۸"
                defaultValue={selectedPerson?.nationalId}
                className="font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">ایمیل</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@domain.com"
                defaultValue={selectedPerson?.email}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">شماره تماس</Label>
              <Input
                id="phone"
                placeholder="۰۹۱۲۱۲۳۴۵۶۷"
                defaultValue={selectedPerson?.phone}
                className="font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="orgUnit">واحد سازمانی</Label>
                <Select defaultValue={selectedPerson ? "finance" : ""}>
                  <SelectTrigger id="orgUnit">
                    <SelectValue placeholder="انتخاب واحد" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="finance">معاونت مالی</SelectItem>
                    <SelectItem value="it">معاونت فناوری اطلاعات</SelectItem>
                    <SelectItem value="hr">منابع انسانی</SelectItem>
                    <SelectItem value="accounting">حسابداری</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="position">سمت</Label>
                <Input
                  id="position"
                  placeholder="سمت سازمانی"
                  defaultValue={selectedPerson?.position}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">وضعیت</Label>
              <Select defaultValue={selectedPerson?.status || "active"}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="inactive">غیرفعال</SelectItem>
                  <SelectItem value="pending">در انتظار</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="createUser"
                defaultChecked={selectedPerson?.isUser}
              />
              <Label htmlFor="createUser" className="text-sm font-normal">
                ایجاد حساب کاربری برای این شخص
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setSelectedPerson(null)
              }}
            >
              انصراف
            </Button>
            <Button
              onClick={() => {
                setIsCreateDialogOpen(false)
                setSelectedPerson(null)
              }}
            >
              {selectedPerson ? "ذخیره تغییرات" : "افزودن شخص"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
