"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "我的帳戶", href: "/account" },
  { label: "我的訂單", href: "/account/orders" },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-4 lg:p-6">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">帳戶中心</p>
        <h2 className="text-lg font-semibold text-gray-900">NextShop 會員</h2>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isRoot = item.href === "/account";
          const isActive = isRoot ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                isActive ? "bg-gray-900 text-white" : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
