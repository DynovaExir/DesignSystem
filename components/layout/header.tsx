"use client"

import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
  Building2,
  HelpCircle,
} from "lucide-react"

/**
 * Dynova Header Component
 * Based on AGENT.md v3.1 specifications:
 * - Height: 64px
 * - Background: color/bg/subtle
 * - Bottom border: color/border/default
 * - Shows active role and tenant
 */

export interface HeaderUser {
  id: string
  name: string
  email: string
  avatar?: string
  role: {
    id: string
    name: string
  }
}

export interface HeaderTenant {
  id: string
  name: string
  logo?: string
}

export interface HeaderProps {
  user?: HeaderUser
  tenant?: HeaderTenant
  tenants?: HeaderTenant[]
  onLogout?: () => void
  onTenantChange?: (tenantId: string) => void
  sidebarCollapsed?: boolean
  notifications?: number
  pageTitle?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export function Header({
  user,
  tenant,
  tenants = [],
  onLogout,
  onTenantChange,
  sidebarCollapsed = false,
  notifications = 0,
  pageTitle,
  breadcrumbs = [],
}: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
  }

  return (
    <TooltipProvider>
      <header
        className={cn(
          "fixed top-0 left-0 z-30 flex h-16 items-center justify-between border-b bg-card px-6 transition-all duration-300",
          sidebarCollapsed ? "right-[76px]" : "right-[200px]"
        )}
      >
        {/* Left Section: Breadcrumbs / Page Title */}
        <div className="flex items-center gap-4">
          {breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <span className="text-muted-foreground">/</span>
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="font-semibold">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          ) : pageTitle ? (
            <h1 className="text-lg font-semibold">{pageTitle}</h1>
          ) : null}
        </div>

        {/* Right Section: User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* Tenant Selector (if multiple tenants) */}
          {tenant && tenants.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Building2 className="h-4 w-4" />
                  <span className="max-w-[150px] truncate">{tenant.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuLabel>انتخاب مستأجر</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tenants.map((t) => (
                  <DropdownMenuItem
                    key={t.id}
                    onClick={() => onTenantChange?.(t.id)}
                    className={cn(t.id === tenant.id && "bg-accent")}
                  >
                    {t.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Role Badge */}
          {user?.role && (
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {user.role.name}
            </Badge>
          )}

          {/* Notifications */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                    {notifications > 9 ? "۹+" : notifications}
                  </span>
                )}
                <span className="sr-only">اعلان‌ها</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>اعلان‌ها</TooltipContent>
          </Tooltip>

          {/* Help */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <HelpCircle className="h-5 w-5" />
                <span className="sr-only">راهنما</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>راهنما</TooltipContent>
          </Tooltip>

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 rounded-full pe-2 ps-4"
                >
                  <div className="hidden flex-col items-end sm:flex">
                    <span className="text-sm font-semibold">{user.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <Badge variant="outline" className="mt-1 w-fit">
                      {user.role.name}
                    </Badge>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    پروفایل
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    تنظیمات
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 me-2" />
                  خروج از حساب
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
    </TooltipProvider>
  )
}
