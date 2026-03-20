// frontend/src/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const headers = new Headers({
    "Content-Type": "application/json",
    ...(init?.headers || {}),
  });

  // ✅ 自動帶 token（核心）
  if (!headers.has("Authorization")) {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
  }

  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers,
  });

  // ✅ 401 統一處理（避免各頁亂炸）
  if (res.status === 401) {
    console.warn("Unauthorized → 清除 token");

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    console.error("API ERROR", res.status);
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}