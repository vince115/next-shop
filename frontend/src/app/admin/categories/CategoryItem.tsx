// frontend/src/app/admin/categories/CategoryItem.tsx
"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Category } from "@/types/category";

interface TreeCategory extends Category {
  children: TreeCategory[];
}

interface Props {
  category: TreeCategory;
  level: number;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  deleting: number | null;
}

export default function CategoryItem({ category, level, onEdit, onDelete, deleting }: Props) {
  const [isOpen, setIsOpen] = useState(level === 0); // Default open first level
  const hasChildren = category.children.length > 0;
  const isDeleting = deleting === category.id;

  const toggle = () => {
    if (hasChildren) setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col border-b border-slate-100 last:border-0">
      {/* Row */}
      <div
        className={`group flex items-center justify-between py-3 px-4 transition-colors ${
          isDeleting ? "opacity-40" : "hover:bg-slate-50/60"
        } ${level === 0 ? "bg-white" : "bg-slate-50/30"}`}
      >
        <div className="flex items-center gap-2 flex-grow min-w-0">
          {/* Indent */}
          {Array.from({ length: level }).map((_, i) => (
            <div key={i} className="w-6 shrink-0" />
          ))}

          {/* Icon / Toggle */}
          <div className="w-6 flex items-center justify-center shrink-0">
            {hasChildren ? (
              <button
                onClick={toggle}
                className="p-1 rounded hover:bg-slate-200/50 text-slate-400 transition-colors"
              >
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col min-w-0">
            <span className={`text-sm ${level === 0 ? "font-semibold text-slate-900" : "font-medium text-slate-700"}`}>
              {category.name}
            </span>
            <span className="text-[10px] font-mono text-slate-400 truncate">
              /{category.slug}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(category)}
            disabled={isDeleting}
            title="Edit"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-200/50 hover:text-slate-700 disabled:opacity-40"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => onDelete(category)}
            disabled={isDeleting}
            title="Delete"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:opacity-40"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isOpen && (
        <div className="flex flex-col">
          {category.children.map((child) => (
            <CategoryItem
              key={child.id}
              category={child}
              level={level + 1}
              onEdit={onEdit}
              onDelete={onDelete}
              deleting={deleting}
            />
          ))}
        </div>
      )}
    </div>
  );
}
