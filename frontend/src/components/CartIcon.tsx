import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartIcon({ count }: { count: number }) {
  return (
    <Link
      href="/cart"
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
      aria-label="Cart"
    >
      <ShoppingCart size={20} />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-gray-900 px-1.5 py-0.5 text-center text-[11px] font-medium leading-none text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
