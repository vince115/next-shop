// frontend/src/components/admin/OrderTable.tsx
"use client";

import { Order } from "@/types/order";

const statusMap: Record<string, { label: string; classes: string }> = {
  pending: { label: "待付款", classes: "bg-amber-50 text-amber-700" },
  paid: { label: "已付款", classes: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "已取消", classes: "bg-slate-100 text-slate-600" },
  failed: { label: "失敗", classes: "bg-rose-50 text-rose-700" },
};

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

// ✅ 安全日期轉換（核心修正）
function formatDate(value?: string) {
  if (!value) return "-";

  try {
    // 修正 "2026-03-18 10:30:00" → ISO
    const iso = value.replace(" ", "T");
    const date = new Date(iso);

    if (isNaN(date.getTime())) return "-";

    return dateFormatter.format(date);
  } catch {
    return "-";
  }
}

interface OrderTableProps {
  orders: Order[];
  onView: (orderId: number) => void;
}

export default function OrderTable({ orders, onView }: OrderTableProps) {
  if (!orders?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-white/60 p-10 text-center">
        <p className="text-lg font-semibold text-slate-900">目前沒有訂單</p>
        <p className="mt-2 text-slate-500">當有新的訂單時會顯示於此。</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-150 text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3">Order ID</th>
              <th className="px-6 py-3">Items</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const rawStatus = order.status ?? "unknown";
              const normalizedStatus = rawStatus.toLowerCase();

              const status =
                statusMap[normalizedStatus] ?? {
                  label: rawStatus,
                  classes: "bg-slate-100 text-slate-500",
                };

              return (
                <tr
                  key={order.id}
                  className="border-b border-slate-100 transition hover:bg-slate-50 last:border-0"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    #{order.id}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {order.order_items?.length ?? 0}
                  </td>

                  <td className="px-6 py-4 text-slate-900">
                    {currencyFormatter.format(order.total ?? 0)}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.classes}`}
                    >
                      {status.label}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(order.created_at)}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      type="button"
                      className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
                      onClick={() => onView(order.id)}
                    >
                      查看
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}