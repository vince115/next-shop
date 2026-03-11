//frontend/src/lib/orderApi.ts

import { apiFetch } from "./api";
import { Order } from "@/types/order";

export async function checkoutCart(cartId: number): Promise<Order> {
    const order = await apiFetch<Order>(`/api/orders/checkout/${cartId}`, {
        method: "POST",
    });

    if (!order) {
        throw new Error("Checkout failed");
    }

    return order;
}