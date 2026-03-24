//frontend/src/app/account/payments/page.tsx
"use client";

import { useEffect, useState } from "react";
import { CreditCard, Plus, Trash2, Star, Loader2, AlertTriangle, HelpCircle } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";

interface PaymentMethod {
  id: number;
  provider: string;
  brand: "visa" | "mastercard" | "jcb" | "amex";
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

const cardBrandColors: Record<string, string> = {
  visa: "bg-blue-600",
  mastercard: "bg-orange-600",
  jcb: "bg-green-600",
  amex: "bg-indigo-600",
};

const cardBrandNames: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  jcb: "JCB",
  amex: "American Express",
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<PaymentMethod[]>("/api/payment-methods");
      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await apiFetch(`/api/payment-methods/${id}/default`, {
        method: "PATCH",
      });
      fetchPayments();
    } catch (error) {
      console.error("Failed to set default payment:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此卡片嗎？")) return;
    try {
      await apiFetch(`/api/payment-methods/${id}`, {
        method: "DELETE",
      });
      fetchPayments();
    } catch (error) {
      console.error("Failed to delete payment:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Payment Methods</p>
          <h1 className="text-3xl font-bold text-gray-900">付款方式</h1>
          <p className="mt-2 text-gray-600">管理您的信用卡與付款方式 (BETA)</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增卡片
        </button>
      </div>

      <div className="rounded-2xl bg-amber-50 border border-amber-100 p-5 flex items-start gap-3.5 mb-8 shadow-sm">
        <AlertTriangle size={24} className="text-amber-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-amber-900">Important Note on Saved Methods</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-amber-800">
            For security reasons, saved cards are currenty available for <strong>account viewing only</strong>. 
            Automated checkout integration is not yet enabled. You will still need to manually enter your card information during the final checkout step.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {payments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center">
            <CreditCard className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">尚未新增付款方式</h3>
            <p className="mt-2 text-sm text-gray-600">新增您的第一張信用卡</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
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
              className={`rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
                payment.is_default ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`flex h-12 w-16 items-center justify-center rounded-lg ${
                      cardBrandColors[payment.brand.toLowerCase()] || "bg-gray-600"
                    } text-white shadow-sm`}
                  >
                    <CreditCard className="h-6 w-6" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {cardBrandNames[payment.brand.toLowerCase()] || payment.brand}
                      </h3>
                      {payment.is_default && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                          <Star className="h-3 w-3 fill-current" />
                          預設卡片
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="font-mono text-base">•••• •••• •••• {payment.last4}</p>
                      <p>
                        到期日：{payment.exp_month.toString().padStart(2, "0")}/{payment.exp_year}
                      </p>
                    </div>

                    {!payment.is_default && (
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

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(payment.id)}
                    className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-50"
                    aria-label="刪除卡片"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 shadow-sm mt-8">
        <div className="flex items-center gap-2 mb-4 text-gray-900">
          <HelpCircle size={18} />
          <h4 className="font-bold">FAQ</h4>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-bold text-gray-800">為什麼結帳時無法選擇這些卡片？</p>
            <p className="text-sm text-gray-600">
              為了確保支付安全，我們目前僅在結帳頁面支援手動填寫卡號通過 Stripe 支付。Saved Card 整合功能正在開發中。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
