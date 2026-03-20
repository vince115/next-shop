"use client";

import { useState } from "react";
import { X, CreditCard, Loader2, Loader } from "lucide-react";
import {
  CardElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { apiFetch } from "@/lib/api";

import { CardPreview } from "./CardPreview";

// Use a public test key
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq54NiTphI7jx";
const stripePromise = loadStripe(PUBLISHABLE_KEY);

interface AddCardFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function AddCardForm({ onSuccess, onCancel }: AddCardFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // States for Card Preview (Visual only)
  const [cardName, setCardName] = useState("");
  const [brand, setBrand] = useState("");
  const [last4, setLast4] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");

  const handleCardChange = (event: any) => {
    setBrand(event.brand || "");
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;

      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardName,
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Stripe initialization error");
        setLoading(false);
        return;
      }

      if (paymentMethod) {
        // Send paymentMethodId to backend
        await apiFetch("/api/payment-methods", {
          method: "POST",
          body: JSON.stringify({
            payment_token: paymentMethod.id,
            brand: paymentMethod.card?.brand || "unknown",
            last4: paymentMethod.card?.last4 || "****",
            exp_month: paymentMethod.card?.exp_month || 0,
            exp_year: paymentMethod.card?.exp_year || 0,
          }),
        });

        onSuccess();
      }
    } catch (err) {
      console.error(err);
      setError("Failed to add payment method. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CardPreview
        brand={brand}
        last4={last4}
        expMonth={expMonth}
        expYear={expYear}
        cardName={cardName}
      />

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 font-semibold">
            持有者姓名 (Name on Card)
          </label>
          <input
            type="text"
            required
            placeholder="e.g. JOHN DOE"
            value={cardName}
            onChange={(e) => setCardName(e.target.value.toUpperCase())}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all uppercase tracking-wider placeholder:normal-case font-mono"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 font-semibold">
            卡片資訊
          </label>
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-transparent transition-all">
            <CardElement
              onChange={handleCardChange}
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#111827",
                    "::placeholder": {
                      color: "#9ca3af",
                    },
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  },
                  invalid: {
                    color: "#dc2626",
                  },
                },
              }}
            />
          </div>
          {error && <p className="mt-2 text-xs text-rose-600 animate-in fade-in slide-in-from-top-1">{error}</p>}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          取消
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 rounded-xl bg-gray-900 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              處理中...
            </>
          ) : (
            "確認新增"
          )}
        </button>
      </div>
    </form>
  );
}

export function AddPaymentMethodModal({
  onSuccess,
  onCancel,
}: {
  onSuccess: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <CreditCard className="h-5 w-5 text-gray-900" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">新增付款方式</h2>
          </div>
          <button
            onClick={onCancel}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <Elements stripe={stripePromise}>
          <AddCardForm onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>

        <p className="mt-6 text-center text-xs text-gray-500">
          您的卡片資訊將透過 Stripe 加密安全傳輸。
        </p>
      </div>
    </div>
  );
}
