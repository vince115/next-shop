"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import SearchBar from "@/components/SearchBar";
import UserMenu from "@/components/UserMenu";
import CartIcon from "@/components/CartIcon";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems);
  const [searchOpen, setSearchOpen] = useState(false);

  const navLinks = [
    { label: "品牌故事", href: "/" },
    { label: "嚴選商品", href: "/products" },
    { label: "最新消息", href: "/" },
    { label: "購物說明", href: "/" },
    { label: "常見問題", href: "/" },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <Link href="/products" className="text-lg font-bold text-gray-900">
            NextShop
          </Link>
        </div>

        <div className="flex flex-1 justify-center px-8">
          <nav className="flex items-center gap-8 overflow-x-auto">
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
        </div>

        <div className="flex items-center gap-3">
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

          <UserMenu />
          <CartIcon count={totalItems} />
        </div>
      </div>
    </header>
  );
}
