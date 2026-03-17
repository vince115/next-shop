"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutGrid, List } from "lucide-react";
import type { SortOption, ViewMode } from "@/components/products/ProductsBrowser";

interface ProductsToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  sort: SortOption;
  onSortChange: (value: SortOption) => void;
  view: ViewMode;
  onViewChange: (value: ViewMode) => void;
  quickSortTabs: Array<{ label: string; value: SortOption }>;
  dropdownOptions: Array<{ label: string; value: SortOption }>;
}

export default function ProductsToolbar({
  query,
  onQueryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  quickSortTabs,
  dropdownOptions,
}: ProductsToolbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (evt: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(evt.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex w-full flex-wrap items-center gap-4 lg:gap-6">
      <div className="flex shrink-0 items-center gap-6 text-sm font-medium">
        {quickSortTabs.map((tab) => {
          const isActive = sort === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onSortChange(tab.value)}
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

      <div className="flex w-full max-w-sm flex-1">
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜尋商品名稱或描述…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
          <button
            type="button"
            onClick={() => onViewChange("grid")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              view === "grid" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={18} />
          </button>
          <button
            type="button"
            onClick={() => onViewChange("list")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
              view === "list" ? "bg-gray-900 text-white" : "text-gray-600 hover:bg-gray-50"
            }`}
            aria-label="List view"
          >
            <List size={18} />
          </button>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:border-gray-400"
          >
            排序
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-30 mt-2 w-44 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
              <ul className="py-1 text-sm text-gray-700">
                {dropdownOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onSortChange(option.value);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center justify-between px-3 py-2 text-left transition-colors ${
                        sort === option.value ? "bg-gray-100 text-gray-900" : "hover:bg-gray-50"
                      }`}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
