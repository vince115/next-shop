import OrderList from "@/components/orders/OrderList";
import { getOrders } from "@/lib/orderApi";

export const metadata = {
  title: "Orders — Next Shop",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500">{orders.length} order(s)</p>
      </div>

      <OrderList orders={orders} />
    </main>
  );
}
