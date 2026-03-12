"use client";

import { Category } from "@/types/category";
import { useRouter } from "next/navigation";
import { useCategorySidebar } from "@/components/categories/CategorySidebarContext";

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
    overlay: "fixed inset-0 bg-black/40 lg:hidden",

    aside: `fixed top-0 left-0 z-40 h-full w-[240px] bg-white border-r border-gray-200
            transition-transform duration-200 lg:static`,

    asideOpen: "translate-x-0 lg:block",
    asideClosed: "-translate-x-full lg:hidden",

    container: "space-y-3 p-4 lg:p-0",

    title: "text-sm font-semibold text-gray-900",

    nav: "space-y-1",

    buttonBase:
      "w-full px-3 py-2 text-left text-sm transition",

    buttonActive:
      "bg-gray-500 text-white",

    buttonInactive:
      "text-gray-700 hover:bg-gray-100",
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
          <div className={styles.title}>分類</div>

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
              All
            </button>

            {/* categories */}
            {categories.map((c) => {
              const active = selectedSlug === c.slug;

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
                  {c.name}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}