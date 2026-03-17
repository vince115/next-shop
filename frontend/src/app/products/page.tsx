//frontend/src/app/products/page.tsx
import { getCategories } from "@/lib/categoryApi";
import { getProducts } from "@/lib/productApi";
import ProductsPageShell from "@/components/products/ProductsPageShell";

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
    <ProductsPageShell
      categories={categories}
      products={data.content}
      initialQuery={q}
      initialCategory={category}
      initialSort={sort}
    />
  );
}
