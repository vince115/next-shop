"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  BookOpen,
  HelpCircle,
  Newspaper,
  Package,
  type LucideIcon,
} from "lucide-react";
import { useCategorySidebar } from "@/components/categories/CategorySidebarContext";

export type ContentSidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const contentSidebarItems: ContentSidebarItem[] = [
  { label: "品牌故事", href: "/about", icon: BookOpen },
  { label: "最新消息", href: "/news", icon: Newspaper },
  { label: "購物說明", href: "/shopping", icon: Package },
  { label: "常見問題", href: "/faq", icon: HelpCircle },
];

interface ContentSidebarLayoutProps {
  activeHref: string;
  children: ReactNode;
}

export default function ContentSidebarLayout({
  activeHref,
  children,
}: ContentSidebarLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useCategorySidebar();

  const handleNavClick = () => {
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  return (
    <section className="min-h-screen bg-white/80">
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-x-0 top-16 bottom-0 z-20 bg-black/40 lg:hidden"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex">
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-64 border-r border-gray-200 bg-white transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:shadow-none`}
        >
          <div className="flex h-full flex-col">
            <div className="space-y-1 border-b border-gray-100 pl-4 pr-3 pt-4 pb-2">
              <p className="text-[11px] uppercase tracking-[0.35em] text-gray-400">CONTENT</p>
              <p className="text-sm font-semibold text-gray-900">導覽</p>
            </div>

            <nav className="space-y-1 p-3">
              {contentSidebarItems.map((item) => {
                const Icon = item.icon;
                const active = activeHref === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    onClick={handleNavClick}
                    className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm transition ${
                      active
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-100"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-gray-900" : "text-gray-500"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main
          className={`flex-1 pt-16 transition-all duration-300 ${sidebarOpen ? "lg:ml-64" : "ml-0"}`}
        >
          <div className="mx-auto w-full max-w-5xl px-6 py-10 space-y-10 sm:px-8 lg:py-14">
            {children}
          </div>
        </main>
      </div>
    </section>
  );
}
