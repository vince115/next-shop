//frontend/src/components/products/ProductAccordion.tsx
"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export type ProductAccordionItem = {
  title: string;
  content: React.ReactNode;
};

export default function ProductAccordion({ items }: { items: ProductAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-12 border-t border-gray-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.title} className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between py-5 text-left transition hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition ${isOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>

            {isOpen && (
              <div className="pb-5 text-sm leading-relaxed text-gray-600">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
