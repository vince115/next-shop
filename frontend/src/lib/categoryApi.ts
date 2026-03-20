// frontend/src/lib/categoryApi.ts

import { apiFetch } from "./api";
import { Category } from "@/types/category";

export interface CategoryPayload {
  name: string;
  slug: string;
  parentId: number | null;
}

export async function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>("/api/categories");
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  return apiFetch<Category>("/api/categories", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCategory(id: number, payload: CategoryPayload): Promise<Category> {
  return apiFetch<Category>(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCategory(id: number): Promise<void> {
  return apiFetch<void>(`/api/categories/${id}`, {
    method: "DELETE",
  });
}
