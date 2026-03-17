"use client";

import { useEffect, useState } from "react";
import CategorySidebar from "@/components/categories/CategorySidebar";
import ProductsBrowser from "@/components/products/ProductsBrowser";
import { useCategorySidebar } from "@/components/categories/CategorySidebarContext";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

interface ProductsPageShellProps {
  categories: Category[];
  products: Product[];
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: string;
}

export default function ProductsPageShell({
  categories,
  products,
  initialQuery,
  initialCategory,
  initialSort,
}: ProductsPageShellProps) {
  const { sidebarOpen } = useCategorySidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showDesktopSidebar = mounted ? sidebarOpen : true;

  return (
    <div className="min-h-screen bg-white/80">
      <div className="lg:hidden px-4 pt-8 pb-6">
        <CategorySidebar categories={categories} selectedSlug={initialCategory} />
      </div>

      <div className="flex">
        {showDesktopSidebar && (
          <aside className="hidden lg:block w-[240px] shrink-0 border-r border-gray-200 bg-white">
            <CategorySidebar categories={categories} selectedSlug={initialCategory} />
          </aside>
        )}

        <main className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
            <ProductsBrowser
              products={products}
              categories={categories}
              initialQuery={initialQuery}
              initialCategory={initialCategory}
              initialSort={initialSort}
              isSidebarOpen={sidebarOpen}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
