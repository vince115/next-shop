// frontend/src/app/admin/categories/CategoryModal.tsx
"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Category } from "@/types/category";
import { CategoryPayload } from "@/lib/categoryApi";
import CategoryForm from "./CategoryForm";

interface Props {
  open: boolean;
  category?: Category | null;
  allCategories: Category[];
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  onClose: () => void;
  submitting: boolean;
}

export default function CategoryModal({ open, category, allCategories, onSubmit, onClose, submitting }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isEdit = !!category;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Categories
            </p>
            <h2 className="mt-0.5 text-lg font-semibold text-slate-900">
              {isEdit ? "Edit Category" : "New Category"}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <CategoryForm
          initial={category ?? null}
          allCategories={allCategories}
          onSubmit={onSubmit}
          onCancel={onClose}
          submitting={submitting}
        />
      </div>
    </div>
  );
}
