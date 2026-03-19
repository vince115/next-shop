//frontend/src/app/account/addresses/page.tsx
"use client";

import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, Star } from "lucide-react";

interface Address {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: 1,
    name: "王小明",
    phone: "0912-345-678",
    address: "中正區忠孝東路一段100號5樓",
    city: "台北市",
    postalCode: "100",
    isDefault: true,
  },
  {
    id: 2,
    name: "王小明",
    phone: "0912-345-678",
    address: "信義區信義路五段7號",
    city: "台北市",
    postalCode: "110",
    isDefault: false,
  },
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const handleDelete = (id: number) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500">Addresses</p>
          <h1 className="text-3xl font-bold text-gray-900">收件地址</h1>
          <p className="mt-2 text-gray-600">管理您的收件地址</p>
        </div>
        <button
          type="button"
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
            <button
              type="button"
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
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{address.name}</h3>
                    {address.isDefault && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700">
                        <Star className="h-3 w-3 fill-current" />
                        預設地址
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm text-gray-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {address.city} {address.postalCode}
                    </p>
                    <p className="ml-6">{address.address}</p>
                    <p className="ml-6">電話：{address.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    aria-label="編輯地址"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(address.id)}
                    disabled={address.isDefault}
                    className="rounded-xl border border-gray-200 p-2 text-gray-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200"
                    aria-label="刪除地址"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {!address.isDefault && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
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
    </div>
  );
}
