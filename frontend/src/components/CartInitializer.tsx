"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cartStore";

export default function CartInitializer() {
  const loadCart = useCartStore((s) => s.loadCart);
  useEffect(() => {
    loadCart();
  }, [loadCart]);
  return null;
}
