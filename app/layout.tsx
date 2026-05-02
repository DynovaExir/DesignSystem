import type { Metadata, Viewport } from "next"
import "./globals.css"
import { LocaleProvider } from "@/components/providers/locale-provider"

export const metadata: Metadata = {
  title: "Dynova MDM",
  description: "Unified Device Management Platform - مدیریت یکپارچه دستگاه‌ها",
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
    <html lang="fa" dir="rtl" className="bg-background" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
