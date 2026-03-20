// frontend/src/app/admin/categories/CategoryTable.tsx
"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types/category";

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  deleting: number | null;
}

export default function CategoryTable({ categories, onEdit, onDelete, deleting }: Props) {
  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-200 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <span className="text-xl">🗂️</span>
        </div>
        <p className="text-sm font-medium text-slate-600">No categories yet</p>
        <p className="text-xs text-slate-400">Click "New Category" to create the first one.</p>
      </div>
    );
  }

  // Build a lookup map for parent names
  const nameById = new Map(categories.map((c) => [c.id, c.name]));

  // Sort: parents (parentId == null) first, then children grouped under their parent
  const sorted = [...categories].sort((a, b) => {
    const aRoot = a.parentId ?? a.id;
    const bRoot = b.parentId ?? b.id;
    if (aRoot !== bRoot) return aRoot - bRoot;
    // within same parent group: parent row first, then children alphabetically
    if (a.parentId === null && b.parentId !== null) return -1;
    if (a.parentId !== null && b.parentId === null) return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-3 w-16">ID</th>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Slug</th>
            <th className="px-4 py-3">Parent</th>
            <th className="px-4 py-3 w-28 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((cat) => {
            const isDeleting = deleting === cat.id;
            const isChild = cat.parentId !== null;
            return (
              <tr
                key={cat.id}
                className={`border-t border-slate-100 transition-colors ${
                  isDeleting ? "opacity-40" : "hover:bg-slate-50/60"
                }`}
              >
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{cat.id}</td>
                <td className="px-4 py-3">
                  {isChild ? (
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="text-slate-300 select-none">└─</span>
                      {cat.name}
                    </span>
                  ) : (
                    <span className="font-medium text-slate-900">{cat.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-600">
                    {cat.slug}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {cat.parentId ? (
                    <span className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-slate-500">
                      {nameById.get(cat.parentId) ?? `#${cat.parentId}`}
                    </span>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEdit(cat)}
                      disabled={isDeleting}
                      title="Edit"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(cat)}
                      disabled={isDeleting}
                      title="Delete"
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
