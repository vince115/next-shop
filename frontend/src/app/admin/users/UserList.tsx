//frontend/src/app/admin/users/UserList.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers } from "@/lib/userApi";
import { User } from "@/types/user";
import { useAuth } from "@/context/AuthContext";

export default function UserList() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔥 加一個 reload trigger（關鍵）
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role?.toUpperCase() !== "ADMIN") {
      router.replace("/403");
      return;
    }

    let aborted = false;

    async function load() {
      try {
        console.log("🚀 loading users..."); // debug
        setLoading(true);
        setError(null);

        const data = await getUsers();

        if (!aborted) {
          console.log("✅ users loaded:", data); // debug
          setUsers(data ?? []);
        }
      } catch (err) {
        if (!aborted) {
          console.error("❌ load users error:", err); // debug
          setError(err instanceof Error ? err.message : "無法載入使用者");
        }
      } finally {
        if (!aborted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      aborted = true;
    };
  }, [authLoading, user, router, reloadKey]); // 🔥 加 reloadKey

  // 🔥 loading
  if (authLoading || loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-500">使用者載入中...</p>
      </div>
    );
  }

  // 🔥 error
  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm text-rose-600">{error}</p>

        <button
          type="button"
          className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          onClick={() => {
            // 🔥 正確重新載入
            setReloadKey((prev) => prev + 1);
          }}
        >
          重新載入
        </button>
      </div>
    );
  }

  // 🔥 UI
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.4em] text-slate-400">Users</p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">使用者管理</h1>
        <p className="text-sm text-slate-500">
          目前共有 {users.length} 位使用者。
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-120 text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                  尚無使用者資料
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {u.id}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{u.email}</td>
                  <td className="px-4 py-3 text-slate-700">{u.name}</td>
                  <td className="px-4 py-3 text-slate-700">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        u.role === "ADMIN"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
