// frontend/src/app/admin/categories/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Category } from "@/types/category";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  CategoryPayload,
} from "@/lib/categoryApi";
import CategoryAccordion from "./CategoryAccordion";
import CategoryModal from "./CategoryModal";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Optimistic delete
  const [deleting, setDeleting] = useState<number | null>(null);

  // ── Auth guard ────────────────────────────────────────────────────
  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }
    if (user.role?.toUpperCase() !== "ADMIN") { router.replace("/403"); return; }
  }, [authLoading, user, router]);

  // ── Load categories ───────────────────────────────────────────────
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data ?? []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && user?.role?.toUpperCase() === "ADMIN") {
      load();
    }
  }, [authLoading, user, load]);

  // ── Handlers ──────────────────────────────────────────────────────
  function openCreate() {
    setEditTarget(null);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditTarget(cat);
    setModalOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setModalOpen(false);
    setEditTarget(null);
  }

  async function handleSubmit(payload: CategoryPayload) {
    setSubmitting(true);
    try {
      if (editTarget) {
        const updated = await updateCategory(editTarget.id, payload);
        // Optimistic update — replace row in-place
        setCategories((prev) =>
          prev.map((c) => (c.id === editTarget.id ? updated : c))
        );
      } else {
        const created = await createCategory(payload);
        // Optimistic: append then re-sort by name
        setCategories((prev) =>
          [...prev, created].sort((a, b) => a.name.localeCompare(b.name))
        );
      }
      closeModal();
    } catch (err) {
      console.error("Category save failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(cat: Category) {
    if (!confirm(`Delete "${cat.name}"? This cannot be undone.`)) return;
    setDeleting(cat.id);
    // Optimistic remove
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    try {
      await deleteCategory(cat.id);
    } catch (err) {
      console.error("Delete failed:", err);
      // Roll back on error
      setCategories((prev) =>
        [...prev, cat].sort((a, b) => a.name.localeCompare(b.name))
      );
    } finally {
      setDeleting(null);
    }
  }

  // ── Render ────────────────────────────────────────────────────────
  if (authLoading || loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-500">Loading categories…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm text-rose-600">{error}</p>
        <button
          onClick={load}
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              Admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">
              Categories
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {categories.length === 0
                ? "No categories yet."
                : `${categories.length} categor${categories.length === 1 ? "y" : "ies"} total.`}
            </p>
          </div>

          <button
            onClick={openCreate}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 active:scale-95"
          >
            <Plus size={16} />
            New Category
          </button>
        </div>

        {/* Hierarchy Accordion */}
        <CategoryAccordion
          categories={categories}
          onEdit={openEdit}
          onDelete={handleDelete}
          deleting={deleting}
        />
      </div>

      {/* Modal */}
      <CategoryModal
        open={modalOpen}
        category={editTarget}
        allCategories={categories}
        onSubmit={handleSubmit}
        onClose={closeModal}
        submitting={submitting}
      />
    </>
  );
}
