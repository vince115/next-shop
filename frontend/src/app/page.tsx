// frontend/src/app/page.tsx

export default function HomePage() {
  return (
    <main className="min-h-screen p-10 bg-white">
      <h1 className="text-3xl font-bold">Next Shop</h1>
      <p className="mt-4 text-gray-600">
        Demo environment is ready
      </p>

      <div className="mt-8 space-x-4">
        <a
          href="/products"
          className="inline-block rounded bg-black px-5 py-2 text-white hover:bg-gray-800"
        >
          View Products
        </a>

        <a
          href="/cart"
          className="inline-block rounded border border-gray-300 px-5 py-2 hover:bg-gray-100"
        >
          View Cart
        </a>
      </div>
    </main>
  );
}