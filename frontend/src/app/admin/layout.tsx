// frontend/src/app/admin/layout.tsx

"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navbar */}
      <AdminNavbar onToggle={() => setCollapsed((v) => !v)} />

      <div className="flex flex-1">
        {/* Sidebar */}
        <AdminSidebar collapsed={collapsed} />

        {/* Content */}
        <main className="flex-1 overflow-auto px-8 py-6 transition-all">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}