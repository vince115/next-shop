"use client";
import { UserProfile } from "@/lib/userApi";
import { User, Mail, Phone, Shield } from "lucide-react";

interface ProfileSectionProps {
  profile: UserProfile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">個人資料</h2>
        <button
          type="button"
          disabled
          className="px-4 py-2 text-sm font-medium text-gray-400 bg-gray-50 rounded-lg cursor-not-allowed"
        >
          編輯資料
        </button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start space-x-3">
          <div className="mt-1 text-gray-400">
            <Mail size={18} />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-base text-gray-900">{profile.email}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-3">
          <div className="mt-1 text-gray-400">
            <User size={18} />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500">姓名</label>
            <p className="text-base text-gray-900">{profile.name}</p>
          </div>
        </div>
        
        {profile.phone && (
          <div className="flex items-start space-x-3">
            <div className="mt-1 text-gray-400">
              <Phone size={18} />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-500">電話</label>
              <p className="text-base text-gray-900">{profile.phone}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start space-x-3">
          <div className="mt-1 text-gray-400">
            <Shield size={18} />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-500">角色</label>
            <p className="text-base text-gray-900 capitalize">{profile.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
