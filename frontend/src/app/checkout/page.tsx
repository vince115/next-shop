//frontend/src/app/checkout/page.tsx
"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { checkoutCart } from "@/lib/orderApi";

export default function CheckoutPage() {

  const { cartId, items, totalItems, totalPrice, loadCart } = useCartStore();

  async function checkout() {

    if (!cartId) {
      alert("Cart not ready");
      return;
    }

    try {
      const order = await checkoutCart(cartId);
      alert(`Order created #${order.id}`);
      await loadCart();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Checkout failed";
      alert(message);
    }
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-gray-400 text-lg">Nothing to check out.</p>

        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-700"
        >
          Browse products
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">

      <h1 className="mb-8 text-2xl font-bold text-gray-900">
        Checkout
      </h1>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">

        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">

              <span className="text-gray-700">
                {item.product?.name}
                <span className="text-gray-400"> × {item.quantity}</span>
              </span>

              <span className="font-medium text-gray-900">
                ${Number(item.subtotal).toFixed(2)}
              </span>

            </li>
          ))}
        </ul>

        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">

          <span className="font-semibold text-gray-900">Total</span>

          <span className="text-xl font-bold text-gray-900">
            ${Number(totalPrice).toFixed(2)}
          </span>

        </div>

      </div>

      <button
        onClick={checkout}
        className="mt-6 w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-700"
      >
        Place Order
      </button>
      <Link
        href="/cart"
        className="mt-3 block text-center text-sm text-gray-500 hover:text-gray-700"
      >
        ← Back to cart
      </Link>

    </main>
  );
}


