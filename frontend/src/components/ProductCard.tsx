//frontend/src/components/ProductCard.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/cartStore";

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const [loading, setLoading] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const image = product.imageUrls?.[0] ?? "/images/placeholder.png";

  async function handleAddToCart(
    e: React.MouseEvent<HTMLButtonElement>
  ) {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    try {
      await addItem(product.id);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-2xl border-0 bg-white transition"
    >
      <div className="rounded-2xl bg-white p-5 mb-3 flex flex-col gap-3 border border-gray-200 hover:shadow-md">
        {/* 商品圖片 */}
        <div className="relative w-full h-40 flex items-center justify-center bg-gray-50 rounded-xl  overflow-hidden">
          <Image
            src={image}
            alt={product.name}
            width={400}
            height={400}
            className="max-h-full object-contain transition-transform duration-200 group-hover:scale-105"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setFavorite((v) => !v);
            }}
            className="absolute right-0 top-0 inline-flex h-9 w-9 items-center justify-center text-gray-700 transition"
            aria-label={favorite ? "Unfavorite" : "Favorite"}
          >
            <Heart
              size={18}
              className={favorite ? "fill-red-500 text-red-500" : "text-gray-700"}
            />
          </button>
        </div>

        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-900 leading-snug">
            {product.name}
          </h2>
          <span
            className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${product.stock > 0
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
          <div className="leading-tight">
            {product.originalPrice != null && Number(product.originalPrice) > Number(product.price) ? (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-gray-400 line-through">
                  NT$ {Number(product.originalPrice).toFixed(0)}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  NT$ {Number(product.price).toFixed(0)}
                </span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                NT$ {Number(product.price).toFixed(0)}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || loading}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={loading ? "Adding to cart" : "Add to cart"}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
}
