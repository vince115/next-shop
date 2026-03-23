// frontend/src/components/AddToCartButton.tsx

"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartButton({
    productId,
    quantity = 1,
}: {
    productId: number;
    quantity?: number;
}) {

    const addItem = useCartStore((s) => s.addItem);

    const [loading, setLoading] = useState(false);

    async function handleAdd() {

        setLoading(true);

        try {
            await addItem(productId, quantity);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleAdd}
            disabled={loading}
            className="w-full rounded-2xl bg-gray-900 py-4 text-base font-bold text-white hover:bg-gray-800 disabled:opacity-50 transition-all active:scale-[0.98] shadow-lg shadow-gray-900/10 flex items-center justify-center gap-2"
        >
            {loading ? (
                <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    處理中...
                </>
            ) : (
                "加入購物車"
            )}
        </button>
    );
}