"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  LayoutDashboard,
  Users,
  Building2,
  Shield,
  Database,
  FileText,
  Settings,
  ChevronRight,
  ChevronLeft,
  FolderTree,
  Key,
  UserCog,
  BarChart3,
} from "lucide-react"

/**
 * Dynova Sidebar Component
 * Based on AGENT.md v3.1 specifications:
 * - Expanded: 200px
 * - Collapsed: 76px
 * - Background: color/bg/subtle
 * - Right edge: 1px border (no shadow)
 * - Collapsed nav items: tooltip required (WCAG 1.1.1)
 */

export interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  permission?: string
  badge?: string
  children?: NavItem[]
}

export interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentTenant?: {
    name: string
    logo?: string
  }
  navItems?: NavItem[]
  userPermissions?: string[]
}

const defaultNavItems: NavItem[] = [
  {
    title: "داشبورد",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "اشخاص و کاربران",
    href: "/persons",
    icon: Users,
    permission: "person:read",
  },
  {
    title: "ساختار سازمانی",
    href: "/org-units",
    icon: Building2,
    permission: "org-unit:read",
  },
  {
    title: "حاکمیت داده",
    href: "/governance",
    icon: FolderTree,
    permission: "governance:read",
    children: [
      {
        title: "دامنه‌ها",
        href: "/governance/domains",
        icon: FolderTree,
      },
      {
        title: "مدل‌های داده",
        href: "/governance/models",
        icon: Database,
      },
    ],
  },
  {
    title: "دیکشنری داده",
    href: "/data-dictionary",
    icon: FileText,
    permission: "dictionary:read",
  },
  {
    title: "گزارش‌ها",
    href: "/reports",
    icon: BarChart3,
    permission: "report:read",
  },
]

const adminNavItems: NavItem[] = [
  {
    title: "مدیریت نقش‌ها",
    href: "/admin/roles",
    icon: Shield,
    permission: "role:manage",
  },
  {
    title: "مجوزها",
    href: "/admin/permissions",
    icon: Key,
    permission: "permission:read",
  },
  {
    title: "کاربران مستأجر",
    href: "/admin/users",
    icon: UserCog,
    permission: "user:manage",
  },
  {
    title: "تنظیمات",
    href: "/admin/settings",
    icon: Settings,
    permission: "settings:manage",
  },
]

function NavItemComponent({
  item,
  collapsed,
  isActive,
  hasPermission,
}: {
  item: NavItem
  collapsed: boolean
  isActive: boolean
  hasPermission: boolean
}) {
  const Icon = item.icon
  
  if (!hasPermission) {
    return null
  }

  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent hover:text-accent-foreground",
        collapsed && "justify-center px-3"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed && <span className="truncate">{item.title}</span>}
      {!collapsed && item.badge && (
        <span className="me-auto rounded-full bg-destructive px-2 py-0.5 text-xs text-destructive-foreground">
          {item.badge}
        </span>
      )}
    </Link>
  )

  if (collapsed) {
    return (
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="left" className="text-sm">
          {item.title}
        </TooltipContent>
      </Tooltip>
    )
  }

  return content
}

export function Sidebar({
  collapsed,
  onToggle,
  currentTenant,
  navItems = defaultNavItems,
  userPermissions = [],
}: SidebarProps) {
  const pathname = usePathname()

  const hasPermission = (permission?: string) => {
    if (!permission) return true
    return userPermissions.includes(permission) || userPermissions.includes("*")
  }

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 flex h-screen flex-col border-l bg-card transition-all duration-300",
          collapsed ? "w-[76px]" : "w-[200px]"
        )}
      >
        {/* Logo / Tenant */}
        <div className="flex h-16 items-center justify-center border-b px-4">
          {collapsed ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
              د
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground font-semibold">
                د
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">داینووا</span>
                {currentTenant && (
                  <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                    {currentTenant.name}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="flex flex-col gap-1">
            {/* Main Navigation */}
            {navItems.map((item) => (
              <NavItemComponent
                key={item.href}
                item={item}
                collapsed={collapsed}
                isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                hasPermission={hasPermission(item.permission)}
              />
            ))}

            {/* Admin Section */}
            {adminNavItems.some((item) => hasPermission(item.permission)) && (
              <>
                <div className={cn("my-4 h-px bg-border", collapsed && "mx-2")} />
                {!collapsed && (
                  <span className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
                    مدیریت
                  </span>
                )}
                {adminNavItems.map((item) => (
                  <NavItemComponent
                    key={item.href}
                    item={item}
                    collapsed={collapsed}
                    isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                    hasPermission={hasPermission(item.permission)}
                  />
                ))}
              </>
            )}
          </nav>
        </ScrollArea>

        {/* Toggle Button */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-center rounded-full",
              collapsed ? "px-3" : "px-4"
            )}
            onClick={onToggle}
            aria-label={collapsed ? "باز کردن منو" : "بستن منو"}
          >
            {collapsed ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <>
                <ChevronRight className="h-5 w-5" />
                <span className="me-2">بستن منو</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
