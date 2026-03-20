// frontend/src/app/admin/orders/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getOrderById } from "@/lib/orderApi";
import { Order } from "@/types/order";
import OrderStatusBadge from "@/components/admin/OrderStatusBadge";

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  minimumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function AdminOrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!token) {
      router.replace("/login");
      return;
    }

    let aborted = false;
    async function loadOrder() {
      try {
        setLoading(true);
        setError(null);
        const data = await getOrderById(params.id);
        if (!aborted) {
          setOrder(data);
        }
      } catch (err) {
        if (!aborted) {
          setError(err instanceof Error ? err.message : "無法載入訂單");
        }
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    }

    loadOrder();
    return () => {
      aborted = true;
    };
  }, [authLoading, token, router, params.id]);

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-slate-200 border-r-transparent" />
          <p className="mt-4 text-sm text-slate-500">訂單載入中...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
        <p className="text-lg font-semibold text-rose-700">無法載入訂單</p>
        <p className="mt-2 text-sm text-rose-600">{error ?? "找不到此訂單"}</p>
        <button
          type="button"
          className="mt-6 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          onClick={() => router.push("/admin/orders")}
        >
          返回列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        className="text-sm font-medium text-slate-600 hover:text-slate-900"
        onClick={() => router.back()}
      >
        ← 返回訂單列表
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Order</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">訂單 #{order.id}</h1>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <dl className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">建立時間</dt>
            <dd className="mt-1 text-lg text-slate-900">{dateFormatter.format(new Date(order.created_at))}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-slate-500">訂單金額</dt>
            <dd className="mt-1 text-lg font-semibold text-slate-900">{currencyFormatter.format(order.total)}</dd>
          </div>
        </dl>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">商品項目</h2>
          <p className="text-sm text-slate-500">共 {order.order_items.length} 件商品</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-150 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">商品</th>
                <th className="px-6 py-3">單價</th>
                <th className="px-6 py-3">數量</th>
                <th className="px-6 py-3">小計</th>
              </tr>
            </thead>
            <tbody>
              {order.order_items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-4 font-medium text-slate-900">{item.name_snapshot}</td>
                  <td className="px-6 py-4 text-slate-600">{currencyFormatter.format(item.unit_price)}</td>
                  <td className="px-6 py-4 text-slate-600">{item.quantity}</td>
                  <td className="px-6 py-4 text-slate-900">{currencyFormatter.format(item.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
