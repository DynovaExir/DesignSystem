"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n-context";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { ChevronRight, User, Settings, LogOut } from "lucide-react";

interface HeaderProps {
  onLogout: () => void;
}

export function Header({ onLogout }: HeaderProps) {
  const router = useRouter();
  const { t, dir } = useI18n();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const breadcrumbs = [
    { label: t("breadcrumb.home"), href: "/" },
    { label: t("breadcrumb.dashboard"), href: "/app" },
  ];

  const ChevronIcon = ChevronRight;

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-default bg-card px-6">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          {breadcrumbs.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronIcon
                  className={cn(
                    "h-4 w-4 text-text-disabled",
                    dir === "rtl" && "rtl-flip"
                  )}
                  aria-hidden="true"
                />
              )}
              <a
                href={item.href}
                className={cn(
                  "text-body-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-sm",
                  index === breadcrumbs.length - 1
                    ? "text-foreground font-semibold"
                    : "text-text-secondary hover:text-foreground"
                )}
                aria-current={
                  index === breadcrumbs.length - 1 ? "page" : undefined
                }
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <LanguageSwitcher />

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
            className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
          >
            <div className="h-8 w-8 overflow-hidden rounded-full bg-neutral-200">
              <img
                src="/placeholder-user.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </button>

          {isDropdownOpen && (
            <div
              className="absolute end-0 top-full mt-2 w-48 rounded-md border border-border-default bg-card py-1 shadow-md"
              role="menu"
            >
              <a
                href="/app/profile"
                className="flex items-center gap-2 px-4 py-2 text-body-md text-foreground hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                role="menuitem"
              >
                <User className="h-4 w-4" />
                {t("nav.profile")}
              </a>
              <a
                href="/app/settings"
                className="flex items-center gap-2 px-4 py-2 text-body-md text-foreground hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                role="menuitem"
              >
                <Settings className="h-4 w-4" />
                {t("nav.settings")}
              </a>
              <hr className="my-1 border-border-default" />
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-body-md text-foreground hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                role="menuitem"
              >
                <LogOut className="h-4 w-4 rtl-flip" />
                {t("nav.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
