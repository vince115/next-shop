//frontend/src/components/ProductPurchaseActions.tsx
"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

interface Props {
  productId: number;
  stock: number;
}

export default function ProductPurchaseActions({ productId, stock }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const increment = () => setQuantity((q) => Math.min(q + 1, stock));
  const decrement = () => setQuantity((q) => Math.max(q - 1, 1));

  async function handleAddToCart() {
    if (stock === 0) return;
    setLoading(true);
    try {
      await addItem(productId, quantity);
    } finally {
      setLoading(false);
    }
  }

  const isOutOfStock = stock === 0;

  return (
    <div className="flex flex-col gap-8">
      {/* Quantity Selector */}
      {!isOutOfStock && (
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">
            Quantity
          </span>
          <div className="inline-flex h-12 w-32 items-center justify-between rounded-xl border-2 border-gray-100 bg-white px-2 shadow-sm transition-all hover:border-gray-200">
            <button
              onClick={decrement}
              disabled={quantity === 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-black disabled:opacity-20"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-center text-sm font-black tabular-nums">
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={quantity >= stock}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-50 hover:text-black disabled:opacity-20"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={handleAddToCart}
          disabled={loading || isOutOfStock}
          className="group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl bg-black py-4 text-sm font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-40"
        >
          {loading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              <ShoppingCart size={18} className="transition-transform group-hover:-translate-y-px" />
              {isOutOfStock ? "SOLD OUT" : "ADD TO CART"}
            </>
          )}
        </button>

        <button
          disabled={isOutOfStock}
          className="group flex flex-1 items-center justify-center gap-2 rounded-2xl border-2 border-black bg-white py-4 text-sm font-bold text-black transition-all hover:bg-black hover:text-white disabled:opacity-40"
        >
          <span>BUY IT NOW</span>
          <ArrowRight size={18} className="translate-x-0 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
