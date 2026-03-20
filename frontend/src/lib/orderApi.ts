// frontend/src/lib/orderApi.ts

import { apiFetch } from "./api";
import { Order } from "@/types/order";

// ✅ 取得全部訂單（admin 或測試用）
export async function getOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders");
}

// ✅ 取得單筆訂單
export async function getOrder(id: string | number): Promise<Order> {
  return apiFetch<Order>(`/api/orders/${id}`);
}

// ✅ checkout
export async function checkoutCart(cartId: number): Promise<Order> {
  return apiFetch<Order>(`/api/orders/checkout/${cartId}`, {
    method: "POST",
  });
}

// ✅ 取得自己的訂單（重點）
export async function getMyOrders(): Promise<Order[]> {
  return apiFetch<Order[]>("/api/orders/my");
}

/**
 * ✅ 向下相容（避免舊程式炸掉）
 * 如果你某些地方還在用 getAllOrders
 */
export const getAllOrders = getOrders;