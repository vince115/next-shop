const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface UserProfile {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
}

export async function getUserProfile(token: string): Promise<UserProfile> {
  const res = await fetch(`${API_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return res.json();
}
