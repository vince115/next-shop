// frontend/src/components/admin/AdminProductsPageShell.tsx
"use client";

interface ProductRow {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface AdminProductsPageShellProps {
  products: ProductRow[];
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

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-160 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                  <td className="px-6 py-4 text-slate-600">${product.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        product.stock > 25
                          ? "bg-emerald-50 text-emerald-700"
                          : product.stock > 10
                            ? "bg-amber-50 text-amber-700"
                            : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {product.stock} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm font-medium">
                      <button
                        type="button"
                        className="text-slate-600 transition-colors hover:text-slate-900"
                        onClick={() => console.log("Edit product", product.id)}
                      >
                        Edit
                      </button>
                      <span className="text-slate-200">•</span>
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
