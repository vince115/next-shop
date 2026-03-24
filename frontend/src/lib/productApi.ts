// frontend/src/lib/productApi.ts

import { Product } from "@/types/product";
import { apiFetch } from "./api";

function normalizeProduct(product: Product): Product {
    return {
        ...product,
        imageUrls: product.imageUrls && Array.isArray(product.imageUrls) ? product.imageUrls : [],
    };
}

/**
 * STRICT contract: Expects Spring Boot Page structure { content: Product[] }
 * Returns ONLY the product array. Throws on invalid shapes.
 */
export async function getProducts(
    page = 0,
    size = 20,
    categorySlug?: string,
    sort?: string,
    query?: string
): Promise<Product[]> {

    const categoryParam = categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : "";
    const sortParam = sort ? `&sort=${encodeURIComponent(sort)}` : "";
    const queryParam = query ? `&q=${encodeURIComponent(query)}` : "";
    
    // Fetch directly from API
    const data = await apiFetch<any>(
        `/api/products?page=${page}&size=${size}${sortParam}${categoryParam}${queryParam}`
    );

    console.log("[DEBUG] getProducts raw data received:", data);

    // ✅ Strict check ONLY for .content (Standard Spring Boot Paging)
    if (!data || !Array.isArray(data.content)) {
        console.error("[CRITICAL] API response missing products array (.content):", data);
        throw new Error("Invalid API response: Products content is missing or not an array");
    }

    const products: Product[] = data.content;
    
    // Validate each item (optional but recommended for strictness)
    if (products.length > 0 && (!products[0].id || !products[0].name)) {
        console.error("[CRITICAL] Invalid product shape detected on first item:", products[0]);
        throw new Error("Invalid API response: Product data shape mismatch");
    }

    return products.map(normalizeProduct);
}


export async function getProduct(
    id: string | number
): Promise<Product> {
    const product = await apiFetch<Product>(`/api/products/${id}`);
    
    if (!product || !product.id) {
      throw new Error(`Product not found with id: ${id}`);
    }

    return normalizeProduct(product);
}