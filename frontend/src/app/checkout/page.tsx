"use client";

import { useEffect, useState, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { Loader2, CreditCard, ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Lifecycle safety: Store controller, mount state, and navigation state in refs
  const controllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const navigatedRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort(); 
    };
  }, []);

  // 2. Navigation safety helper: Prevents multiple pushes even if redirect occurs fast
  const safePush = (path: string) => {
    if (!isMountedRef.current || navigatedRef.current) return;
    navigatedRef.current = true;
    router.push(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Initial guards
    if (loading || !stripe || !elements || !isMountedRef.current) {
      return;
    }

    setLoading(true);
    setError(null);

    // 3. Prevent race conditions: Abort previous request before starting new one
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/payment-intent`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" 
        },
        credentials: "include",
        signal: controllerRef.current.signal,
        body: JSON.stringify({ orderId: 1 }),
      });

      if (!response.ok) {
        throw new Error("PaymentIntent API failed");
      }

      const data = await response.json();
      
      if (!isMountedRef.current) return;

      if (!data.clientSecret) {
        throw new Error("Missing clientSecret");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        safePush("/checkout/fail");
        return;
      }

      // 4. Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (!isMountedRef.current) return;

      if (result.error) {
        console.error("[Stripe Error]", result.error);
        safePush("/checkout/fail");
        return;
      }

      const status = result.paymentIntent?.status;
      if (status === "succeeded" || status === "processing") {
        safePush("/checkout/success");
        return;
      } else {
        safePush("/checkout/fail");
        return;
      }

    } catch (err: unknown) {
      // 5. Detection of AbortError via DOMException or fallback
      if (
        (err instanceof DOMException && err.name === "AbortError") ||
        (err instanceof Error && err.name === "AbortError")
      ) {
        return;
      }

      console.error("[Checkout Error]", err);
      safePush("/checkout/fail");
    } finally {
      // 6. Final cleanup and state reset
      if (isMountedRef.current) {
        setLoading(false);
      }
      controllerRef.current = null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center text-white">
            <CreditCard size={18} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Card Information</h2>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 focus-within:ring-2 focus-within:ring-black">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#000",
                  "::placeholder": { color: "#9ca3af" },
                },
              },
            }}
          />
        </div>
        
        {error && <p className="mt-4 text-xs font-bold text-red-500 text-center">{error}</p>}

        <p className="mt-6 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5 grayscale">
          <ShieldCheck size={14} />
          SECURE ENCRYPTED (STRIPE TEST MODE)
        </p>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="group relative flex w-full items-center justify-center rounded-2xl bg-black py-4 px-8 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 disabled:opacity-40 active:scale-[0.98]"
      >
        {loading ? (
          <div className="flex items-center gap-3">
             <Loader2 className="h-4 w-4 animate-spin" />
             <span>Processing...</span>
          </div>
        ) : (
          "PAY NT$ 1,999 NOW"
        )}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  return (
    <main className="mx-auto max-w-[500px] px-6 py-16 lg:py-24">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
        <p className="mt-2 text-sm text-gray-500">Complete your demo purchase below.</p>
      </div>

      <div className="rounded-2xl bg-slate-50 p-6 lg:p-8 border border-slate-100 mb-10">
         <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Demo Product Pack</span>
            <span className="text-sm font-bold text-slate-900">NT$ 1,999</span>
         </div>
         <div className="h-px bg-slate-200 w-full" />
         <div className="flex justify-between items-center mt-4">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Total</span>
            <span className="text-xl font-black text-slate-900 tracking-tighter">NT$ 1,999</span>
         </div>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
      
      <p className="mt-12 text-center text-xs text-gray-400">
        Demo purposes only. No actual goods will be shipped.
        <br />
        Use <span className="font-bold text-gray-600">4242 4242 4242 4242</span> for testing.
      </p>
    </main>
  );
}
