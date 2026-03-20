//frontend/src/app/account/profile/page.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getUserProfile,
  updateUserProfile,
  UserProfile,
  UpdateUserProfileInput,
} from "@/lib/userApi";
import { useCallback, useEffect, useState } from "react";
import { User, Mail, Phone, Bell, BellOff, AlertCircle } from "lucide-react";

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<UpdateUserProfileInput>({ name: "", phone: "" });
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      if (!token) {
        setLoading(false);
        return;
      }

      const profileData = await getUserProfile();
      setProfile(profileData);
      setFormState({ name: profileData.name, phone: profileData.phone ?? "" });
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-transparent" />
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    if (!token) {
      return (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">請先登入</h1>
          <p className="text-gray-600">登入後即可查看與管理您的個人資料。</p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            前往登入
          </Link>
        </div>
      );
    }

    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">無法載入個人資料</h1>
        <p className="text-gray-600">請稍後再試，或重新整理頁面。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-500">Profile</p>
        <h1 className="text-3xl font-bold text-gray-900">個人資料</h1>
        <p className="mt-2 text-gray-600">管理您的個人資訊與偏好設定</p>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">帳戶資訊</h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {isEditing ? "取消編輯" : "編輯資料"}
            </button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4 text-gray-400" />
                電子郵件
              </label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 disabled:bg-gray-50 disabled:text-gray-600"
              />
              <p className="text-sm text-gray-500">電子郵件暫不支援線上修改，如需變更請聯繫客服。</p>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <User className="h-4 w-4 text-gray-400" />
                姓名
              </label>
              <input
                type="text"
                value={isEditing ? formState.name : profile.name}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, name: event.target.value }))
                }
                disabled={!isEditing}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 disabled:bg-gray-50 disabled:text-gray-600 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4 text-gray-400" />
                電話號碼
              </label>
              <input
                type="tel"
                value={isEditing ? formState.phone ?? "" : profile.phone ?? ""}
                onChange={(event) =>
                  setFormState((prev) => ({ ...prev, phone: event.target.value }))
                }
                placeholder="尚未設定"
                disabled={!isEditing}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 disabled:bg-gray-50 disabled:text-gray-600 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">會員等級</label>
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                <span className="text-sm font-medium text-gray-900 capitalize">{profile.role}</span>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormState({ name: profile.name, phone: profile.phone ?? "" });
                  setErrorMessage(null);
                }}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!profile || !token) return;
                  setSaving(true);
                  setErrorMessage(null);
                  try {
                    const updated = await updateUserProfile({
                      name: formState.name.trim(),
                      phone: formState.phone?.trim() || null,
                    });
                    if (updated) {
                      setProfile(updated);
                      setFormState({ name: updated.name, phone: updated.phone ?? "" });
                    } else {
                      await loadProfile();
                    }
                    setIsEditing(false);
                  } catch (error) {
                    console.error("Failed to update profile", error);
                    setErrorMessage("儲存失敗，請稍後再試");
                  } finally {
                    setSaving(false);
                  }
                }}
                disabled={saving}
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-60"
              >
                {saving ? "儲存中..." : "儲存變更"}
              </button>
            </div>
          )}

          {errorMessage && (
            <p className="mt-4 text-sm text-red-600 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {errorMessage}
            </p>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">通知設定</h2>
            <span className="text-sm text-gray-500">尚未開放</span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">訂單通知</p>
                  <p className="text-sm text-gray-600">接收訂單狀態更新與物流資訊</p>
                </div>
              </div>
              <div className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
                即將推出
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-start gap-3">
                <Bell className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">促銷活動</p>
                  <p className="text-sm text-gray-600">接收優惠券、折扣與限時活動資訊</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="h-6 w-11 rounded-full bg-gray-200 peer peer-checked:bg-gray-900 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-300 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:content-[''] after:transition-all"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <BellOff className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">電子報</p>
                  <p className="text-sm text-gray-600">接收新品上市與品牌故事</p>
                </div>
              </div>
              <div className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-500">
                即將推出
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">個人資訊</h2>
            <span className="text-sm text-gray-500">開發中</span>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">生日</label>
                <input
                  type="date"
                  placeholder="選擇日期"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">性別</label>
                <select className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900">
                  <option value="">請選擇</option>
                  <option value="male">男性</option>
                  <option value="female">女性</option>
                  <option value="other">其他</option>
                  <option value="prefer-not-to-say">不透露</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">地址</label>
              <input
                type="text"
                placeholder="完整地址"
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-500">
              更多個人資訊設定即將推出。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
