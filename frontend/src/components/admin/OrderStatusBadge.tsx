// frontend/src/components/admin/OrderStatusBadge.tsx

import { Order } from "@/types/order";

const STATUS_META: Record<Order["status"], { label: string; classes: string }> = {
  pending: { label: "待付款", classes: "bg-amber-50 text-amber-700" },
  paid: { label: "已付款", classes: "bg-emerald-50 text-emerald-700" },
  cancelled: { label: "已取消", classes: "bg-slate-100 text-slate-600" },
  failed: { label: "失敗", classes: "bg-rose-50 text-rose-700" },
};

export function getOrderStatusMeta(status: Order["status"]) {
  return STATUS_META[status];
}

export default function OrderStatusBadge({ status }: { status: Order["status"] }) {
  const meta = STATUS_META[status];
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${meta.classes}`}>
      {meta.label}
    </span>
  );
}
