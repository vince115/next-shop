//frontend/src/app/cart/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

export default function CartPage() {
  const { items, totalItems, totalPrice, updateItem, removeItem } =
    useCartStore();

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-400 text-lg">Your cart is empty.</p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 ">
      <h1 className="mb-8 text-2xl font-bold text-gray-900">Your Cart</h1>

      {/* Cart Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full table-fixed text-sm">
          <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
            <tr>
              <th className="w-[50%] px-5 py-3">Product</th>
              <th className="w-[15%] px-5 py-3 text-right">Price</th>
              <th className="w-[20%] px-5 py-3 text-center">Quantity</th>
              <th className="w-[15%] px-5 py-3 text-right">Subtotal</th>
              <th className="w-[60px]" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr
                key={item.id}
                className="align-middle hover:bg-gray-50 transition"
              >
                {/* Product */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-4">
                    <Image
                      src={
                        item.product?.imageUrl || "/images/placeholder.png"
                      }
                      alt={item.product?.name || "Product"}
                      width={56}
                      height={56}
                      className="rounded-lg border object-cover"
                    />

                    <div>
                      <p className="font-medium text-gray-900">
                        {item.product?.name}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="px-5 py-4 text-right text-gray-600">
                  ${Number(item.product?.price).toFixed(2)}
                </td>

                {/* Quantity */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 border rounded-lg px-2 py-1">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeItem(item.id);
                          } else {
                            updateItem(item.id, item.quantity - 1);
                          }
                        }}
                        className="text-gray-600 hover:text-black"
                      >
                        −
                      </button>

                      <span className="w-6 text-center font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateItem(item.id, item.quantity + 1)
                        }
                        className="text-gray-600 hover:text-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </td>

                {/* Subtotal */}
                <td className="px-5 py-4 text-right font-semibold text-gray-900">
                  ${Number(item.subtotal).toFixed(2)}
                </td>

                {/* Remove */}
                <td className="px-5 py-4 text-right">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cart Footer */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {totalItems} item{totalItems !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-500">Order total</p>

            <p className="text-3xl font-bold text-gray-900">
              ${Number(totalPrice).toFixed(2)}
            </p>
          </div>

          <Link
            href="/checkout"
            className="rounded-xl bg-gray-900 px-8 py-3 text-sm font-medium text-white hover:bg-gray-700 transition-colors"
          >
            Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}