"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

/**
 * Dynova AppShell - Main Layout Component
 * Three-zone layout:
 * - Sidebar: 200px (expanded) / 76px (collapsed)
 * - Header: 64px
 * - Content: remaining space with #F3F4F6 background
 */

export interface AppShellProps {
  children: React.ReactNode
  user?: {
    id: string
    name: string
    email: string
    avatar?: string
    role: {
      id: string
      name: string
    }
  }
  tenant?: {
    id: string
    name: string
    logo?: string
  }
  tenants?: Array<{
    id: string
    name: string
    logo?: string
  }>
  userPermissions?: string[]
  pageTitle?: string
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
  onLogout?: () => void
  onTenantChange?: (tenantId: string) => void
}

export function AppShell({
  children,
  user,
  tenant,
  tenants = [],
  userPermissions = [],
  pageTitle,
  breadcrumbs = [],
  onLogout,
  onTenantChange,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentTenant={tenant}
        userPermissions={userPermissions}
      />

      {/* Header */}
      <Header
        user={user}
        tenant={tenant}
        tenants={tenants}
        sidebarCollapsed={sidebarCollapsed}
        pageTitle={pageTitle}
        breadcrumbs={breadcrumbs}
        onLogout={onLogout}
        onTenantChange={onTenantChange}
      />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen pt-16 transition-all duration-300",
          sidebarCollapsed ? "me-[76px]" : "me-[200px]"
        )}
      >
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
