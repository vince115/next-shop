//frontend/src/types/product.ts
export interface ProductCategory {
  id: number;
  name: string;
}

export interface ProductSummary {
  id: number;
  name: string;
  imageUrls: string[];
  price: number;
  originalPrice?: number | null;
}

export interface Product extends ProductSummary {
  description?: string | null;
  stock: number;
  category: ProductCategory;
  createdAt: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
