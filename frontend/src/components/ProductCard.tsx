"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [loading, setLoading] = useState(false);

  async function handleAddToCart() {
    setLoading(true);
    try {
      await addItem(product.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h2 className="text-base font-semibold text-gray-900 leading-snug">
          {product.name}
        </h2>
        <span
          className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${
            product.stock > 0
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-500"
          }`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
      </div>

      {product.description && (
        <p className="text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-gray-900">
          ${Number(product.price).toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading}
          className="rounded-xl bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Adding…" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
