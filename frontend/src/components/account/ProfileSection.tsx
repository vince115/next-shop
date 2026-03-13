"use client";
import { UserProfile } from "@/lib/userApi";

interface ProfileSectionProps {
  profile: UserProfile;
}

export default function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile</h2>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-500">Email</label>
          <p className="text-base text-gray-900">{profile.email}</p>
        </div>
        
        <div>
          <label className="text-sm font-medium text-gray-500">Name</label>
          <p className="text-base text-gray-900">{profile.name}</p>
        </div>
        
        {profile.phone && (
          <div>
            <label className="text-sm font-medium text-gray-500">Phone</label>
            <p className="text-base text-gray-900">{profile.phone}</p>
          </div>
        )}
        
        <div>
          <label className="text-sm font-medium text-gray-500">Role</label>
          <p className="text-base text-gray-900 capitalize">{profile.role}</p>
        </div>
      </div>
    </section>
  );
}
