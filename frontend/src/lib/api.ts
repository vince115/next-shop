import { Page, Product } from "@/types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function getProducts(page = 0, size = 20): Promise<Page<Product>> {
  const res = await fetch(
    `${API_URL}/api/products?page=${page}&size=${size}&sort=createdAt,desc`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
