export default function SearchBar({ open }: { open: boolean }) {
  return (
    <form action="/products" method="GET">
      <div
        className={`overflow-hidden transition-all duration-300 ${open ? "w-60 opacity-100" : "w-0 opacity-0"}`}
      >
        <input
          name="q"
          placeholder="Search products…"
          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </div>
    </form>
  );
}
