//frontend/src/app/account/payments/page.tsx
"use client";

import { useState } from "react";
import { CreditCard, Plus, Trash2, Star } from "lucide-react";

interface PaymentMethod {
  id: number;
  type: "visa" | "mastercard" | "jcb" | "amex";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
}

const mockPayments: PaymentMethod[] = [
  {
    id: 1,
    type: "visa",
    last4: "4242",
    expiryMonth: "12",
    expiryYear: "2025",
    holderName: "WANG XIAO MING",
    isDefault: true,
  },
  {
    id: 2,
    type: "mastercard",
    last4: "5555",
    expiryMonth: "08",
    expiryYear: "2026",
    holderName: "WANG XIAO MING",
    isDefault: false,
  },
];

const cardBrandColors = {
  visa: "bg-blue-600",
  mastercard: "bg-orange-600",
  jcb: "bg-green-600",
  amex: "bg-indigo-600",
};

const cardBrandNames = {
  visa: "Visa",
  mastercard: "Mastercard",
  jcb: "JCB",
  amex: "American Express",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentMethod[]>(mockPayments);

  const handleSetDefault = (id: number) => {
    setPayments(
      payments.map((payment) => ({
        ...payment,
        isDefault: payment.id === id,
      }))
    );
  };

  const handleDelete = (id: number) => {
    setPayments(payments.filter((payment) => payment.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Payment Methods</p>
          <h1 className="text-3xl font-bold text-gray-900">付款方式</h1>
          <p className="mt-2 text-gray-600">管理您的信用卡與付款方式</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增卡片
        </button>
      </div>

      <div className="space-y-4">
        {payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">尚未新增付款方式</h3>
            <p className="mt-2 text-sm text-gray-600">新增您的第一張信用卡</p>
            <button
              type="button"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              新增卡片
            </button>
          </div>
        ) : (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`flex h-12 w-16 items-center justify-center rounded-lg ${
                      cardBrandColors[payment.type]
                    } text-white`}
                  >
                    <CreditCard className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cardBrandNames[payment.type]}
                      </h3>
                      {payment.isDefault && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                          <Star className="h-3 w-3 fill-current" />
                          預設卡片
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-mono text-base">•••• •••• •••• {payment.last4}</p>
                      <p>持卡人：{payment.holderName}</p>
                      <p>
                        到期日：{payment.expiryMonth}/{payment.expiryYear}
                      </p>
                    </div>

                    {!payment.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(payment.id)}
                        className="mt-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        設為預設卡片
                      </button>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(payment.id)}
                  disabled={payment.isDefault}
                  className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                  aria-label="刪除卡片"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {payments.length > 0 && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
            預設卡片將自動套用至結帳流程，您可隨時變更。
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            <p className="font-medium mb-1">安全提示</p>
            <p>
              我們使用業界標準的 SSL 加密技術保護您的付款資訊。卡片資訊經過加密處理，NextShop 不會儲存完整卡號。
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
