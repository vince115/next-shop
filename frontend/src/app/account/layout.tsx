"use client";

import AccountSidebar from "@/components/account/AccountSidebar";
import { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <AccountSidebar />
          <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {children}
          </section>
        </div>
      </div>
    </main>
  );
}
