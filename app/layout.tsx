import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "ایجاد مستأجر جدید | Dynova",
  description: "نمونه اولیه جریان ایجاد مستأجر جدید در پلتفرم حاکمیت داده",
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
    <html lang="fa" dir="rtl" className="bg-color-bg-default">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
