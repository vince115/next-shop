// frontend/src/lib/userApi.ts

import { apiFetch } from "./api";
import { User } from "@/types/user";

export type UserProfile = User;

// 取得目前登入者資料
export async function getUserProfile(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/api/users/me");
}

// 取得所有使用者（admin）
export async function getUsers(): Promise<User[]> {
  return apiFetch<User[]>("/api/users");
}

// 取得單一使用者
export async function getUser(id: number | string): Promise<User> {
  return apiFetch<User>(`/api/users/${id}`);
}