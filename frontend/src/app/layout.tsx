// frontend/src/app/layout.tsx

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CartInitializer from "@/components/CartInitializer";
import { AuthProvider } from "@/context/AuthContext";
import { LoginModalProvider } from "@/context/LoginModalContext";
import { CategorySidebarProvider } from "@/components/categories/CategorySidebarContext";
import LayoutShell from "@/components/LayoutShell"; // ✅ 加這個

// ⚠️ CRITICAL ARCHITECTURE RULE
// DO NOT render Navbar in RootLayout
// Navbar is conditionally rendered in LayoutShell
// Breaking this will cause:
// - Admin layout bug
// - Duplicate navbar rendering

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Shop",
  description: "An online shop built with Next.js and Spring Boot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}>
        <AuthProvider>
          <LoginModalProvider>
            <CategorySidebarProvider>
              <CartInitializer />

              {/* ✅ Navbar 控制集中在這 */}
              <LayoutShell>
                {children}
              </LayoutShell>

            </CategorySidebarProvider>
          </LoginModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}