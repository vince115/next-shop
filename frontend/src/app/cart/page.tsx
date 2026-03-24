//frontend/src/app/cart/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Loader2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { items, totalItems, totalPrice, updateItem, removeItem, cartUuid } = useCartStore();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    if (!cartUuid || items.length === 0) return;

    try {
      setCheckoutLoading(true);
      
      /**
       * ✅ Secure Checkout Initiation. 
       * Uses public cartUuid to identify the session, preventing IDOR during the order intake phase.
       */
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          cartUuid: cartUuid // Passed in JSON body as per backend security refactor
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create order from cart");
      }

      const orderData = await response.json();
      const orderId = orderData.id;

      // Redirect to checkout with the specific immutable order record generated from snapshot
      router.push(`/checkout?orderId=${orderId}`);
    } catch (err) {
      console.error("[CHECKOUT INITIATION ERROR]", err);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setCheckoutLoading(false);
    }
  };

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

          <button
            onClick={handleCheckout}
            disabled={checkoutLoading}
            className="flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-3.5 text-sm font-bold text-white uppercase tracking-widest hover:bg-gray-800 transition-all disabled:opacity-40 active:scale-[0.98]"
          >
            {checkoutLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Checkout Now</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}