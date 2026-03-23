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
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const { q, category, sort, page } = await searchParams;
  const pageNum = parseInt(page ?? "0", 10);
  const size = 20;

  const [categories, data] = await Promise.all([
    getCategories(),
    getProducts(pageNum, size, category, sort, q),
  ]);

  return (
    <ProductsPageShell
      categories={categories}
      productsPage={data}
      initialQuery={q}
      initialCategory={category}
      initialSort={sort}
    />
  );
}
