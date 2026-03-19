//frontend/src/components/checkout/CheckoutModal.tsx
"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

const sizeClasses: Record<NonNullable<CheckoutModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-xl sm:max-w-2xl",
  lg: "max-w-2xl",
};

export default function CheckoutModal({ open, title, onClose, children, footer, size = "md" }: CheckoutModalProps) {
  if (!open) return null;

  const widthClass = sizeClasses[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className={`w-full ${widthClass} rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <p className="text-base font-semibold text-gray-900">{title}</p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            aria-label="關閉"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4 px-6 py-6">{children}</div>
        {footer && <div className="border-t border-gray-100 px-6 py-4">{footer}</div>}
      </div>
    </div>
  );
}
