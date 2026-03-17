// frontend/src/lib/api.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    console.error("API ERROR", res.status);
    throw new Error(`API request failed: ${res.status} ${res.statusText}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}