import Link from "next/link";
import { Order } from "@/types/order";

export default function OrderList({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="py-20 text-center text-gray-400">No orders yet.</p>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full table-fixed text-sm">
        <thead className="border-b border-gray-100 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="w-[18%] px-5 py-3">Order</th>
            <th className="w-[22%] px-5 py-3">Date</th>
            <th className="w-[18%] px-5 py-3">Status</th>
            <th className="w-[22%] px-5 py-3 text-right">Total</th>
            <th className="w-[20%] px-5 py-3 text-right">Items</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((o) => (
            <tr key={o.id} className="align-middle hover:bg-gray-50 transition">
              <td className="px-5 py-4 font-medium text-gray-900">
                <Link className="hover:underline" href={`/orders/${o.id}`}>
                  #{o.id}
                </Link>
              </td>
              <td className="px-5 py-4 text-gray-600">
                {new Date(o.createdAt).toLocaleString()}
              </td>
              <td className="px-5 py-4 text-gray-700">{o.status}</td>
              <td className="px-5 py-4 text-right font-semibold text-gray-900">
                ${Number(o.totalPrice).toFixed(2)}
              </td>
              <td className="px-5 py-4 text-right text-gray-600">
                {o.totalItems}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
