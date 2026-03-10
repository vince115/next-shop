import { Cart } from "@/types/cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`Cart API error: ${res.status}`);
  if (res.status === 204) return undefined as T;
  return res.json();
}

export function createCart(): Promise<Cart> {
  return request("/api/cart", { method: "POST" });
}

export function getCart(cartId: number): Promise<Cart> {
  return request(`/api/cart/${cartId}`);
}

export function addToCart(cartId: number, productId: number, quantity = 1): Promise<Cart> {
  return request(`/api/cart/${cartId}/items`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(cartId: number, itemId: number, quantity: number): Promise<Cart> {
  return request(`/api/cart/${cartId}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(cartId: number, itemId: number): Promise<Cart> {
  return request(`/api/cart/${cartId}/items/${itemId}`, { method: "DELETE" });
}

export function clearCart(cartId: number): Promise<void> {
  return request(`/api/cart/${cartId}`, { method: "DELETE" });
}
