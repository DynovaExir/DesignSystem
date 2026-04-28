import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dynova MDM - Organization Management",
  description: "Multi-Device Management Admin Panel",
};

export const viewport: Viewport = {
  themeColor: "#155c84",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="bg-background">
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}
