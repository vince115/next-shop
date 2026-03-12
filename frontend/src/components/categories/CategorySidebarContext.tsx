"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CategorySidebarContextValue = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const CategorySidebarContext = createContext<CategorySidebarContextValue | null>(null);

export function CategorySidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      setSidebarOpen(mq.matches);
    };

    sync();

    mq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
    };
  }, []);

  const value = useMemo(
    () => ({ sidebarOpen, setSidebarOpen }),
    [sidebarOpen]
  );

  return (
    <CategorySidebarContext.Provider value={value}>
      {children}
    </CategorySidebarContext.Provider>
  );
}

export function useCategorySidebar() {
  const ctx = useContext(CategorySidebarContext);
  if (!ctx) {
    throw new Error("useCategorySidebar must be used within CategorySidebarProvider");
  }
  return ctx;
}
