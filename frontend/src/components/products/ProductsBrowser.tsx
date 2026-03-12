"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, Menu } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import CategorySidebar from "@/components/categories/CategorySidebar";
import { useCategorySidebar } from "@/components/categories/CategorySidebarContext";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

type SortOption = "price_asc" | "price_desc" | "newest" | "oldest";

type ViewMode = "grid" | "list";

function matchesQuery(product: Product, q: string) {
  if (!q) return true;
  const haystack = `${product.name ?? ""} ${product.description ?? ""}`.toLowerCase();
  return haystack.includes(q.toLowerCase());
}

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

export default function ProductsBrowser({
  products,
  categories,
  initialQuery,
  initialCategory,
  initialSort,
}: {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { sidebarOpen, setSidebarOpen } = useCategorySidebar();

  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<SortOption>(
    (initialSort as SortOption) ?? "newest"
  );
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(0);

  const queryDebounceRef = useRef<number | null>(null);

  const pageSize = 20;

  const filteredSorted = useMemo(() => {
    const filtered = products.filter((p) => matchesQuery(p, query));
    return filtered;
  }, [products, query]);

  const total = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const startIndex = safePage * pageSize;
  const endIndexExclusive = Math.min(startIndex + pageSize, total);
  const visible = filteredSorted.slice(startIndex, endIndexExclusive);

  const pageNumbers = getPageNumbers(safePage, totalPages);

  const rangeText = total === 0 ? "共 0 項" : `共 ${total} 項，第 ${startIndex + 1}-${endIndexExclusive} 項`;

  function replaceUrl(next: { q?: string; sort?: string }) {
    const params = new URLSearchParams(searchParams?.toString());

    if (next.q) params.set("q", next.q);
    else params.delete("q");

    if (next.sort) params.set("sort", next.sort);
    else params.delete("sort");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);

  useEffect(() => {
    if (queryDebounceRef.current != null) {
      window.clearTimeout(queryDebounceRef.current);
    }

    queryDebounceRef.current = window.setTimeout(() => {
      replaceUrl({ q: query || undefined, sort });
      queryDebounceRef.current = null;
    }, 250);

    return () => {
      if (queryDebounceRef.current != null) {
        window.clearTimeout(queryDebounceRef.current);
        queryDebounceRef.current = null;
      }
    };
  }, [query]);

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              aria-label={sidebarOpen ? "Collapse category sidebar" : "Expand category sidebar"}
              aria-expanded={sidebarOpen}
            >
              <Menu size={18} />
            </button>
            <div className="text-sm font-medium text-gray-700">{rangeText}</div>
          </div>

          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <div className="flex flex-1 md:flex-none">
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(0);
                }}
                placeholder="搜尋商品名稱或描述…"
                className="w-full md:w-[320px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setView("grid")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${view === "grid" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  aria-label="Grid view"
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${view === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                  aria-label="List view"
                >
                  <List size={18} />
                </button>
              </div>

              <select
                value={sort}
                onChange={(e) => {
                  const next = e.target.value as SortOption;
                  setSort(next);
                  setPage(0);
                  replaceUrl({ q: query || undefined, sort: next });
                }}
                className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="newest">最新</option>
                <option value="oldest">最舊</option>
                <option value="price_asc">價格由低到高</option>
                <option value="price_desc">價格由高到低</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`grid gap-10 ${
          sidebarOpen ? "lg:grid-cols-[240px_1fr]" : "lg:grid-cols-1"
        }`}
      >
        <CategorySidebar categories={categories} selectedSlug={initialCategory} />

        <div>
          {visible.length === 0 ? (
            <p className="py-20 text-center text-gray-400">No products found.</p>
          ) : view === "grid" ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {visible.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={safePage === 0}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>

              {pageNumbers.map((p, idx) =>
                p === "ellipsis" ? (
                  <span key={`e-${idx}`} className="px-2 text-sm text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-medium transition-colors ${p === safePage ? "border-gray-900 bg-gray-900 text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`}
                  >
                    {p + 1}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={safePage === totalPages - 1}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
