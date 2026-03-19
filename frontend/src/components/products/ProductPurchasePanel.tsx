//frontend/src/components/products/ProductPurchasePanel.tsx
"use client";

import { useMemo, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import { Heart } from "lucide-react";

interface ProductPurchasePanelProps {
  productId: number;
  name: string;
  price: number;
  stock: number;
  description?: string | null;
}

const colorOptions = ["極夜黑", "星耀白", "霧銀灰"];

export default function ProductPurchasePanel({
  productId,
  name,
  price,
  stock,
  description,
}: ProductPurchasePanelProps) {
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [quantity, setQuantity] = useState(1);

  const formattedPrice = useMemo(
    () => new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD" }).format(price),
    [price]
  );
  const formattedOriginalPrice = useMemo(() => {
    const base = description ? price * 1.15 : price * 1.08;
    const original = Math.max(price, Math.round(base / 10) * 10);
    return new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD" }).format(original);
  }, [price, description]);

  const soldCount = useMemo(() => Math.max(3, Math.round((price / 1000) * 4)), [price]);

  const handleIncrease = () => {
    setQuantity((prev) => (stock ? Math.min(prev + 1, stock) : prev + 1));
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  return (
    <section className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">NextShop 精選</p>
            <h1 className="mt-1 text-3xl font-semibold text-gray-900 lg:text-4xl">{name}</h1>
          </div>
          <button
            type="button"
            className="ml-auto rounded-full border border-gray-200 p-2 text-gray-500 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            aria-label="加入收藏"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-red-500">{formattedPrice}</span>
            <span className="text-lg text-gray-400 line-through">{formattedOriginalPrice}</span>
          </div>
          <span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-600">
            本週限時優惠
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <p>{stock > 0 ? `尚有 ${stock} 件` : "目前缺貨"}</p>
          <span className="h-1 w-1 rounded-full bg-gray-300" aria-hidden />
          <p>已售出：{soldCount} 件</p>
        </div>
      </div>

      {description && (
        <p className="text-base leading-relaxed text-gray-600">
          {description}
        </p>
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">顏色選擇</p>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => {
            const active = selectedColor === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setSelectedColor(option)}
                className={`rounded-xl border px-4 py-2 text-sm transition ${
                  active
                    ? "border-gray-900 bg-gray-100 text-gray-900 shadow-sm"
                    : "border-gray-300 text-gray-800 hover:border-gray-500"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-gray-700">數量</p>
        <div className="inline-flex items-center rounded-xl border border-gray-300">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="px-4 py-2 text-lg text-gray-500 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-12 text-center text-base font-medium text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={stock > 0 && quantity >= stock}
            className="px-4 py-2 text-lg text-gray-500 transition hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <AddToCartButton
          productId={productId}
          quantity={quantity}
          variant="outline"
          fullWidth
          label="加入購物車"
        />
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          立即結帳
        </button>
      </div>

      <div className="space-y-3 rounded-2xl border border-gray-200 bg-white p-5">
        <p className="text-sm font-medium text-gray-900">目前選擇</p>
        <dl className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <dt>顏色</dt>
            <dd className="font-medium text-gray-900">{selectedColor}</dd>
          </div>
          <div className="flex justify-between">
            <dt>數量</dt>
            <dd className="font-medium text-gray-900">{quantity}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
