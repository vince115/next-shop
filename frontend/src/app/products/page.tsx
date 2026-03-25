//frontend/src/app/products/page.tsx
import { getCategories } from "@/lib/categoryApi";
import { getProducts } from "@/lib/productApi";
import ProductsPageShell from "@/components/products/ProductsPageShell";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export const metadata = {
  title: "Products — Next Shop",
};

// export default async function ProductsPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
// }) {
//   const { q, category, sort, page } = await searchParams;
//   const pageNum = parseInt(page ?? "0", 10);
//   const size = 20;

//   // ✅ Fail Fast: Let the API call throw if no products or backend error
//   const [categories, products] = await Promise.all([
//     getCategories(),
//     getProducts(pageNum, size, category, sort, q),
//   ]);

//   console.log("[DEBUG] ProductsPage fetched products count:", products.length);

//   return (
//     <ProductsPageShell
//       categories={categories}
//       products={products}
//       initialQuery={q}
//       initialCategory={category}
//       initialSort={sort}
//     />
//   );
// }

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const { q, category, sort, page } = await searchParams;
  const pageNum = parseInt(page ?? "0", 10);
  const size = 20;

  let categories: Category[] = [];
  let products: Product[] = [];

  try {
    [categories, products] = await Promise.all([
      getCategories(),
      getProducts(pageNum, size, category, sort, q),
    ]);
  } catch (error) {
    console.error("[ProductsPage] fetch failed:", error);
  }

  return (
    <ProductsPageShell
      categories={categories}
      products={products}
      initialQuery={q}
      initialCategory={category}
      initialSort={sort}
    />
  );
}