// frontend/src/app/products/loading.tsx
import { Loader2, LayoutGrid } from "lucide-react";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10 py-8 lg:py-12 min-h-screen">
      <div className="space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="flex gap-4 mt-6">
            <div className="h-10 w-32 bg-gray-200 rounded-xl" />
            <div className="h-10 flex-1 max-w-sm bg-gray-200 rounded-xl" />
            <div className="h-10 w-24 bg-gray-200 rounded-xl ml-auto" />
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4">
               <div className="aspect-square bg-gray-100 rounded-xl" />
               <div className="space-y-2">
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                  <div className="h-5 w-full bg-gray-200 rounded" />
               </div>
               <div className="flex justify-between items-center mt-4">
                  <div className="h-6 w-20 bg-gray-200 rounded-lg" />
                  <div className="h-10 w-10 bg-gray-200 rounded-xl" />
               </div>
            </div>
          ))}
        </div>
      </div>
    
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-100">
           <Loader2 className="h-6 w-6 animate-spin text-gray-900" />
           <span className="text-sm font-bold uppercase tracking-widest text-gray-900">Loading Catalog...</span>
        </div>
      </div>
    </div>
  );
}
