//frontend/src/components/checkout/OrderSummary.tsx
"use client";

import ProductListCollapse from "./ProductListCollapse";
import { CartItem } from "@/types/cart";

function formatCurrency(value: number) {
  return `NT$${value.toLocaleString("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost?: number | null;
  total: number;
  shippingSelected: boolean;
  onCheckout: () => void;
  disabled: boolean;
}

export default function OrderSummary({
  items,
  subtotal,
  shippingCost,
  total,
  shippingSelected,
  onCheckout,
  disabled,
}: OrderSummaryProps) {
  return (
    <div className="space-y-5 rounded-2xl border border-gray-200 bg-white/90 p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-gray-500">小計明細</p>
        <h2 className="text-2xl font-semibold text-gray-900">訂單摘要</h2>
      </div>

      <div className="space-y-3 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span>商品金額</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>運費</span>
          <span className={shippingSelected ? "text-gray-900" : "text-gray-400"}>
            {shippingSelected
              ? shippingCost && shippingCost > 0
                ? formatCurrency(shippingCost)
                : "免運"
              : "尚未選擇運送方式"}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between text-xl font-semibold text-rose-600">
          <span>應付總額</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">以 TWD 結帳，價格已含稅</p>
      </div>

      <button
        type="button"
        onClick={onCheckout}
        disabled={disabled}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-gray-900 py-4 text-base font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        前往結帳
      </button>

      <p className="text-center text-xs text-gray-500">
        支援信用卡、LINE Pay、Apple Pay
      </p>

      <ProductListCollapse items={items} />
    </div>
  );
}
