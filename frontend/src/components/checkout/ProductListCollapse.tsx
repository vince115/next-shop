//frontend/src/components/checkout/ProductListCollapse.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { CartItem } from "@/types/cart";

function formatCurrency(value: number) {
  return `NT$${value.toLocaleString("zh-TW", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

interface ProductListCollapseProps {
  items: CartItem[];
}

export default function ProductListCollapse({ items }: ProductListCollapseProps) {
  const [open, setOpen] = useState(false);

  if (items.length === 0) return null;

  return (
    <div className="border-t border-gray-100 pt-4">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100"
      >
        查看商品清單
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : "rotate-0"}`} />
      </button>

      {open && (
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 text-sm">
              <Image
                src={item.product?.imageUrl || "/images/placeholder.png"}
                alt={item.product?.name || "商品"}
                width={48}
                height={48}
                className="h-12 w-12 rounded-xl border border-gray-100 object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900 line-clamp-1">{item.product?.name}</p>
                <p className="text-xs text-gray-500">x {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{formatCurrency(Number(item.subtotal) || 0)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
