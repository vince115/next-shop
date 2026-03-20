// frontend/src/app/admin/categories/CategoryForm.tsx
"use client";

import { useEffect, useState } from "react";
import { Category } from "@/types/category";
import { CategoryPayload } from "@/lib/categoryApi";

interface Props {
  initial?: Category | null;
  allCategories: Category[];          // full list for the parent dropdown
  onSubmit: (payload: CategoryPayload) => Promise<void>;
  onCancel: () => void;
  submitting: boolean;
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CategoryForm({ initial, allCategories, onSubmit, onCancel, submitting }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugManual, setSlugManual] = useState(!!initial);
  const [parentId, setParentId] = useState<number | null>(initial?.parentId ?? null);

  // Reset form when switching between create/edit
  useEffect(() => {
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setSlugManual(!!initial);
    setParentId(initial?.parentId ?? null);
  }, [initial]);

  // Auto-generate slug from name unless user has manually edited it
  useEffect(() => {
    if (!slugManual) {
      setSlug(toSlug(name));
    }
  }, [name, slugManual]);

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setSlug(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({ name: name.trim(), slug: slug.trim(), parentId });
  }

  // Candidates for parent: everyone except the category being edited
  const parentOptions = allCategories.filter((c) => c.id !== initial?.id);

  // Build indented label: children get "— " prefix
  function parentLabel(cat: Category): string {
    return cat.parentId ? `— ${cat.name}` : cat.name;
  }

  const inputClass =
    "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50 disabled:text-slate-400";
  const labelClass = "block mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <div>
        <label className={labelClass}>Name *</label>
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. Running Shoes"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          disabled={submitting}
          autoFocus
        />
      </div>

      {/* Slug */}
      <div>
        <label className={labelClass}>Slug *</label>
        <input
          className={inputClass}
          type="text"
          placeholder="e.g. running-shoes"
          value={slug}
          onChange={(e) => handleSlugChange(e.target.value)}
          required
          disabled={submitting}
        />
        <p className="mt-1 text-xs text-slate-400">
          Auto-generated from name. Edit to override.
        </p>
      </div>

      {/* Parent Category */}
      <div>
        <label className={labelClass}>Parent Category</label>
        <select
          className={inputClass}
          value={parentId ?? ""}
          onChange={(e) =>
            setParentId(e.target.value === "" ? null : Number(e.target.value))
          }
          disabled={submitting}
        >
          <option value="">— None (Root)</option>
          {parentOptions
            .sort((a, b) => (a.parentId ?? 0) - (b.parentId ?? 0) || a.name.localeCompare(b.name))
            .map((cat) => (
              <option key={cat.id} value={cat.id}>
                {parentLabel(cat)}
              </option>
            ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting || !name.trim() || !slug.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50"
        >
          {submitting ? "Saving…" : initial ? "Update" : "Create"}
        </button>
      </div>
    </form>
  );
}
