//frontend/src/components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Folder,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Categories", href: "/admin/categories", icon: Folder },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }
  return pathname.startsWith(href);
}

export default function AdminSidebar({
  collapsed,
}: {
  collapsed: boolean;
}) {
  const pathname = usePathname();

  return (
    <aside
      className={`transition-all duration-300 border-r border-slate-200 bg-white py-8 flex flex-col ${
        collapsed ? "w-16 items-center px-2" : "w-60 px-6"
      }`}
    >
      {/* Logo / Title */}
      <div className="mb-8 w-full">
        {!collapsed ? (
          <>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              NextShop
            </p>
            <h1 className="text-xl font-semibold text-slate-900">Admin</h1>
          </>
        ) : (
          <div className="flex justify-center text-lg font-bold text-slate-900">
            N
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 text-sm font-medium text-slate-600 w-full">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : ""}
              className={`flex items-center rounded-xl py-2 transition-all ${
                collapsed ? "justify-center px-2" : "px-4 gap-3"
              } ${
                active
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />

              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}