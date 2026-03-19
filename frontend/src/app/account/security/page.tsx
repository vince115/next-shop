//frontend/src/app/account/security/page.tsx
"use client";

import { useState } from "react";
import { Lock, Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function SecurityPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password change submitted");
  };

  const passwordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "弱", color: "bg-red-500" };
    if (password.length < 10) return { strength: 2, label: "中等", color: "bg-yellow-500" };
    if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password))
      return { strength: 3, label: "強", color: "bg-green-500" };
    return { strength: 2, label: "中等", color: "bg-yellow-500" };
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-wide text-gray-500">Security</p>
        <h1 className="text-3xl font-bold text-gray-900">帳戶安全</h1>
        <p className="mt-2 text-gray-600">管理您的密碼與安全設定</p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Lock className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">變更密碼</h2>
            <p className="text-sm text-gray-600">定期更新密碼以保護帳戶安全</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="current-password" className="text-sm font-medium text-gray-700">
              目前密碼
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-12 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="輸入目前密碼"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="new-password" className="text-sm font-medium text-gray-700">
              新密碼
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-12 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="輸入新密碼"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${strength.color}`}
                      style={{ width: `${(strength.strength / 3) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-600">{strength.label}</span>
                </div>
                <p className="text-xs text-gray-500">
                  密碼強度：至少 10 個字元，包含大小寫字母與數字
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
              確認新密碼
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-12 text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="再次輸入新密碼"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>

            {confirmPassword && newPassword !== confirmPassword && (
              <p className="flex items-center gap-1 text-xs text-red-600">
                <AlertCircle className="h-3 w-3" />
                密碼不一致
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              更新密碼
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
            <Shield className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">雙重驗證</h2>
            <p className="text-sm text-gray-600">為您的帳戶增加額外的安全保護</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">簡訊驗證</p>
              <p className="text-sm text-gray-600">透過手機簡訊接收驗證碼</p>
            </div>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              啟用
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">驗證器 App</p>
              <p className="text-sm text-gray-600">使用 Google Authenticator 或其他驗證器</p>
            </div>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              設定
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <p className="font-medium mb-1">安全建議</p>
        <ul className="list-disc list-inside space-y-1">
          <li>使用至少 10 個字元的強密碼</li>
          <li>不要在多個網站使用相同密碼</li>
          <li>定期更新密碼（建議每 3-6 個月）</li>
          <li>啟用雙重驗證以提升安全性</li>
        </ul>
      </div>
    </div>
  );
}
