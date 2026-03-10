"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-lg font-bold text-gray-900">
          Next Shop
        </Link>
        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cart
          {totalItems > 0 && (
            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs text-white">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
