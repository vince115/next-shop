//frontend/src/lib/orderApi.ts

import { apiFetch } from "./api";
import { Order } from "@/types/order";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_URL}/api/orders`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Failed to load orders (${res.status})`);
    }
    return (await res.json()) as Order[];
}

export async function getOrder(id: string | number): Promise<Order> {
    const res = await fetch(`${API_URL}/api/orders/${id}`, { cache: "no-store" });
    if (!res.ok) {
        throw new Error(`Failed to load order ${id} (${res.status})`);
    }
    return (await res.json()) as Order;
}

export async function checkoutCart(cartId: number): Promise<Order> {
    const order = await apiFetch<Order>(`/api/orders/checkout/${cartId}`, {
        method: "POST",
    });

    if (!order) {
        throw new Error("Checkout failed");
    }

    return order;
}

export async function getMyOrders(token: string): Promise<Order[]> {
    const res = await fetch(`${API_URL}/api/orders/my`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to load my orders (${res.status})`);
    }

    return (await res.json()) as Order[];
}