//frontend/src/app/account/addresses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star, X, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Address {
  id: number;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<Address[]>("/api/user-addresses");
      console.log("addresses:", data); // Requested debug log
      setAddresses(data ?? []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (address: Address) => {
    try {
      await apiFetch(`/api/user-addresses/${address.id}`, {
        method: "PUT",
        body: JSON.stringify({ ...address, is_default: true }),
      });
      fetchAddresses();
    } catch (error) {
      console.error("Failed to set default address:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("確定要刪除此地址嗎？")) return;
    try {
      await apiFetch(`/api/user-addresses/${id}`, { method: "DELETE" });
      fetchAddresses();
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      address_line1: formData.get("address_line1") as string,
      address_line2: formData.get("address_line2") as string,
      city: formData.get("city") as string,
      postal_code: formData.get("postal_code") as string,
      country: formData.get("country") as string,
      is_default: formData.get("is_default") === "on",
    };

    try {
      if (editingAddress) {
        await apiFetch(`/api/user-addresses/${editingAddress.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch("/api/user-addresses", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      setShowModal(false);
      setEditingAddress(null);
      fetchAddresses();
    } catch (error) {
      console.error("Failed to save address:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setShowModal(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Addresses</p>
          <h1 className="text-3xl font-bold text-gray-900">收件地址</h1>
          <p className="mt-2 text-gray-600">管理您的收件地址</p>
        </div>
        {/* Header button ALWAYS visible */}
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="h-4 w-4" />
          新增地址
        </button>
      </div>

      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center">
            <MapPin className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-4 text-lg font-semibold text-gray-900">尚未新增地址</h3>
            <p className="mt-2 text-sm text-gray-600">新增您的第一個收件地址</p>
            {/* Empty state button ONLY when no data */}
            <button
              type="button"
              onClick={openAddModal}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              <Plus className="h-4 w-4" />
              新增地址
            </button>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
                address.is_default ? "border-gray-900 ring-1 ring-gray-900" : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
                    {address.is_default && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                        <Star className="h-3 w-3 fill-current" />
                        預設地址
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {address.city} {address.postal_code}, {address.country}
                    </p>
                    <p className="ml-6">
                      {address.address_line1} {address.address_line2 && `(${address.address_line2})`}
                    </p>
                    <p className="ml-6">聯絡電話：{address.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => openEditModal(address)}
                    className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    aria-label="編輯地址"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-50"
                    aria-label="刪除地址"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {!address.is_default && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address)}
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    設為預設地址
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {addresses.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          預設地址將自動套用至結帳流程，您可隨時變更。
        </div>
      )}

      {/* Address Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAddress ? "編輯地址" : "新增地址"}
              </h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">收件人姓名</label>
                  <input
                    name="name"
                    required
                    placeholder="請填寫收件人姓名"
                    defaultValue={editingAddress?.name}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">聯絡電話</label>
                  <input
                    name="phone"
                    required
                    defaultValue={editingAddress?.phone}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">地址（街道）</label>
                <input
                  name="address_line1"
                  required
                  defaultValue={editingAddress?.address_line1}
                  placeholder="街道、巷口、門牌"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">地址補充（樓層、門牌）</label>
                <input
                  name="address_line2"
                  defaultValue={editingAddress?.address_line2}
                  placeholder="樓層、房號"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">城市</label>
                  <input
                    name="city"
                    required
                    defaultValue={editingAddress?.city}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">郵遞區號</label>
                  <input
                    name="postal_code"
                    required
                    defaultValue={editingAddress?.postal_code}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">國家</label>
                <input
                  name="country"
                  required
                  defaultValue={editingAddress?.country ?? "Taiwan"}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:border-gray-900 focus:ring-gray-900"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  name="is_default"
                  defaultChecked={editingAddress?.is_default}
                  className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                />
                <label htmlFor="is_default" className="text-sm text-gray-700">
                  設為預設地址
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {submitting ? "儲存中..." : "確認儲存"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
