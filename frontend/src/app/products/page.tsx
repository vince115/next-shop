//frontend/src/app/products/page.tsx
import { getCategories } from "@/lib/categoryApi";
import { getProducts } from "@/lib/productApi";
import ProductsBrowser from "@/components/products/ProductsBrowser";

export const metadata = {
  title: "Products — Next Shop",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const { q, category, sort } = await searchParams;

  const [fetchedCategories, data] = await Promise.all([
    getCategories(),
    getProducts(0, 1000, category, sort),
  ]);

  const categories =
    fetchedCategories.length > 0
      ? fetchedCategories
      : [
        { id: 1, name: "Laptop", slug: "laptop" },
        { id: 2, name: "Phone", slug: "phone" },
        { id: 3, name: "Gaming", slug: "gaming" },
        { id: 4, name: "Accessories", slug: "accessories" },
      ];

  return (
    <main className="min-h-screen bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mt-2 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {/* <p className="text-sm text-gray-500">{data.totalElements} items</p> */}
        </div>

        <ProductsBrowser
          products={data.content}
          categories={categories}
          initialQuery={q}
          initialCategory={category}
          initialSort={sort}
        />
      </div>
    </main>
  );
}
