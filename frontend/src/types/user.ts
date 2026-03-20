// frontend/src/types/user.ts

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;

  // 後端常見欄位（建議保留）
  phone?: string | null;

  // 時間欄位（跟 order 一致）
  created_at?: string;
  updated_at?: string;
}