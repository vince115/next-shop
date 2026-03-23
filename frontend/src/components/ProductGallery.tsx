//frontend/src/components/ProductGallery.tsx
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  name: string;
  imageUrls?: string[] | null;
}

export default function ProductGallery({
  name,
  imageUrls,
}: ProductGalleryProps) {
  const images = useMemo(() => {
    return (imageUrls ?? []).filter(Boolean);
  }, [imageUrls]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex] ?? "/images/placeholder.png";

  return (
    <div className="flex flex-col gap-6">
      {/* Large Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center p-12 transition-all">
        {images.length > 0 ? (
          <Image
            src={selectedImage}
            alt={name}
            width={700}
            height={700}
            className="h-full w-full object-contain mix-blend-multiply transition-all duration-500 ease-out"
            priority
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-300">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
            <span className="mt-4 text-[10px] font-bold uppercase tracking-[0.3em]">
              No Visuals Available
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-4">
          {images.map((image, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                key={image + index}
                onClick={() => setSelectedIndex(index)}
                className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                  isActive
                    ? "border-black scale-105 shadow-sm"
                    : "border-transparent bg-gray-50 hover:border-gray-300 grayscale-[0.5] hover:grayscale-0"
                }`}
              >
                <Image
                  src={image}
                  alt={`${name} thumbnail ${index + 1}`}
                  fill
                  className="object-cover p-1.5 mix-blend-multiply"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}