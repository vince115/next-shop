// frontend/src/lib/cartApi.ts
import { Cart } from "@/types/cart";
import { apiFetch } from "./api";

/**
 * ✅ Security Fix: Secure UUID-based Cart API.
 * Identifies sessions using non-sequential UUIDs to prevent IDOR (Risk 3).
 */
export function createCart(): Promise<Cart> {
  return apiFetch("/api/cart", { method: "POST" });
}

export function getCart(cartUuid: string): Promise<Cart> {
  return apiFetch(`/api/cart/${cartUuid}`);
}

/**
 * ✅ Production SKU Support (Risk 2 Fix).
 */
export function addToCart(
  cartUuid: string,
  productId: number,
  quantity = 1,
  variantId?: number
): Promise<Cart> {
  return apiFetch(`/api/cart/${cartUuid}/items`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity, variantId }),
  });
}

export function updateCartItem(
  cartUuid: string,
  itemId: number,
  quantity: number
): Promise<Cart> {
  return apiFetch(`/api/cart/${cartUuid}/items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(
  cartUuid: string,
  itemId: number
): Promise<Cart> {
  return apiFetch(`/api/cart/${cartUuid}/items/${itemId}`, {
    method: "DELETE",
  });
}

export function clearCart(cartUuid: string): Promise<void> {
  return apiFetch(`/api/cart/${cartUuid}`, { method: "DELETE" });
}