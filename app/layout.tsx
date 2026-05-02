import type { Metadata, Viewport } from "next"
import "./globals.css"
import { LocaleProvider } from "@/lib/contexts/locale-context"
import { Toaster } from "@/components/ui/sonner"
import { AppHeader } from "@/components/layout/app-header"

export const metadata: Metadata = {
  title: "Dynova - Enterprise Tenant Management",
  description: "Multi-tenant enterprise platform management system",
}

export const viewport: Viewport = {
  themeColor: "#2093d1",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className="bg-background" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <LocaleProvider defaultLocale="fa">
          <div className="relative flex min-h-screen flex-col">
            <AppHeader />
            <main className="flex-1">{children}</main>
          </div>
          <Toaster position="bottom-center" />
        </LocaleProvider>
      </body>
    </html>
  )
}
