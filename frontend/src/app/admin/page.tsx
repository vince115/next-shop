//frontend/src/app/admin/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log("[AdminPage] isLoading:", isLoading, "user:", user);
    if (isLoading) return;

    if (!user) {
      console.log("[AdminPage] no user after loading — redirecting to /login");
      router.replace("/login");
      return;
    }

    console.log("[AdminPage] user.role:", user.role, "— redirecting to /admin/orders");
    router.replace("/admin/orders");
  }, [isLoading, user, router]);

  return null;
}
