//frontend/src/store/cartStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Cart, CartItem } from "@/types/cart";
import {
  createCart,
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "@/lib/cartApi";

interface CartState {
  cartId: number | null;
  cartUuid: string | null; // ✅ Key for secure API interactions
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loadCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number, variantId?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

function applyCart(cart: Cart): Pick<CartState, "cartId" | "cartUuid" | "items" | "totalItems" | "totalPrice"> {
  return {
    cartId: cart.id,
    cartUuid: cart.uuid, // Using UUID from backend response
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      cartUuid: null,
      items: [],
      totalItems: 0,
      totalPrice: 0,

      /**
       * ✅ Secure UUID-Based Session Persistence.
       * Reuses irreversible UUIDs to protect against IDOR and sequence scanning.
       */
      loadCart: async () => {
        const { cartUuid } = get();
        if (cartUuid === null) {
          try {
            const cart = await createCart();
            set(applyCart(cart));
          } catch (err) {
            console.error("Failed to create secure cart session:", err);
          }
        } else {
          try {
            const cart = await getCart(cartUuid);
            set(applyCart(cart));
          } catch {
            const cart = await createCart();
            set(applyCart(cart));
          }
        }
      },

      /**
       * ✅ Multi-SKU Support with variantId (Risk 2 Fix).
       */
      addItem: async (productId, quantity = 1, variantId) => {
        let { cartUuid } = get();
        if (cartUuid === null) {
          const cart = await createCart();
          set(applyCart(cart));
          cartUuid = cart.uuid;
        }
        const cart = await addToCart(cartUuid!, productId, quantity, variantId);
        set(applyCart(cart));
      },

      updateItem: async (itemId, quantity) => {
        const { cartUuid } = get();
        if (!cartUuid) return;
        const cart = await updateCartItem(cartUuid, itemId, quantity);
        set(applyCart(cart));
      },

      removeItem: async (itemId) => {
        const { cartUuid } = get();
        if (!cartUuid) return;
        const cart = await removeCartItem(cartUuid, itemId);
        set(applyCart(cart));
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ 
        cartId: state.cartId,
        cartUuid: state.cartUuid 
      }),
    }
  )
);
