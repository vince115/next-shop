import OrderDetail from "@/components/orders/OrderDetail";
import { getOrder } from "@/lib/orderApi";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <OrderDetail order={order} />
    </main>
  );
}
