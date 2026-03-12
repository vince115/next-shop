// frontend/src/lib/categoryApi.ts

import { apiFetch } from "./api";
import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  const data = await apiFetch<Category[]>("/api/categories");
  return data ?? [];
}
