import Link from "next/link";
import { CheckCircle, Truck, PackageCheck, ShoppingBag } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <main className="mx-auto max-w-[500px] px-6 py-24 lg:py-32 flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-8 animate-in zoom-in-50 duration-500">
        <CheckCircle size={32} />
      </div>

      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-gray-500 text-lg leading-relaxed">
          Your order <span className="font-bold text-black italic">#NS-2026-6543</span> has been confirmed.
          <br />
          We've sent a receipt to your registered email.
        </p>
      </div>

      <div className="w-full space-y-4 mb-12">
         {/* Simple Order Summary Mock */}
         <div className="flex flex-col gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100/50 shadow-sm text-left">
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-2">Order Summary</h3>
            <div className="flex justify-between items-center text-sm">
               <span className="text-slate-600 font-medium">Demo Product Pack (x1)</span>
               <span className="text-slate-900 font-bold tracking-tight">NT$ 1,999</span>
            </div>
            <div className="flex justify-between items-center text-sm">
               <span className="text-slate-600 font-medium italic underline underline-offset-4 decoration-dotted decoration-slate-200">Express Shipping</span>
               <span className="text-slate-900 font-bold">FREE</span>
            </div>
            <div className="h-px bg-slate-200 mt-2" />
            <div className="flex justify-between items-center pt-2">
               <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Paid</span>
               <span className="text-xl font-black text-slate-900 tracking-tight">NT$ 1,999</span>
            </div>
         </div>

         {/* Trust/Next Steps */}
         <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-gray-100 flex flex-col items-center gap-2">
               <Truck size={20} className="text-blue-500" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Arriving in 48h</span>
            </div>
            <div className="p-4 rounded-xl border border-gray-100 flex flex-col items-center gap-2">
               <PackageCheck size={20} className="text-emerald-500" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-gray-400">Inspected Quality</span>
            </div>
         </div>
      </div>

      <div className="flex flex-col gap-4 w-full">
         <Link
            href="/products"
            className="flex items-center justify-center gap-2 rounded-2xl bg-black py-4.5 text-sm font-bold uppercase tracking-widest text-white shadow-xl shadow-black/10 transition-all hover:bg-gray-800 active:scale-[0.98]"
         >
            <ShoppingBag size={18} />
            <span>CONTINUE SHOPPING</span>
         </Link>
         <Link
            href="/account"
            className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-black transition-colors"
         >
            TRACK YOUR ORDER
         </Link>
      </div>

      <p className="mt-16 text-center text-[10px] text-gray-400 uppercase tracking-[0.2em] italic">
        This is a demonstration only. No actual charges were made.
      </p>
    </main>
  );
}
