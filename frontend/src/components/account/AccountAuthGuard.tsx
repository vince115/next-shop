//frontend/src/components/account/AccountAuthGuard.tsx
"use client";

import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLoginModal } from "@/context/LoginModalContext";

interface AccountAuthGuardProps {
  children: ReactNode;
}

export default function AccountAuthGuard({ children }: AccountAuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const { openModal } = useLoginModal();

  if (isLoading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-300 border-r-transparent" />
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/60 p-8 text-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">請先登入</h1>
        <p className="text-gray-600">登入後即可使用帳戶中心功能</p>
        <button
          type="button"
          onClick={openModal}
          className="mt-6 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
        >
          立即登入
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
