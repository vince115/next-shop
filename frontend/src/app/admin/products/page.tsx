// frontend/src/app/admin/products/page.tsx

import AdminProductsPageShell from "@/components/admin/AdminProductsPageShell";
import { getProducts } from "@/lib/productApi";

export const metadata = {
  title: "Admin Products — Next Shop",
};

export default async function AdminProductsPage() {
  // Fetch all products for administration
  // Using a large size for now as per simple implementation
  const data = await getProducts(0, 1000);

  return <AdminProductsPageShell products={data.content} />;
}
