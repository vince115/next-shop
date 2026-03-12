//frontend/src/app/products/page.tsx
import { getCategories } from "@/lib/categoryApi";
import { getProducts } from "@/lib/productApi";
import ProductsBrowser from "@/components/products/ProductsBrowser";
import { CategorySidebarProvider } from "@/components/categories/CategorySidebarContext";

export const metadata = {
  title: "Products — Next Shop",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;

  const [categories, data] = await Promise.all([
    getCategories(),
    getProducts(0, 1000, category, sort),
  ]);

  return (
    <main className="min-h-screen bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mt-2 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {/* <p className="text-sm text-gray-500">{data.totalElements} items</p> */}
        </div>

        <CategorySidebarProvider>
          <ProductsBrowser
            products={data.content}
            categories={categories}
            initialQuery={q}
            initialCategory={category}
            initialSort={sort}
          />
        </CategorySidebarProvider>
      </div>
    </main>
  );
}
