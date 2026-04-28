"use client";

import { useState } from "react";
import { OrganizationList } from "@/components/organization-list";
import { TenantWizardPanel } from "@/components/tenant-wizard/tenant-wizard-panel";

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Main Layout */}
      <div className="flex h-screen">
        {/* Sidebar Placeholder */}
        <aside className="w-64 border-l border-border bg-card flex flex-col">
          <div className="flex items-center justify-center h-16 border-b border-border">
            <span className="text-lg font-bold text-primary">Dynova MDM</span>
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg bg-selection-selected px-3 py-2 text-sm font-medium text-foreground"
                >
                  سازمان‌ها
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  کاربران
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted transition-colors"
                >
                  تنظیمات
                </a>
              </li>
            </ul>
          </nav>
          {/* Toggle for demo */}
          <div className="p-4 border-t border-border">
            <button
              onClick={() => setShowEmptyState(!showEmptyState)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showEmptyState ? "نمایش لیست" : "نمایش حالت خالی"}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <OrganizationList
            onAddOrganization={() => setIsWizardOpen(true)}
            showStickyBar={isWizardOpen}
            isEmpty={showEmptyState}
          />
        </main>
      </div>

      {/* Wizard Panel */}
      <TenantWizardPanel
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
