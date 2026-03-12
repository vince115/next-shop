// frontend/src/lib/productApi.ts

import { Page, Product } from "@/types/product";
import { apiFetch } from "./api";

function normalizeProduct(product: Product): Product {
    return {
        ...product,
        imageUrls: product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [],
    };
}

export async function getProducts(
    page = 0,
    size = 20,
    categorySlug?: string,
    sort?: string
): Promise<Page<Product>> {

    const categoryQuery = categorySlug ? `&category=${encodeURIComponent(categorySlug)}` : "";
    const sortQuery = sort ? `&sort=${encodeURIComponent(sort)}` : "";
    const data = await apiFetch<Page<Product>>(
        `/api/products?page=${page}&size=${size}${sortQuery}${categoryQuery}`
    );

    if (!data) {
        return {
            content: [],
            totalElements: 0,
            totalPages: 0,
            number: page,
            size,
        };
    }

    return {
        ...data,
        content: data.content.map(normalizeProduct),
    };
}


export async function getProduct(
    id: string | number
): Promise<Product> {

    const product = await apiFetch<Product>(`/api/products/${id}`);

    if (!product) {
        throw new Error("Failed to load product");
    }

    return normalizeProduct(product);
}