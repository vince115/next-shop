//frontend/src/components/admin/AdminNavbar.tsx
"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu } from "lucide-react";

export default function AdminNavbar({
  onToggle,
}: {
  onToggle: () => void;
}) {
  return (
    <header className="flex h-[60px] items-center justify-between border-b border-slate-200 bg-white px-8">
      <div className="flex items-center space-x-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onToggle}>
              <Menu size={18} />
            </button>
        
          <Link href="/products" className="text-lg font-bold text-gray-900">
            NextShop
          </Link>
        </div>

        
      </div>

      <div className="flex items-center gap-6">
  <span className="text-xs uppercase tracking-[0.4em] text-slate-400">
    Admin
  </span>

  <button className="rounded-full border px-4 py-1.5 text-sm">
    Logout
  </button>
</div>
    </header>
  );
}
