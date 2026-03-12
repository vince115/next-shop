//frontend/src/components/AddToCartIcon.tsx
"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartIcon({
    productId,
    disabled,
}: {
    productId: number;
    disabled?: boolean;
}) {
    const addItem = useCartStore((s) => s.addItem);
    const [loading, setLoading] = useState(false);

    async function handleAdd(
        e: React.MouseEvent<HTMLButtonElement>
    ) {
        e.preventDefault();
        e.stopPropagation();

        if (disabled) return;
        setLoading(true);

        try {
            await addItem(productId);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleAdd}
            disabled={disabled || loading}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
            <ShoppingCart
                size={18}
                className={loading ? "animate-pulse" : ""}
            />
        </button>
    );
}