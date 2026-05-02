import type { Metadata, Viewport } from "next"
import { LocaleProvider } from "@/lib/locale-context"
import { TenantProvider } from "@/components/tenant-selector/tenant-provider"
import { Toaster } from "@/components/ui/sonner"
import { AppHeader } from "@/components/layout/app-header"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dynova | داینووا",
  description: "Dynova EPM/Holding Management Platform - پلتفرم مدیریت هولدینگ داینووا",
}

export const viewport: Viewport = {
  themeColor: "#155c84",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className="bg-background">
      <body className="min-h-screen font-sans antialiased">
        <LocaleProvider>
          <TenantProvider>
            <div className="flex min-h-screen flex-col">
              <AppHeader />
              <main className="flex-1 bg-background">
                {children}
              </main>
            </div>
            <Toaster position="bottom-center" richColors />
          </TenantProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
