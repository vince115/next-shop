"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface UserMenuProps {
  onOpenLogin: () => void;
}

export default function UserMenu({ onOpenLogin }: UserMenuProps) {
  const { user, logout } = useAuth();
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

  const handleUserIconClick = () => {
    if (!user) {
      onOpenLogin();
    } else {
      setOpen((v) => !v);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={handleUserIconClick}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        aria-label="User menu"
        aria-expanded={open}
      >
        <User size={20} />
      </button>

      {open && user && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="py-1 text-sm">
            <Link
              href="/account"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              我的帳戶
            </Link>
            <Link
              href="/orders"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setOpen(false)}
            >
              我的訂單
            </Link>
          </div>

          <div className="border-t border-gray-100 py-1 text-sm">
            <button
              type="button"
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              登出
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
