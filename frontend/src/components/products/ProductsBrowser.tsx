"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Category } from "@/types/category";
import { Page, Product } from "@/types/product";

type SortOption = "default" | "sales" | "newest" | "price_asc" | "price_desc";

const quickSortTabs: { label: string; value: SortOption }[] = [
  { label: "綜合排序", value: "default" },
  { label: "熱銷", value: "sales" },
  { label: "最新", value: "newest" },
];

function mapInitialSort(value?: string): SortOption {
  if (value === "sales" || value === "newest" || value === "price_asc" || value === "price_desc") {
    return value;
  }
  return "default";
}

type ViewMode = "grid" | "list";

function getPageNumbers(current: number, totalPages: number) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);

  const pages: Array<number | "ellipsis"> = [];
  const last = totalPages - 1;

  pages.push(0);

  const left = Math.max(1, current - 1);
  const right = Math.min(last - 1, current + 1);

  if (left > 1) pages.push("ellipsis");
  for (let p = left; p <= right; p++) pages.push(p);
  if (right < last - 1) pages.push("ellipsis");

  pages.push(last);
  return pages;
}

interface ProductsBrowserProps {
  productsPage: Page<Product>;
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: string;
  isSidebarOpen?: boolean;
}

export default function ProductsBrowser({
  productsPage,
  categories,
  initialQuery,
  initialCategory,
  initialSort,
  isSidebarOpen = true,
}: ProductsBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<SortOption>(mapInitialSort(initialSort));
  const [view, setView] = useState<ViewMode>("grid");

  const { content: products, totalElements: total, totalPages, number: currentPage } = productsPage;

  const pageSize = productsPage.size;
  const startIndex = currentPage * pageSize;
  const endIndexExclusive = Math.min(startIndex + products.length, total);

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const rangeText = total === 0 ? "共 0 項" : `共 ${total} 項，第 ${startIndex + 1}-${endIndexExclusive} 項`;

  function replaceUrl(next: { q?: string; sort?: SortOption; page?: number }) {
    const params = new URLSearchParams(searchParams?.toString());

    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q);
      else params.delete("q");
      params.delete("page"); // Reset page on search
    }

    if (next.sort !== undefined) {
      if (next.sort && next.sort !== "default") params.set("sort", next.sort);
      else params.delete("sort");
    }

    if (next.page !== undefined) {
      if (next.page > 0) params.set("page", next.page.toString());
      else params.delete("page");
    }

    const qs = params.toString();
    const url = qs ? `${pathname}?${qs}` : pathname;

    startTransition(() => {
      router.replace(url);
    });
  }

  // Effect to sync URL q parameter while typing
  useEffect(() => {
    if (query === initialQuery) return;
    const timer = setTimeout(() => {
      replaceUrl({ q: query || undefined });
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle Enter key for search
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      replaceUrl({ q: query || undefined });
    }
  };

  return (
    <div className="space-y-6">
      <header className="bg-white/80 p-5 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400">Inventory Catalog</p>
            <h2 className="text-3xl font-bold text-gray-900 mt-1">嚴選商品</h2>
            <p className="mt-1 text-sm text-gray-500 font-medium">{rangeText}</p>
          </div>
          {isPending && (
            <div className="flex items-center gap-2 text-gray-400 animate-in fade-in zoom-in">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs font-semibold uppercase tracking-widest">Update...</span>
            </div>
          )}
        </div>

        <div className="flex w-full flex-wrap items-center gap-4 border-b border-gray-200 pb-4">
          <div className="flex shrink-0 items-center gap-6 text-sm font-bold">
            {quickSortTabs.map((tab) => {
              const isActive = sort === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setSort(tab.value);
                    replaceUrl({ sort: tab.value });
                  }}
                  className={`pb-1 transition-colors border-b-2 ${isActive
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-400 border-transparent hover:text-gray-600"
                    }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex w-full max-w-sm flex-1 justify-center">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="搜尋商品名稱或描述…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all font-medium"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3 ml-auto">
            <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setView("grid")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${view === "grid" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={18} />
              </button>
              <button
                type="button"
                onClick={() => setView("list")}
                className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors ${view === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>

            <label className="flex shrink-0 items-center gap-2">
              <select
                value={sort}
                onChange={(e) => {
                  const next = e.target.value as SortOption;
                  setSort(next);
                  replaceUrl({ sort: next });
                }}
                className="rounded-xl border border-gray-200 bg-white py-2 px-3 text-sm font-semibold text-gray-700 focus:border-gray-400 focus:outline-none transition-all shadow-sm"
              >
                <option value="default">綜合排序</option>
                <option value="sales">熱銷排行</option>
                <option value="newest">最新上架</option>
                <option value="price_asc">價格：低 → 高</option>
                <option value="price_desc">價格：高 → 低</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      <div className={`relative transition-opacity duration-300 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
        {products.length === 0 ? (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in translate-y-4">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-2">
              <Loader2 className="h-8 w-8 text-gray-200" />
            </div>
            <p className="text-xl font-bold text-gray-900">找不到相關商品</p>
            <p className="text-sm text-gray-500 max-w-xs">嘗試調整您的搜尋關鍵字或分類標籤。</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => replaceUrl({ page: currentPage - 1 })}
              disabled={currentPage === 0}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold shadow-sm"
              aria-label="Previous page"
            >
              <ChevronLeft size={20} />
            </button>

            {pageNumbers.map((p, idx) =>
              p === "ellipsis" ? (
                <span key={`e-${idx}`} className="px-2 text-sm text-gray-400 font-bold">
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => replaceUrl({ page: p })}
                  className={`h-11 min-w-11 rounded-xl border px-4 text-sm font-bold transition-all shadow-sm ${p === currentPage ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
                >
                  {p + 1}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => replaceUrl({ page: currentPage + 1 })}
              disabled={currentPage === totalPages - 1}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-30 hover:bg-gray-50 transition-all font-bold shadow-sm"
              aria-label="Next page"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
