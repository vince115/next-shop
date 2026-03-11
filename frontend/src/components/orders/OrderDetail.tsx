import Link from "next/link";
import { Order } from "@/types/order";

export default function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order #{order.id}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()} · {order.status}
          </p>
        </div>
        <Link href="/orders" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back to orders
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <ul className="divide-y divide-gray-100">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-3 text-sm">
              <span className="text-gray-700">
                {item.product.name}
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
            ${Number(order.totalPrice).toFixed(2)}
          </span>
        </div>

        <p className="mt-2 text-sm text-gray-500">{order.totalItems} item(s)</p>
      </div>
    </div>
  );
}
