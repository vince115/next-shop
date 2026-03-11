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
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loadCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateItem: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
}

function applyCart(cart: Cart): Pick<CartState, "cartId" | "items" | "totalItems" | "totalPrice"> {
  return {
    cartId: cart.id,
    items: cart.items,
    totalItems: cart.totalItems,
    totalPrice: cart.totalPrice,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      totalItems: 0,
      totalPrice: 0,

      loadCart: async () => {
        const { cartId } = get();
        if (cartId === null) {
          const cart = await createCart();
          set(applyCart(cart));
        } else {
          try {
            const cart = await getCart(cartId);
            set(applyCart(cart));
          } catch {
            const cart = await createCart();
            set(applyCart(cart));
          }
        }
      },

      addItem: async (productId, quantity = 1) => {
        let { cartId } = get();
        if (cartId === null) {
          const cart = await createCart();
          set(applyCart(cart));
          cartId = cart.id;
        }
        const cart = await addToCart(cartId!, productId, quantity);
        set(applyCart(cart));
      },

      updateItem: async (itemId, quantity) => {
        const { cartId } = get();
        if (!cartId) return;
        const cart = await updateCartItem(cartId, itemId, quantity);
        set(applyCart(cart));
      },

      removeItem: async (itemId) => {
        const { cartId } = get();
        if (!cartId) return;
        const cart = await removeCartItem(cartId, itemId);
        set(applyCart(cart));
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cartId: state.cartId }),
    }
  )
);
