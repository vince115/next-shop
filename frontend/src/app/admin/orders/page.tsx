// frontend/src/app/admin/orders/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getAllOrders } from "@/lib/orderApi";
import { Order } from "@/types/order";
import OrderTable from "@/components/admin/OrderTable";

const statusFilters: { value: "all" | Order["status"]; label: string }[] = [
  { value: "all", label: "全部狀態" },
  { value: "pending", label: "待付款" },
  { value: "paid", label: "已付款" },
  { value: "cancelled", label: "已取消" },
  { value: "failed", label: "失敗" },
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | Order["status"]>("all");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "無法載入訂單");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    fetchOrders();
  }, [authLoading, token, router, fetchOrders]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const handleViewOrder = (orderId: number) => {
    router.push(`/admin/orders/${orderId}`);
  };

  if (authLoading || (loading && !orders.length)) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-200 border-r-transparent" />
          <p className="mt-4 text-sm text-slate-500">訂單載入中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-lg font-semibold text-rose-700">無法載入訂單</p>
        <p className="mt-2 text-sm text-rose-600">{error}</p>
        <button
          type="button"
          className="mt-6 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          onClick={fetchOrders}
        >
          重新整理
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Orders</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">訂單管理</h1>
          <p className="text-slate-500">查看並管理所有訂單狀態。</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-slate-600" htmlFor="status-filter">
            狀態篩選
          </label>
          <select
            id="status-filter"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 focus:border-slate-900 focus:outline-none"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-200 border-r-transparent" />
            <p className="mt-4 text-sm text-slate-500">更新訂單中...</p>
          </div>
        </div>
      ) : (
        <OrderTable orders={filteredOrders} onView={handleViewOrder} />
      )}
    </div>
  );
}
