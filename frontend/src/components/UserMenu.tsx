"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="User menu"
        aria-expanded={open}
      >
        <User size={20} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="py-1 text-sm">
            <Link
              href="/orders"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              我的訂單
            </Link>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              追蹤清單
            </button>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              修改資料
            </button>
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              問答中心
            </button>
          </div>
          <div className="border-t border-gray-100 py-1 text-sm">
            <button
              type="button"
              className="block w-full px-4 py-2 text-left text-gray-400 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              登入 | 註冊
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
