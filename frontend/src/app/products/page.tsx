//frontend/src/app/products/page.tsx
import { getProducts } from "@/lib/productApi";
import ProductsBrowser from "@/components/products/ProductsBrowser";

export const metadata = {
  title: "Products — Next Shop",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const data = await getProducts(0, 1000);

  return (
    <main className="min-h-screen bg-white/80">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mt-2 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          {/* <p className="text-sm text-gray-500">{data.totalElements} items</p> */}
        </div>

        <ProductsBrowser products={data.content} initialQuery={q} />
      </div>
    </main>
  );
}
