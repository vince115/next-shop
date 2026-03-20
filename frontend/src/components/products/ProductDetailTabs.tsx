//frontend/src/components/products/ProductDetailTabs.tsx
"use client";

import { useState } from "react";

interface ProductDetailTabsProps {
  description?: string | null;
}

const relatedMock = [
  { title: "極簡木質邊桌", price: "NT$2,480" },
  { title: "柔霧香氛機", price: "NT$1,280" },
  { title: "雲感毛毯", price: "NT$1,080" },
];

export default function ProductDetailTabs({ description }: ProductDetailTabsProps) {
  const [tab, setTab] = useState<"detail" | "related">("detail");

  return (
    <section className="mt-16">
      <div className="flex gap-8 border-b border-gray-200 text-sm font-medium text-gray-500">
        {[
          { id: "detail", label: "詳細說明" },
          { id: "related", label: "相關推薦" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id as "detail" | "related")}
            className={`pb-3 transition ${
              tab === item.id
                ? "border-b-2 border-gray-900 text-gray-900"
                : "hover:text-gray-900"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "detail" ? (
        <article className="space-y-6 pt-8 text-gray-700">
          <p className="leading-relaxed">
            {description ||
              "此商品採用霧面質感機身與靜音風道設計，適合擺放於客廳、書房或臥室。搭載智慧偵測功能，可依室內狀態自動調整輸出功率，維持空氣清新。"}
          </p>
          <ul className="list-disc space-y-2 pl-6 text-sm">
            <li>智慧光感調節，夜間自動降低亮度</li>
            <li>可拆式濾網模組，清潔與更換更直覺</li>
            <li>支援 App 遠端控制與排程設定</li>
          </ul>
        </article>
      ) : (
        <div className="grid gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3">
          {relatedMock.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="h-32 rounded-xl bg-gray-100" />
              <p className="mt-3 text-sm text-gray-500">NextShop 推薦</p>
              <p className="mt-1 text-base font-semibold text-gray-900">{item.title}</p>
              <p className="mt-1 text-sm text-gray-700">{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
