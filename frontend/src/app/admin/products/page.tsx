// frontend/src/app/admin/products/page.tsx

import AdminProductsPageShell from "@/components/admin/AdminProductsPageShell";

const products = [
  { id: 1, name: "Luna Leather Backpack", price: 189.0, stock: 42 },
  { id: 2, name: "Aero Wireless Earbuds", price: 129.0, stock: 15 },
  { id: 3, name: "Terra Ceramic Mug", price: 32.5, stock: 120 },
  { id: 4, name: "Pulse Smartwatch", price: 249.99, stock: 5 },
  { id: 5, name: "Nimbus Throw Blanket", price: 79.0, stock: 64 },
];

export default function AdminProductsPage() {
  return <AdminProductsPageShell products={products} />;
}
