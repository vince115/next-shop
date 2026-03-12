//frontend/src/types/product.ts
export interface ProductSummary {
  id: number;
  name: string;
  imageUrls?: string[] | null;
  price: number;
  originalPrice?: number | null;
}

export interface Product extends ProductSummary {
  description?: string | null;
  stock: number;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
