"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders } from "@/lib/orderApi";
import OrdersSection from "@/components/account/OrdersSection";
import { Order } from "@/types/order";

export default function AccountOrdersPage() {
  const { user, token, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getMyOrders(token);
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoading) {
      loadOrders();
    }
  }, [token, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-transparent" />
          <p className="mt-4 text-gray-600">訂單載入中...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">請先登入</h1>
        <p className="text-gray-600">登入後即可查看訂單</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-500">Orders</p>
        <h1 className="text-3xl font-bold text-gray-900">我的訂單</h1>
        <p className="mt-2 text-gray-600">檢視所有購買記錄與配送狀態。</p>
      </div>

      <OrdersSection orders={orders} />
    </div>
  );
}
