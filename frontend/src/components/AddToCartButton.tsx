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
            className="rounded-xl bg-gray-900 px-6 py-3 text-white hover:bg-gray-800 disabled:opacity-50 transition"
        >
            {loading ? "Adding..." : "Add to cart"}
        </button>
    );
}