"use client"

import { useState } from "react"
import {
  Building2,
  ChevronDown,
  ChevronLeft,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Users,
  FolderTree,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
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
import { EmptyState } from "@/components/ui/empty-state"

interface OrgUnit {
  id: string
  name: string
  code: string
  parentId: string | null
  level: number
  effectiveFrom: string
  effectiveTo: string | null
  status: "active" | "inactive" | "pending"
  employeeCount: number
  children?: OrgUnit[]
}

// Mock hierarchical data
const orgUnitsData: OrgUnit[] = [
  {
    id: "1",
    name: "شرکت مادر",
    code: "HQ",
    parentId: null,
    level: 0,
    effectiveFrom: "۱۴۰۰/۰۱/۰۱",
    effectiveTo: null,
    status: "active",
    employeeCount: 250,
    children: [
      {
        id: "2",
        name: "معاونت مالی",
        code: "FIN",
        parentId: "1",
        level: 1,
        effectiveFrom: "۱۴۰۰/۰۱/۰۱",
        effectiveTo: null,
        status: "active",
        employeeCount: 45,
        children: [
          {
            id: "5",
            name: "حسابداری",
            code: "ACC",
            parentId: "2",
            level: 2,
            effectiveFrom: "۱۴۰۰/۰۱/۰۱",
            effectiveTo: null,
            status: "active",
            employeeCount: 20,
          },
          {
            id: "6",
            name: "خزانه‌داری",
            code: "TRS",
            parentId: "2",
            level: 2,
            effectiveFrom: "۱۴۰۰/۰۱/۰۱",
            effectiveTo: null,
            status: "active",
            employeeCount: 15,
          },
          {
            id: "7",
            name: "بودجه و برنامه‌ریزی",
            code: "BUD",
            parentId: "2",
            level: 2,
            effectiveFrom: "۱۴۰۲/۰۷/۰۱",
            effectiveTo: null,
            status: "active",
            employeeCount: 10,
          },
        ],
      },
      {
        id: "3",
        name: "معاونت فناوری اطلاعات",
        code: "IT",
        parentId: "1",
        level: 1,
        effectiveFrom: "۱۴۰۰/۰۱/۰۱",
        effectiveTo: null,
        status: "active",
        employeeCount: 65,
        children: [
          {
            id: "8",
            name: "توسعه نرم‌افزار",
            code: "DEV",
            parentId: "3",
            level: 2,
            effectiveFrom: "۱۴۰۰/۰۱/۰۱",
            effectiveTo: null,
            status: "active",
            employeeCount: 35,
          },
          {
            id: "9",
            name: "زیرساخت و امنیت",
            code: "INF",
            parentId: "3",
            level: 2,
            effectiveFrom: "۱۴۰۰/۰۱/۰۱",
            effectiveTo: null,
            status: "active",
            employeeCount: 20,
          },
          {
            id: "10",
            name: "پشتیبانی فنی",
            code: "SUP",
            parentId: "3",
            level: 2,
            effectiveFrom: "۱۴۰۱/۰۴/۰۱",
            effectiveTo: null,
            status: "active",
            employeeCount: 10,
          },
        ],
      },
      {
        id: "4",
        name: "معاونت منابع انسانی",
        code: "HR",
        parentId: "1",
        level: 1,
        effectiveFrom: "۱۴۰۰/۰۱/۰۱",
        effectiveTo: null,
        status: "active",
        employeeCount: 30,
        children: [
          {
            id: "11",
            name: "جذب و استخدام",
            code: "REC",
            parentId: "4",
            level: 2,
            effectiveFrom: "۱۴۰۰/۰۱/۰۱",
            effectiveTo: null,
            status: "active",
            employeeCount: 8,
          },
          {
            id: "12",
            name: "آموزش و توسعه",
            code: "TRN",
            parentId: "4",
            level: 2,
            effectiveFrom: "۱۴۰۰/۰۱/۰۱",
            effectiveTo: null,
            status: "pending",
            employeeCount: 12,
          },
        ],
      },
    ],
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

function TreeNode({
  unit,
  expandedNodes,
  toggleNode,
  onEdit,
  onDelete,
  onView,
}: {
  unit: OrgUnit
  expandedNodes: Set<string>
  toggleNode: (id: string) => void
  onEdit: (unit: OrgUnit) => void
  onDelete: (unit: OrgUnit) => void
  onView: (unit: OrgUnit) => void
}) {
  const isExpanded = expandedNodes.has(unit.id)
  const hasChildren = unit.children && unit.children.length > 0

  return (
    <div className="select-none">
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-muted/50 transition-colors group"
        style={{ paddingRight: `${unit.level * 24 + 12}px` }}
      >
        {hasChildren ? (
          <button
            onClick={() => toggleNode(unit.id)}
            className="p-0.5 hover:bg-muted rounded"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        ) : (
          <div className="w-5" />
        )}

        <Building2 className="h-4 w-4 text-primary" />

        <div className="flex-1 flex items-center gap-3">
          <span className="font-medium text-sm">{unit.name}</span>
          <Badge variant="outline" className="text-xs font-mono">
            {unit.code}
          </Badge>
          <Badge variant={statusVariants[unit.status]} className="text-xs">
            {statusLabels[unit.status]}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{unit.employeeCount} نفر</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{unit.effectiveFrom}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(unit)}>
              <Eye className="h-4 w-4 me-2" />
              مشاهده جزئیات
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(unit)}>
              <Edit className="h-4 w-4 me-2" />
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(unit)}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 me-2" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {unit.children!.map((child) => (
            <TreeNode
              key={child.id}
              unit={child}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrganizationUnitsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    new Set(["1", "2", "3", "4"])
  )
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedUnit, setSelectedUnit] = useState<OrgUnit | null>(null)

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedNodes(newExpanded)
  }

  const expandAll = () => {
    const getAllIds = (units: OrgUnit[]): string[] => {
      return units.flatMap((unit) => [
        unit.id,
        ...(unit.children ? getAllIds(unit.children) : []),
      ])
    }
    setExpandedNodes(new Set(getAllIds(orgUnitsData)))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  const handleEdit = (unit: OrgUnit) => {
    setSelectedUnit(unit)
    setIsCreateDialogOpen(true)
  }

  const handleDelete = (unit: OrgUnit) => {
    // Show confirmation dialog
    console.log("Delete unit:", unit)
  }

  const handleView = (unit: OrgUnit) => {
    // Navigate to detail view
    console.log("View unit:", unit)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
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
            واحدهای سازمانی
          </h1>
          <p className="text-sm text-muted-foreground">
            مدیریت ساختار سازمانی و درخت واحدها
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 me-2" />
          واحد جدید
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="جستجوی واحد سازمانی..."
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
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tree View */}
      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderTree className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">ساختار سازمانی</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={expandAll}>
                باز کردن همه
              </Button>
              <Button variant="ghost" size="sm" onClick={collapseAll}>
                بستن همه
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          {orgUnitsData.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="واحدی یافت نشد"
              description="هنوز هیچ واحد سازمانی تعریف نشده است."
              action={{
                label: "ایجاد واحد جدید",
                onClick: () => setIsCreateDialogOpen(true),
              }}
            />
          ) : (
            <div className="divide-y divide-border">
              {orgUnitsData.map((unit) => (
                <TreeNode
                  key={unit.id}
                  unit={unit}
                  expandedNodes={expandedNodes}
                  toggleNode={toggleNode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedUnit ? "ویرایش واحد سازمانی" : "ایجاد واحد سازمانی جدید"}
            </DialogTitle>
            <DialogDescription>
              اطلاعات واحد سازمانی را وارد کنید.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">نام واحد</Label>
              <Input
                id="name"
                placeholder="مثال: معاونت مالی"
                defaultValue={selectedUnit?.name}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="code">کد واحد</Label>
              <Input
                id="code"
                placeholder="مثال: FIN"
                defaultValue={selectedUnit?.code}
                className="font-mono"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="parent">واحد والد</Label>
              <Select defaultValue={selectedUnit?.parentId || ""}>
                <SelectTrigger id="parent">
                  <SelectValue placeholder="انتخاب واحد والد" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">بدون والد (سطح اول)</SelectItem>
                  <SelectItem value="1">شرکت مادر</SelectItem>
                  <SelectItem value="2">معاونت مالی</SelectItem>
                  <SelectItem value="3">معاونت فناوری اطلاعات</SelectItem>
                  <SelectItem value="4">معاونت منابع انسانی</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="effectiveFrom">تاریخ شروع اعتبار</Label>
                <Input
                  id="effectiveFrom"
                  type="text"
                  placeholder="۱۴۰۳/۰۱/۰۱"
                  defaultValue={selectedUnit?.effectiveFrom}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="effectiveTo">تاریخ پایان اعتبار</Label>
                <Input
                  id="effectiveTo"
                  type="text"
                  placeholder="اختیاری"
                  defaultValue={selectedUnit?.effectiveTo || ""}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">وضعیت</Label>
              <Select defaultValue={selectedUnit?.status || "active"}>
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
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateDialogOpen(false)
                setSelectedUnit(null)
              }}
            >
              انصراف
            </Button>
            <Button
              onClick={() => {
                setIsCreateDialogOpen(false)
                setSelectedUnit(null)
              }}
            >
              {selectedUnit ? "ذخیره تغییرات" : "ایجاد واحد"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
