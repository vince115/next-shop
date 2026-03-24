"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, CreditCard, ShieldCheck, ShoppingBag, AlertCircle } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

interface OrderItem {
  id: number;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderData {
  id: number;
  items: OrderItem[];
  totalItems: number;
  totalPrice: number;
  status: string;
}

function CheckoutForm({ order }: { order: OrderData }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const controllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef(true);
  const navigatedRef = useRef(false);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      controllerRef.current?.abort(); 
    };
  }, []);

  const safePush = (path: string) => {
    if (!isMountedRef.current || navigatedRef.current) return;
    navigatedRef.current = true;
    router.push(path);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading || !stripe || !elements || !isMountedRef.current) {
      return;
    }

    setLoading(true);
    setError(null);

    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    try {
      // ✅ Production Architecture: Call PaymentIntent with existing OrderID
      const piResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controllerRef.current.signal,
        body: JSON.stringify({ 
          orderId: order.id 
        }),
      });

      if (!piResponse.ok) {
        const errData = await piResponse.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to initialize secure payment session.");
      }

      const piData = await piResponse.json();
      
      if (!isMountedRef.current) return;

      if (!piData.clientSecret) {
        throw new Error("Missing clientSecret from backend response.");
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        safePush("/checkout/fail");
        return;
      }

      // Confirm Payment with Stripe
      const result = await stripe.confirmCardPayment(piData.clientSecret, {
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
      if (
        (err instanceof DOMException && err.name === "AbortError") ||
        (err instanceof Error && err.name === "AbortError")
      ) {
        return;
      }

      console.error("[CHECKOUT ERROR]", err);
      safePush("/checkout/fail");
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
      controllerRef.current = null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center text-white">
            <CreditCard size={18} />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">Payment Details</h2>
        </div>

        <div className="mb-6 rounded-lg bg-orange-50 border border-orange-100 p-3 flex items-start gap-2.5">
          <AlertCircle size={16} className="text-orange-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed text-orange-800">
            <strong>Notice:</strong> Saved payment methods are not currently supported. Card details must be entered manually.
          </p>
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
          PRODUCTION SECURE (STRIPE TEST MODE)
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
          `COMPLETE PAYMENT $${order.totalPrice.toLocaleString()}`
        )}
      </button>
    </form>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams?.get("orderId");
  
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      console.warn("No orderId found in URL, redirecting to cart...");
      router.push("/cart");
      return;
    }

    async function fetchOrder() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Failed to fetch order data");
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId, router]);

  if (loading) {
    return (
      <div className="flex flex-col h-[70vh] items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
        <p className="text-sm font-medium text-gray-500 animate-pulse">Retrieving Order Details...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <main className="mx-auto max-w-[500px] px-6 py-16 lg:py-24">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Checkout</h1>
        <p className="mt-2 text-sm text-gray-500">Invoice: #{order.id} | Review and pay.</p>
      </div>

      {/* ✅ Order Summary: Source of Truth is the ORDER record */}
      <div className="rounded-2xl bg-slate-50 p-6 lg:p-8 border border-slate-100 mb-10">
         <div className="space-y-4 mb-6">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest block mb-2">Order Summary</span>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-gray-600">
                  <span className="font-bold text-gray-900">{item.quantity}x</span> {item.productName}
                </span>
                <span className="font-medium text-gray-900">${item.subtotal.toLocaleString()}</span>
              </div>
            ))}
         </div>
         
         <div className="h-px bg-slate-200 w-full mb-4" />
         
         <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase text-slate-400 tracking-widest">Total Amount</span>
            <span className="text-xl font-black text-slate-900 tracking-tighter">
              ${order.totalPrice.toLocaleString()}
            </span>
         </div>
      </div>

      <Elements stripe={stripePromise}>
        <CheckoutForm order={order} />
      </Elements>
      
      <p className="mt-12 text-center text-[11px] text-gray-400 leading-relaxed">
        This checkout session is locked to Order #{order.id}. 
        <br />
        Amounts match our internal valuation to prevent data mismatch.
        <br />
        Use <span className="font-bold text-gray-600">4242 4242 4242 4242</span> for testing.
      </p>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-gray-300" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
