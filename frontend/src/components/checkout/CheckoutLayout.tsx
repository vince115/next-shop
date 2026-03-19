//frontend/src/components/checkout/CheckoutLayout.tsx
import { ReactNode } from "react";

interface CheckoutLayoutProps {
  header: ReactNode;
  form: ReactNode;
  summary: ReactNode;
}

export default function CheckoutLayout({
  header,
  form,
  summary,
}: CheckoutLayoutProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8 space-y-1">
          {header}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* ✅ LEFT（關鍵修正） */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm space-y-8">
            {form}
          </div>

          {/* RIGHT */}
          <aside className="lg:sticky lg:top-24">
            {summary}
          </aside>

        </div>
      </main>
    </div>
  );
}