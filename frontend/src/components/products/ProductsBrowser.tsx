"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, List, SlidersHorizontal } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

type SortOption = "recommended" | "price_asc" | "price_desc" | "created_desc" | "popularity_desc";

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
  initialQuery,
}: {
  products: Product[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [sort, setSort] = useState<SortOption>("recommended");
  const [view, setView] = useState<ViewMode>("grid");
  const [page, setPage] = useState(0);

  const pageSize = 20;

  const filteredSorted = useMemo(() => {
    const filtered = products.filter((p) => matchesQuery(p, query));

    const sorted = [...filtered];
    switch (sort) {
      case "price_asc":
        sorted.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price_desc":
        sorted.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "created_desc":
        sorted.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "popularity_desc":
        // placeholder: no popularity field yet
        break;
      case "recommended":
      default:
        // keep current order
        break;
    }

    return sorted;
  }, [products, query, sort]);

  const total = filteredSorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages - 1);

  const startIndex = safePage * pageSize;
  const endIndexExclusive = Math.min(startIndex + pageSize, total);
  const visible = filteredSorted.slice(startIndex, endIndexExclusive);

  const pageNumbers = getPageNumbers(safePage, totalPages);

  const rangeText = total === 0 ? "共 0 項" : `共 ${total} 項，第 ${startIndex + 1}-${endIndexExclusive} 項`;

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200">
        <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm font-medium text-gray-700">{rangeText}</div>

          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-end">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">顯示分類</span>
            </div>

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
                  setSort(e.target.value as SortOption);
                  setPage(0);
                }}
                className="h-11 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
              >
                <option value="recommended">優先推薦</option>
                <option value="price_asc">價格由低到高</option>
                <option value="price_desc">價格由高到低</option>
                <option value="created_desc">上架由新到舊</option>
                <option value="popularity_desc">人氣由高到低</option>
              </select>
            </div>
          </div>
        </div>
      </div>

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
        <div className="flex items-center justify-center gap-2">
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
  );
}
