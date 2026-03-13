// frontend/src/lib/categoryApi.ts

import { apiFetch } from "./api";
import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    const data = await apiFetch<Category[]>("/api/categories");
    return data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
