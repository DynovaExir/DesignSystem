"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { DynovaLogo } from "@/components/common/DynovaLogo";
import {
  LayoutDashboard,
  Settings,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  onLogout: () => void;
}

export function Sidebar({ onLogout }: SidebarProps) {
  const { t, dir } = useI18n();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: t("nav.dashboard"), href: "/app" },
    { icon: User, label: t("nav.profile"), href: "/app/profile" },
    { icon: Settings, label: t("nav.settings"), href: "/app/settings" },
  ];

  const ChevronIcon = dir === "rtl" ? ChevronRight : ChevronLeft;
  const ExpandIcon = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <aside
      className={cn(
        "flex flex-col bg-primary-900 text-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && (
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold text-card tracking-tight">
              Dynova
            </span>
            <span className="w-2 h-2 rounded-full bg-primary-300" aria-hidden="true" />
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "rounded-full p-1.5 hover:bg-primary-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ExpandIcon className="h-4 w-4" />
          ) : (
            <ChevronIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="flex flex-col gap-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-full px-3 py-2 text-card/80 transition-colors hover:bg-primary-800 hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && (
                  <span className="text-body-md">{item.label}</span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout button */}
      <div className="border-t border-primary-800 p-2">
        <button
          onClick={onLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-full px-3 py-2 text-card/80 transition-colors hover:bg-primary-800 hover:text-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 rtl-flip" />
          {!isCollapsed && (
            <span className="text-body-md">{t("nav.logout")}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
