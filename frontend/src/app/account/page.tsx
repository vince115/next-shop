"use client";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile, UserProfile } from "@/lib/userApi";
import ProfileSection from "@/components/account/ProfileSection";
import { useEffect, useState } from "react";

export default function AccountPage() {
  const { user, token, isLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profileData = await getUserProfile(token);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load account data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!isLoading) {
      loadData();
    }
  }, [token, isLoading]);

  if (isLoading || loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-transparent" />
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">請先登入</h1>
        <p className="text-gray-600">您需要登入才能查看帳戶資訊</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-500">Account</p>
        <h1 className="text-3xl font-bold text-gray-900">我的帳戶</h1>
        <p className="mt-2 text-gray-600">更新個人資料與聯絡方式。</p>
      </div>

      {profile && <ProfileSection profile={profile} />}

      <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
        想查看所有訂單？前往左側「我的訂單」以取得完整列表。
      </div>
    </div>
  );
}
