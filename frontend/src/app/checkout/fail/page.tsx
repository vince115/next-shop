import Link from "next/link";
import { XCircle, RefreshCcw, ShoppingBag } from "lucide-react";

export default function CheckoutFailPage() {
  return (
    <main className="mx-auto max-w-[500px] px-6 py-24 lg:py-32 flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 mb-8 animate-pulse duration-700">
        <XCircle size={32} />
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">Payment Failed!</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
           Your card was declined or another error occurred during processing.
           <br />
           <span className="font-bold text-black italic italic tracking-tight underline underline-offset-8 decoration-rose-200">Please check your details and try again.</span>
        </p>
      </div>

      <div className="w-full space-y-4 mb-16">
         {/* Troubleshooting Tip Mock */}
         <div className="flex flex-col gap-4 p-8 rounded-2xl bg-slate-50 border border-slate-100/50 shadow-sm text-center">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Troubleshooting</h3>
            <div className="text-sm font-medium text-slate-600 space-y-3">
               <p>Verify your card number and expiration date.</p>
               <p>Ensure your account has sufficient funds.</p>
               <p>Check for network connectivity issues.</p>
            </div>
         </div>

         {/* Trust/Support */}
         <div className="flex flex-col items-center gap-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Need Assistance?</span>
            <span className="text-sm font-bold text-blue-600 hover:underline cursor-pointer">Live Support Chat</span>
         </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
         <Link
            href="/checkout"
            className="flex items-center justify-center gap-4 rounded-2xl bg-black py-4.5 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-[0.98]"
         >
            <RefreshCcw size={18} />
            <span>TRY AGAIN NOW</span>
         </Link>
         <Link
            href="/products"
            className="flex items-center justify-center gap-4 rounded-2xl border-2 border-slate-200 bg-white py-4.5 text-sm font-bold uppercase tracking-[0.15em] text-slate-400 hover:text-black hover:border-black transition-all active:scale-[0.98]"
         >
            <ShoppingBag size={18} />
            <span>BACK TO SHOPPING</span>
         </Link>
      </div>

      <p className="mt-16 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] italic">
        DEMO MODE: Use 4242... for successful test payments.
      </p>
    </main>
  );
}
