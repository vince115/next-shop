//frontend/src/components/ProductPurchaseActions.tsx
"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
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
    <div className="flex flex-col gap-8 w-full min-w-0">
      {/* Quantity Selector - Shopify Style */}
      {!isOutOfStock && (
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            Quantity
          </span>
          <div className="inline-flex h-12 w-full max-w-[140px] items-center justify-between rounded-xl border-2 border-slate-100 bg-white px-1 shadow-sm transition-all focus-within:ring-2 focus-within:ring-slate-900 focus-within:border-slate-300">
            <button
              onClick={decrement}
              disabled={quantity === 1}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-black disabled:opacity-20"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center text-sm font-black tabular-nums text-slate-900 border-none outline-none">
              {quantity}
            </span>
            <button
              onClick={increment}
              disabled={quantity >= stock}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-50 hover:text-black disabled:opacity-20"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons - Flexible Layout */}
      <div className="flex flex-col gap-4 sm:flex-row w-full min-w-0">
        {/* ADD TO CART - Primary Visual Hierarchy */}
        <button
          onClick={handleAddToCart}
          disabled={loading || isOutOfStock}
          className="group relative flex w-full sm:flex-[1.2] items-center justify-center gap-3 overflow-hidden rounded-xl bg-slate-900 py-4 px-6 text-sm font-bold uppercase tracking-[0.1em] text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-slate-800 disabled:opacity-40 active:scale-[0.98] outline-none"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
              <span>Updating...</span>
            </div>
          ) : (
            <>
              <ShoppingCart size={18} className="transition-transform group-hover:-translate-y-px" />
              <span className="truncate">{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </>
          )}
        </button>

        {/* BUY IT NOW - Secondary Visual Hierarchy */}
        <button
          disabled={isOutOfStock}
          className="flex w-full sm:flex-1 items-center justify-center rounded-xl border-2 border-slate-900 bg-white py-4 px-6 text-sm font-bold uppercase tracking-[0.1em] text-slate-900 transition-all hover:bg-slate-900 hover:text-white disabled:opacity-40 active:scale-[0.98] outline-none"
        >
          <span className="truncate">Buy it now</span>
        </button>
      </div>

      {/* Safety Info */}
      <p className="text-[10px] text-center sm:text-left text-slate-400 font-medium">
        Secure checkout powered by NextShop
      </p>
    </div>
  );
}
