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
    size = 20
): Promise<Page<Product>> {

    const data = await apiFetch<Page<Product>>(
        `/api/products?page=${page}&size=${size}&sort=createdAt,desc`
    );

    return {
        ...data,
        content: data.content.map(normalizeProduct),
    };
}


export async function getProduct(
    id: string | number
): Promise<Product> {

    const product = await apiFetch<Product>(`/api/products/${id}`);

    return normalizeProduct(product);
}