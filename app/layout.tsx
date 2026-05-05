import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const yekanBakhFaNum = localFont({
  src: [
    {
      path: "../public/fonts/YekanBakhFaNum-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/YekanBakhFaNum-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-yekan-bakh",
  display: "swap",
})

export const metadata: Metadata = {
  title: "داینووا | پلتفرم مدیریت داده‌های اصلی",
  description: "پلتفرم یکپارچه مدیریت داده‌های اصلی سازمانی و حاکمیت داده برای سازمان‌های ایرانی",
  keywords: ["MDM", "حاکمیت داده", "مدیریت داده", "سازمانی", "داینووا"],
  authors: [{ name: "تیم داینووا" }],
}

export const viewport: Viewport = {
  themeColor: "#155C84",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fa" dir="rtl" className={`${yekanBakhFaNum.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        <Toaster position="top-center" dir="rtl" />
      </body>
    </html>
  )
}
