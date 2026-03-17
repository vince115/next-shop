"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import SearchBar from "@/components/SearchBar";
import UserMenu from "@/components/UserMenu";
import CartIcon from "@/components/CartIcon";
import { useLoginModal } from "@/context/LoginModalContext";
import { useCategorySidebar } from "@/components/categories/CategorySidebarContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems);
  const [searchOpen, setSearchOpen] = useState(false);
  const { openModal } = useLoginModal();
  const { sidebarOpen, setSidebarOpen } = useCategorySidebar();
  const pathname = usePathname();
  const sidebarEnabledPaths = ["/products", "/about", "/news", "/shopping", "/faq"];
  const showCategoryToggle = sidebarEnabledPaths.some((path) => pathname?.startsWith(path));

  const navLinks = [
    { label: "品牌故事", href: "/about" },
    { label: "嚴選商品", href: "/products" },
    { label: "最新消息", href: "/news" },
    { label: "購物說明", href: "/shopping" },
    { label: "常見問題", href: "/faq" },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="flex w-full items-center justify-between gap-6 px-6 py-3">
        <div className="flex items-center gap-3">
          {showCategoryToggle && (
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label={sidebarOpen ? "Collapse category sidebar" : "Expand category sidebar"}
              aria-expanded={sidebarOpen}
            >
              <Menu size={18} />
            </button>
          )}
          <Link href="/products" className="text-lg font-bold text-gray-900">
            NextShop
          </Link>
        </div>

        <nav className="mx-auto hidden max-w-5xl w-full items-center justify-center gap-[clamp(24px,3vw,48px)] overflow-x-auto lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="whitespace-nowrap text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <SearchBar open={searchOpen} />

          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            aria-label="Toggle search"
            aria-expanded={searchOpen}
          >
            <Search size={20} />
          </button>

          <UserMenu onOpenLogin={openModal} />
          <CartIcon count={totalItems} />
        </div>
      </div>
    </header>
  );
}
