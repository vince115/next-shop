"use client";

import { Category } from "@/types/category";
import { useRouter } from "next/navigation";
import { useCategorySidebar } from "@/components/categories/CategorySidebarContext";
import {
  Gamepad2,
  Grid2x2,
  Headphones,
  Laptop,
  Smartphone,
  Tag,
  type LucideIcon,
} from "lucide-react";

const categoryIcons: Record<string, LucideIcon> = {
  all: Grid2x2,
  accessories: Headphones,
  gaming: Gamepad2,
  laptop: Laptop,
  phone: Smartphone,
};

export default function CategorySidebar({
  categories,
  selectedSlug,
}: {
  categories: Category[];
  selectedSlug?: string;
}) {
  const router = useRouter();
  const { sidebarOpen, setSidebarOpen } = useCategorySidebar();

  const handleSelect = (slug?: string) => {
    if (slug) {
      router.push(`/products?category=${slug}`);
    } else {
      router.push(`/products`);
    }

    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  /* -----------------------------
   Styles
  ----------------------------- */

  const styles = {
    overlay: "fixed inset-0 bg-black/40 lg:hidden z-20",

    aside: `fixed top-0 left-0 z-20 h-full w-[240px] bg-white border-r border-gray-200
            transition-transform duration-200 lg:relative lg:z-10`,

    asideOpen: "translate-x-0 lg:block",
    asideClosed: "-translate-x-full lg:hidden",

    container: "space-y-4 p-4 lg:p-0",

    titleSection: "space-y-1 border-b border-gray-100 pl-4 pr-3 pt-4 pb-2",

    titleEyebrow: "text-[11px] uppercase tracking-[0.35em] text-gray-400",

    title: "text-sm font-semibold text-gray-900",

    nav: "space-y-1",

    buttonBase:
      "flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm transition",

    buttonActive:
      "bg-gray-100 text-gray-900 hover:bg-gray-100",

    buttonInactive:
      "text-gray-700 hover:bg-gray-50",
  };

  const getIcon = (slug?: string) => {
    if (!slug) return Grid2x2;
    return categoryIcons[slug] ?? Tag;
  };

  return (
    <>
      {/* overlay (mobile) */}
      {sidebarOpen && (
        <button
          type="button"
          className={styles.overlay}
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* sidebar */}
      <aside
        className={`${styles.aside} ${sidebarOpen ? styles.asideOpen : styles.asideClosed
          }`}
      >
        <div className={styles.container}>
          <div className={styles.titleSection}>
            <p className={styles.titleEyebrow}>CATEGORIES</p>
            <div className={styles.title}>分類</div>
          </div>

          <nav className={styles.nav}>
            {/* All */}
            <button
              type="button"
              onClick={() => handleSelect()}
              className={`${styles.buttonBase} ${!selectedSlug
                ? styles.buttonActive
                : styles.buttonInactive
                }`}
            >
              <Grid2x2 className={`h-4 w-4 ${!selectedSlug ? "text-gray-900" : "text-gray-500"}`} />
              <span>All</span>
            </button>

            {/* categories */}
            {categories.map((c) => {
              const active = selectedSlug === c.slug;
              const Icon = getIcon(c.slug);

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c.slug)}
                  className={`${styles.buttonBase} ${active
                    ? styles.buttonActive
                    : styles.buttonInactive
                    }`}
                >
                  <Icon className={`h-4 w-4 ${active ? "text-gray-900" : "text-gray-500"}`} />
                  <span>{c.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}