//frontend/src/components/checkout/ShippingSelector.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import CheckoutModal from "./CheckoutModal";

export interface ShippingOption {
  id: string;
  label: string;
  description: string;
  price: number;
  badge?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  city: string;
  district: string;
  address: string;
}

interface ShippingSelectorProps {
  options: ShippingOption[];
  selected?: ShippingOption;
  address?: ShippingAddress;
  onChange: (option: ShippingOption) => void;
  onAddressChange?: (address: ShippingAddress) => void;
}

export default function ShippingSelector({ options, selected, address, onChange, onAddressChange }: ShippingSelectorProps) {
  const [optionModalOpen, setOptionModalOpen] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [pendingId, setPendingId] = useState(selected?.id ?? options[0]?.id);

  const requiresAddress = useMemo(() => selected?.id === "standard", [selected]);

  function handleConfirmOption() {
    const next = options.find((opt) => opt.id === pendingId) ?? options[0];
    if (next) {
      onChange(next);
      setOptionModalOpen(false);
      if (next.id === "standard" && !address) {
        setAddressModalOpen(true);
      }
    }
  }

  function handleAddressSave(value: ShippingAddress) {
    onAddressChange?.(value);
    setAddressModalOpen(false);
  }

  function maskPhone(value: string) {
    if (!value) return "";
    if (value.length <= 4) return value;
    const head = value.slice(0, 4);
    const tail = value.slice(-2);
    return `${head}****${tail}`;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          運送方式 <span className="text-rose-500">*</span>
        </h2>
        {selected && (
          <button
            type="button"
            onClick={() => setOptionModalOpen(true)}
            className="text-sm font-medium text-gray-500 underline decoration-dotted underline-offset-4"
          >
            變更
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => setOptionModalOpen(true)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700 transition hover:border-gray-900"
      >
        {selected ? (
          <span>
            <span className="font-semibold text-gray-900">{selected.label}</span>
            <span className="ml-2 text-xs text-gray-500">{selected.description}</span>
          </span>
        ) : (
          <span className="text-gray-500">選擇運送方式</span>
        )}
        <span className="text-sm font-semibold text-gray-900">
          {selected ? (selected.price === 0 ? "免運" : `NT$${selected.price}`) : "設定"}
        </span>
      </button>

      {selected?.id === "standard" && (
        <div className="rounded-lg border border-gray-200 px-4 py-3">
          {address ? (
            <div className="space-y-1 text-sm text-gray-700">
              <p className="font-semibold text-gray-900">{address.name}</p>
              <p>{maskPhone(address.phone)}</p>
              <p>{`${address.city}${address.district}${address.address}`}</p>
              <button
                type="button"
                onClick={() => setAddressModalOpen(true)}
                className="text-xs font-medium text-gray-500 underline underline-offset-4 hover:text-gray-900"
              >
                變更地址
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddressModalOpen(true)}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              填寫收件地址
            </button>
          )}
        </div>
      )}

      <CheckoutModal
        open={optionModalOpen}
        title="選擇運送方式"
        onClose={() => setOptionModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOptionModalOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleConfirmOption}
              className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              確認
            </button>
          </div>
        }
      >
        <div className="space-y-3">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border border-gray-200 px-4 py-4 hover:border-gray-900"
            >
              <input
                type="radio"
                name="shipping"
                className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                checked={pendingId === option.id}
                onChange={() => setPendingId(option.id)}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                  {option.badge && (
                    <span className="rounded-full bg-rose-50 px-2 py-0.5 text-xs text-rose-500">
                      {option.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{option.description}</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {option.price === 0 ? "免運" : `NT$${option.price}`}
              </p>
            </label>
          ))}
        </div>
      </CheckoutModal>

      <ShippingAddressModal
        open={addressModalOpen}
        initial={address}
        onClose={() => setAddressModalOpen(false)}
        onSave={handleAddressSave}
      />
    </section>
  );
}

interface ShippingAddressModalProps {
  open: boolean;
  initial?: ShippingAddress;
  onClose: () => void;
  onSave: (address: ShippingAddress) => void;
}

function ShippingAddressModal({ open, initial, onClose, onSave }: ShippingAddressModalProps) {
  const [form, setForm] = useState<ShippingAddress>(
    initial ?? { name: "", phone: "", city: "", district: "", address: "" }
  );

  useEffect(() => {
    if (open) {
      setForm(initial ?? { name: "", phone: "", city: "", district: "", address: "" });
    }
  }, [open, initial]);

  const isValid = form.name && form.phone && form.city && form.district && form.address;

  function updateField(key: keyof ShippingAddress, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <CheckoutModal
      open={open}
      title="新增地址"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            取消
          </button>
          <button
            type="button"
            disabled={!isValid}
            onClick={() => onSave(form)}
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            確認
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-sm text-gray-700">
        <div>
          <label className="mb-1 block font-medium">收件人姓名</label>
          <input
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="請輸入真實姓名"
          />
        </div>
        <div>
          <label className="mb-1 block font-medium">電話</label>
          <input
            value={form.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="請輸入手機"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block font-medium">縣市</label>
            <input
              value={form.city}
              onChange={(event) => updateField("city", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="台北市"
            />
          </div>
          <div>
            <label className="mb-1 block font-medium">地區</label>
            <input
              value={form.district}
              onChange={(event) => updateField("district", event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="信義區"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block font-medium">地址</label>
          <input
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            placeholder="松仁路 100 號"
          />
        </div>
      </div>
    </CheckoutModal>
  );
}
