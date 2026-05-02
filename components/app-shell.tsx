'use client';

import React from 'react';

interface AppShellProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

export function AppShell({ children, header }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {header && (
        <header className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}
      <main className="flex-1">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
