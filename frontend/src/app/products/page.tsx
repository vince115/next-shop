//frontend/src/app/products/page.tsx
import { getProducts } from "@/lib/productApi";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Products — Next Shop",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(0, Number(pageParam ?? 0));
  const data = await getProducts(page);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex items-baseline justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500">{data.totalElements} items</p>
        </div>

        {data.content.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No products found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.content.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {data.totalPages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            {page > 0 && (
              <a
                href={`/products?page=${page - 1}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Previous
              </a>
            )}
            <span className="px-4 py-2 text-sm text-gray-500">
              Page {page + 1} of {data.totalPages}
            </span>
            {page + 1 < data.totalPages && (
              <a
                href={`/products?page=${page + 1}`}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
