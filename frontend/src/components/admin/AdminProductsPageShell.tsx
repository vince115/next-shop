// frontend/src/components/admin/AdminProductsPageShell.tsx
"use client";

import { Product } from "@/types/product";

interface AdminProductsPageShellProps {
  products: Product[];
}

export default function AdminProductsPageShell({ products }: AdminProductsPageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Catalog</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Products</h1>
          <p className="text-slate-500">Manage product availability, pricing, and stock.</p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          onClick={() => console.log("Create product")}
        >
          Create Product
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No products found in the catalog.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
                        {product.imageUrls?.[0] ? (
                          <img
                            src={product.imageUrls[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-slate-300">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{product.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {product.id}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-slate-900">
                      NT$ {Number(product.price).toFixed(0)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          product.stock > 10
                            ? "bg-emerald-50 text-emerald-700"
                            : product.stock > 0
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3 text-sm font-medium">
                        <button
                          type="button"
                          className="text-slate-600 transition-colors hover:text-slate-900"
                          onClick={() => console.log("Edit product", product.id)}
                        >
                          Edit
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          type="button"
                          className="text-rose-500 transition-colors hover:text-rose-600"
                          onClick={() => console.log("Delete product", product.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
