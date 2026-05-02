import type { Metadata, Viewport } from "next";
import { I18nProvider } from "@/lib/i18n-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynova - Holding Management System",
  description:
    "Multi-tenant holding management system for enterprise organizations",
};

export const viewport: Viewport = {
  themeColor: "#155c84",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="bg-background" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <I18nProvider defaultLocale="fa">{children}</I18nProvider>
      </body>
    </html>
  );
}
