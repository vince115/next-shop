"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

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

interface ProductsBrowserProps {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: string;
  isSidebarOpen?: boolean;
}

export default function ProductsBrowser({
  products,
  categories,
  initialQuery,
  initialCategory,
  initialSort,
  isSidebarOpen = true,
}: ProductsBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<SortOption>(mapInitialSort(initialSort));
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

  function replaceUrl(next: { q?: string; sort?: SortOption }) {
    const params = new URLSearchParams(searchParams?.toString());

    if (next.q) params.set("q", next.q);
    else params.delete("q");

    if (next.sort && next.sort !== "default") params.set("sort", next.sort);
    else params.delete("sort");

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);

  useEffect(() => {
    setSort(mapInitialSort(initialSort));
  }, [initialSort]);

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
      <header className="bg-white/80 p-5 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-500">Products</p>
          <h2 className="text-3xl font-bold text-gray-900">嚴選商品</h2>
          <p className="mt-1 text-sm text-gray-600">{rangeText}</p>
        </div>

        <div className="flex w-full flex-wrap items-center gap-4">
          <div className="flex shrink-0 items-center gap-6 text-sm font-medium">
            {quickSortTabs.map((tab) => {
              const isActive = sort === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    setPage(0);
                    setSort(tab.value);
                    replaceUrl({ q: query || undefined, sort: tab.value });
                  }}
                  className={`pb-1 transition-colors ${
                    isActive
                      ? "text-gray-900 border-b-2 border-gray-900"
                      : "text-gray-500 hover:text-gray-900"
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
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="搜尋商品名稱或描述…"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3">
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

            <label className="flex shrink-0 items-center gap-2 text-sm font-medium text-gray-700">
              <select
                value={sort}
                onChange={(e) => {
                  const next = e.target.value as SortOption;
                  setPage(0);
                  setSort(next);
                  replaceUrl({ q: query || undefined, sort: next });
                }}
                className="rounded-md border border-gray-200 bg-white py-3 px-1 text-sm text-gray-700 focus:border-gray-400 focus:outline-none"
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
  );
}
