// frontend/src/app/products/[id]/page.tsx

import { getProduct } from "@/lib/productApi";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchaseActions from "@/components/ProductPurchaseActions";
import { Heart, Truck, ShieldCheck, Timer } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-10 lg:py-16">
      <div className="grid gap-12 lg:grid-cols-[55%_45%] lg:items-start">
        {/* Left: Image Gallery (55%) */}
        <div className="sticky top-24">
          <ProductGallery name={product.name} imageUrls={product.imageUrls} />
        </div>

        {/* Right: Product Info (45%) */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
             {product.category && (
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400">
                {product.category.name}
              </span>
            )}
            <div className="flex items-start justify-between gap-6">
              <h1 className="text-2xl font-semibold leading-tight text-gray-900 sm:text-3xl">
                {product.name}
              </h1>
              <button className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-400 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-500 hover:shadow-md active:scale-95">
                <Heart size={20} className="fill-current stroke-current" />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b border-gray-100 pb-10">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold tracking-tight text-gray-900">
                NT$ {Number(product.price).toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg font-medium text-gray-300 line-through">
                  NT$ {Number(product.originalPrice).toLocaleString()}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse" : "bg-gray-300"}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {product.stock > 0 ? `${product.stock} in stock · ready to ship` : "Currently out of stock"}
              </span>
            </div>
          </div>

          {product.description && (
             <div className="flex flex-col gap-4">
               <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Description</h3>
               <p className="text-base leading-8 text-gray-600">
                 {product.description}
               </p>
             </div>
          )}

          {/* Quantity & Actions */}
          <ProductPurchaseActions productId={product.id} stock={product.stock} />

          {/* Trust Section */}
          <div className="grid grid-cols-1 gap-6 border-t border-gray-100 pt-10 sm:grid-cols-3">
             <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center sm:gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-black shadow-sm">
                   <Truck size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Fast delivery</span>
                  <span className="hidden text-[10px] text-gray-400 sm:inline">24-48h processing</span>
                </div>
             </div>
             <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center sm:gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-black shadow-sm">
                   <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">Warranty</span>
                  <span className="hidden text-[10px] text-gray-400 sm:inline">1 year protection</span>
                </div>
             </div>
             <div className="flex items-center gap-4 sm:flex-col sm:items-center sm:text-center sm:gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-black shadow-sm">
                   <Timer size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-900">7-day return</span>
                  <span className="hidden text-[10px] text-gray-400 sm:inline">No questions asked</span>
                </div>
             </div>
          </div>
        </section>
      </div>

      {/* Extended Product Details */}
      <section className="mt-32 max-w-3xl space-y-8 border-t border-gray-50 pt-20">
        <h2 className="text-xl font-bold tracking-tight text-gray-900 uppercase tracking-[0.2em] mb-12">Product Overview</h2>
        <div className="prose prose-slate max-w-none text-gray-600 leading-9">
           <p className="text-lg text-gray-500 italic mb-8">
             Designed for excellence and crafted with meticulous attention to detail, this product represents our commitment to quality and longevity.
           </p>
           <p>
             {product.description || "No additional product details available at this time."}
           </p>
        </div>
      </section>
    </main>
  );
}