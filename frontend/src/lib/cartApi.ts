// frontend/src/lib/cartApi.ts
import { Cart } from "@/types/cart";
import { apiFetch } from "./api";

export function createCart(): Promise<Cart> {
  return apiFetch("/api/cart", { method: "POST" });
}

export function getCart(cartId: number): Promise<Cart> {
  return apiFetch(`/api/cart/${cartId}`);
}

export function addToCart(
  cartId: number,
  productId: number,
  quantity = 1
): Promise<Cart> {
  return apiFetch(`/api/cart/${cartId}/items`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function updateCartItem(
  cartId: number,
  itemId: number,
  quantity: number
): Promise<Cart> {
  return apiFetch(`/api/cart/${cartId}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(
  cartId: number,
  itemId: number
): Promise<Cart> {
  return apiFetch(`/api/cart/${cartId}/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearCart(cartId: number): Promise<void> {
  return apiFetch(`/api/cart/${cartId}`, { method: "DELETE" });
}