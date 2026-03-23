// frontend/src/app/products/[id]/page.tsx

import { getProduct } from "@/lib/productApi";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchaseActions from "@/components/ProductPurchaseActions";
import { Heart, Package, ShieldCheck, Truck, Star } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  // Shopify-style placeholder data for conversion optimization
  const features = product.features || [
    "Premium materials and expert craftsmanship",
    "Optimized for daily comfort and durability",
    "Eco-conscious production and materials",
    "1-year manufacturer's guarantee included",
    "Available for express international shipping",
  ];

  const specs = product.specs || {
    "Brand": product.brand || "Next Shop Originals",
    "Category": product.category.name,
    "SKU": `NS-${product.id.toString().padStart(6, '0')}`,
    "Availability": product.stock > 0 ? "In Stock" : "Sold Out",
  };

  return (
    <main className="mx-auto max-w-[1200px] xl:max-w-[1280px] px-4 sm:px-6 lg:px-8 py-10 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 lg:items-start">
        
        {/* LEFT: Product Images (50% desktop) */}
        <div className="lg:sticky lg:top-24 w-full max-w-[700px] mx-auto min-w-0">
          <ProductGallery name={product.name} imageUrls={product.imageUrls} />
        </div>

        {/* RIGHT: Product Info & Purchase (50% desktop) */}
        <section className="flex flex-col gap-10 min-w-0 pl-0 lg:pl-6 xl:pl-10">
          
          <div className="space-y-6">
            <div className="flex flex-col gap-1.5 uppercase tracking-[0.2em] font-black text-slate-400 text-[10px]">
              {product.category && <span>{product.category.name}</span>}
              <div className="flex items-center gap-1.5 text-amber-500">
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current" />
                <Star size={12} className="fill-current opacity-30" />
                <span className="ml-1 text-slate-400 font-bold">4.8 (24)</span>
              </div>
            </div>
            
            <div className="flex items-start justify-between gap-8">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl leading-[1.15]">
                {product.name}
              </h1>
              <button className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-300 shadow-sm transition-all hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 active:scale-90">
                <Heart size={20} className="fill-current stroke-current" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl font-black tracking-tight text-slate-900">
                  NT$ {Number(product.price).toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-lg font-medium text-slate-300 line-through">
                    NT$ {Number(product.originalPrice).toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2.5">
                <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/20" : "bg-slate-300"}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  {product.stock > 0 
                    ? `Ready to ship — ${product.stock} available` 
                    : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Segment */}
          <div className="w-full pt-2">
            <ProductPurchaseActions productId={product.id} stock={product.stock} />
          </div>

          <div className="border-t border-slate-100 pt-10">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-5 italic">Overview</h3>
             <p className="text-base leading-relaxed text-slate-600 font-medium">
               {product.description || "Discover the perfect blend of style and functional excellence with our latest original design."}
             </p>
          </div>

          {/* Trust Icons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 pt-2 border-slate-50">
             <div className="flex items-center gap-4 py-4 px-5 rounded-2xl bg-slate-50/50 border border-slate-100/50 sm:flex-col sm:items-center sm:text-center group transition-colors hover:bg-slate-50">
               <Truck size={20} className="text-slate-900 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Free Shipping</span>
             </div>
             <div className="flex items-center gap-4 py-4 px-5 rounded-2xl bg-slate-50/50 border border-slate-100/50 sm:flex-col sm:items-center sm:text-center group transition-colors hover:bg-slate-50">
               <ShieldCheck size={20} className="text-slate-900 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">2Y Warranty</span>
             </div>
             <div className="flex items-center gap-4 py-4 px-5 rounded-2xl bg-slate-50/50 border border-slate-100/50 sm:flex-col sm:items-center sm:text-center group transition-colors hover:bg-slate-50">
               <Package size={20} className="text-slate-900 group-hover:scale-110 transition-transform" />
               <span className="text-[10px] font-bold uppercase tracking-tight text-slate-500">Eco-Returns</span>
             </div>
          </div>
        </section>
      </div>

      {/* Extended Content */}
      <div className="mt-32 grid grid-cols-1 gap-20 border-t border-slate-100 pt-24 lg:grid-cols-2 lg:gap-32">
        <section className="space-y-10 min-w-0">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Build Quality</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Technical details</h2>
          </div>
          
          <dl className="grid grid-cols-1 divide-y divide-slate-100">
            {Object.entries(specs).map(([label, value]) => (
              <div key={label} className="flex justify-between py-6 group transition-colors hover:bg-slate-50/40 px-3">
                <dt className="text-sm font-bold text-slate-400 capitalize underline-offset-4 decoration-dotted decoration-slate-200">
                  {label}
                </dt>
                <dd className="text-sm font-bold text-slate-900 text-right truncate pl-4">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-10 min-w-0">
           <div className="space-y-3">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Design Philosophy</span>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Core Features</h2>
          </div>
          
          <ul className="space-y-8">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-5 group">
                <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full border border-slate-300 bg-white group-hover:bg-slate-900 group-hover:border-slate-900 transition-all duration-300" />
                <p className="text-lg font-medium text-slate-500 leading-normal group-hover:text-slate-900 transition-colors duration-300">
                  {feature}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}