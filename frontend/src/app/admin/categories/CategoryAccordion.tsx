// frontend/src/app/admin/categories/CategoryAccordion.tsx
"use client";

import { Category } from "@/types/category";
import CategoryItem from "./CategoryItem";

interface TreeCategory extends Category {
  children: TreeCategory[];
}

interface Props {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  deleting: number | null;
}

export default function CategoryAccordion({ categories, onEdit, onDelete, deleting }: Props) {
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

  // Transform flat list to tree
  const buildTree = (cats: Category[]): TreeCategory[] => {
    const map = new Map<number, TreeCategory>();
    const tree: TreeCategory[] = [];

    // Initialize map
    cats.forEach((cat) => {
      map.set(cat.id, { ...cat, children: [] });
    });

    // Populate children
    cats.forEach((cat) => {
      const node = map.get(cat.id)!;
      if (cat.parentId && map.has(cat.parentId)) {
        map.get(cat.parentId)!.children.push(node);
      } else {
        tree.push(node);
      }
    });

    // Sort by name
    return tree.sort((a, b) => a.name.localeCompare(b.name));
  };

  const tree = buildTree(categories);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Table Header Look-alike (Optional) */}
      <div className="bg-slate-50 px-4 py-3 text-xs uppercase tracking-wide text-slate-500 font-semibold border-b border-slate-200 flex items-center justify-between">
        <span>Category Hierarchy</span>
        <span>Actions</span>
      </div>

      <div className="flex flex-col">
        {tree.map((cat) => (
          <CategoryItem
            key={cat.id}
            category={cat}
            level={0}
            onEdit={onEdit}
            onDelete={onDelete}
            deleting={deleting}
          />
        ))}
      </div>
    </div>
  );
}
