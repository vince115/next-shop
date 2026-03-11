//frontend/src/components/ProductGallery.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Props = {
    name: string;
    imageUrls?: string[] | null;
    fallbackImage?: string | null;
};

export default function ProductGallery({
    name,
    imageUrls,
    fallbackImage,
}: Props) {

    const images = useMemo(() => {
        const list = (imageUrls ?? []).filter(Boolean);

        if (list.length > 0) return list;

        if (fallbackImage) return [fallbackImage];

        return [];
    }, [imageUrls, fallbackImage]);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectedImage =
        images[selectedIndex] ??
        fallbackImage ??
        "/images/placeholder.png";

    return (
        <div className="space-y-5">

            {/* 主圖 */}
            <div className="flex justify-center rounded-2xl border border-gray-200 bg-white p-10">
                <Image
                    src={selectedImage}
                    alt={name}
                    width={560}
                    height={560}
                    className="h-auto max-h-[460px] w-auto object-contain"
                    priority
                />
            </div>

            {/* 縮圖列 */}
            <div className="flex gap-3">

                {Array.from({ length: 4 }).map((_, index) => {

                    const image = images[index];

                    if (!image) {
                        return (
                            <div
                                key={index}
                                className="flex h-[84px] w-[84px] items-center justify-center rounded-xl border border-dashed border-gray-300 text-xs text-gray-400"
                            >
                                image
                            </div>
                        );
                    }

                    const isActive = index === selectedIndex;

                    return (
                        <button
                            key={image}
                            onClick={() => setSelectedIndex(index)}
                            className={`overflow-hidden rounded-xl border bg-white p-1 transition ${isActive
                                ? "border-gray-900"
                                : "border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`${name} thumbnail ${index + 1}`}
                                width={84}
                                height={84}
                                className="h-[74px] w-[74px] object-contain"
                            />
                        </button>
                    );
                })}

            </div>

        </div>
    );
}