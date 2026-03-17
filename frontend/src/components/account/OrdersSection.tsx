"use client";
import Link from "next/link";
import { Order } from "@/types/order";

interface OrdersSectionProps {
  orders: Order[];
}

export default function OrdersSection({ orders }: OrdersSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">我的訂單</h2>
      
      {orders.length === 0 ? (
        <p className="text-gray-500">您還沒有任何訂單</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order #{order.id}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    NT$ {Number(order.totalPrice).toFixed(0)}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "PENDING"
                        ? "bg-yellow-50 text-yellow-700"
                        : order.status === "PAID"
                        ? "bg-blue-50 text-blue-700"
                        : order.status === "SHIPPED"
                        ? "bg-green-50 text-green-700"
                        : order.status === "CANCELLED"
                        ? "bg-red-50 text-red-700"
                        : "bg-gray-50 text-gray-700"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <p>{order.totalItems} item{order.totalItems !== 1 ? "s" : ""}</p>
                <p>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
