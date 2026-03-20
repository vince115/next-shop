//frontend/src/components/checkout/InvoiceSelector.tsx
"use client";

import { useMemo, useState } from "react";
import CheckoutModal from "./CheckoutModal";

export interface InvoiceOption {
  id: InvoiceType;
  label: string;
  description: string;
  helper?: string;
}

export type InvoiceType = "member" | "mobile" | "citizen" | "company" | "donation";

export interface InvoiceData {
  type: InvoiceType;
  mobileCode?: string;
  citizenCode?: string;
  companyTaxId?: string;
  companyName?: string;
  email?: string;
  donationCode?: string;
}

interface InvoiceSelectorProps {
  options: InvoiceOption[];
  value: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const donationOptions = [
  { id: "00001", name: "社團法人世界和平會" },
  { id: "00002", name: "國際創新發明聯盟總會" },
  { id: "00003", name: "社團法人彰化縣私立博愛服務中心" },
];

export default function InvoiceSelector({ options, value, onChange }: InvoiceSelectorProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<InvoiceData>(value);
  const [donationModal, setDonationModal] = useState(false);
  const [donationFilter, setDonationFilter] = useState("");

  const currentOption = options.find((opt) => opt.id === value.type);
  const filteredDonation = useMemo(() => {
    if (!donationFilter) return donationOptions;
    return donationOptions.filter((opt) => opt.name.includes(donationFilter) || opt.id.includes(donationFilter));
  }, [donationFilter]);

  function resetPending(newType: InvoiceType) {
    setPending({ type: newType });
  }

  function handleConfirm() {
    onChange(pending);
    setOpen(false);
  }

  const isValid = useMemo(() => {
    switch (pending.type) {
      case "mobile":
        return Boolean(pending.mobileCode && pending.mobileCode.length >= 8 && pending.mobileCode.startsWith("/"));
      case "citizen":
        return Boolean(pending.citizenCode && pending.citizenCode.length === 16);
      case "company":
        return Boolean(pending.companyTaxId && pending.companyName && pending.email);
      case "donation":
        return Boolean(pending.donationCode);
      default:
        return true;
    }
  }, [pending]);

  function renderSummary() {
    switch (value.type) {
      case "mobile":
        return `手機條碼：${value.mobileCode ?? "未填寫"}`;
      case "citizen":
        return `自然人憑證：${value.citizenCode ?? "未填寫"}`;
      case "company":
        return `公司發票 · 統編 ${value.companyTaxId ?? "—"}`;
      case "donation":
        return `捐贈發票 · ${value.donationCode ?? "未選擇"}`;
      default:
        return "會員載具";
    }
  }

  return (
    <section className="space-y-4 border-b border-gray-100 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">
          發票資料 <span className="text-rose-500">*</span>
        </h2>
        <button
          type="button"
          onClick={() => {
            setPending(value);
            setOpen(true);
          }}
          className="text-sm font-medium text-gray-500 underline decoration-dotted underline-offset-4"
        >
          變更
        </button>
      </div>

      <div className="rounded-2xl border border-gray-200 px-4 py-3">
        <p className="text-sm font-semibold text-gray-900">{currentOption?.label ?? "會員載具"}</p>
        <p className="text-xs text-gray-500">{renderSummary()}</p>
      </div>

      <CheckoutModal
        open={open}
        title="選擇發票開立方式"
        onClose={() => setOpen(false)}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              取消
            </button>
            <button
              type="button"
              disabled={!isValid}
              onClick={handleConfirm}
              className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              確認
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {options.map((option) => {
            const active = pending.type === option.id;
            const radioId = `invoice-${option.id}`;

            return (
              <div
                key={option.id}
                className={`rounded-2xl border px-5 py-5 transition ${active ? "border-gray-900 bg-gray-50" : "border-gray-200"}`}
              >
                <label htmlFor={radioId} className="flex cursor-pointer items-center gap-3">
                  <input
                    id={radioId}
                    type="radio"
                    name="invoice"
                    className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                    checked={active}
                    onChange={() => resetPending(option.id)}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{option.label}</p>
                    <p className="text-xs text-gray-500">{option.description}</p>
                    {option.helper && <p className="text-xs text-gray-400">{option.helper}</p>}
                  </div>
                </label>

                {active && (
                  <div className="mt-4 border-l border-gray-200 pl-7">
                    <InvoiceFields
                      data={pending}
                      onChange={setPending}
                      onOpenDonation={() => setDonationModal(true)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CheckoutModal>

      <DonationModal
        open={donationModal}
        onClose={() => setDonationModal(false)}
        options={filteredDonation}
        value={pending.donationCode}
        onChange={(code) => {
          setPending((prev) => ({ ...prev, donationCode: code }));
          setDonationModal(false);
        }}
        filter={donationFilter}
        onFilterChange={setDonationFilter}
      />
    </section>
  );
}

interface InvoiceFieldsProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onOpenDonation: () => void;
}

function InvoiceFields({ data, onChange, onOpenDonation }: InvoiceFieldsProps) {
  function update(partial: Partial<InvoiceData>) {
    onChange({ ...data, ...partial });
  }

  switch (data.type) {
    case "mobile":
      return (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-500">手機條碼</label>
          <input
            value={data.mobileCode ?? ""}
            onChange={(e) => update({ mobileCode: e.target.value })}
            placeholder="輸入 “/” 開頭 8 碼"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      );
    case "citizen":
      return (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-500">自然人憑證</label>
          <input
            value={data.citizenCode ?? ""}
            onChange={(e) => update({ citizenCode: e.target.value })}
            placeholder="輸入 16 碼卡號"
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      );
    case "company":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500">統一編號</label>
            <input
              value={data.companyTaxId ?? ""}
              onChange={(e) => update({ companyTaxId: e.target.value })}
              placeholder="請輸入統一編號"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500">發票抬頭</label>
            <input
              value={data.companyName ?? ""}
              onChange={(e) => update({ companyName: e.target.value })}
              placeholder="請輸入公司抬頭"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-medium text-gray-500">發票 Email</label>
            <input
              value={data.email ?? ""}
              onChange={(e) => update({ email: e.target.value })}
              placeholder="請輸入接收 Email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>
        </div>
      );
    case "donation":
      return (
        <div className="space-y-3">
          <label className="block text-xs font-medium text-gray-500">捐贈碼</label>
          {data.donationCode ? (
            <p className="text-sm text-gray-900">已選擇：{data.donationCode}</p>
          ) : (
            <p className="text-xs text-gray-500">尚未選擇社福團體</p>
          )}
          <button
            type="button"
            onClick={onOpenDonation}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:border-gray-900"
          >
            選擇社福團體
          </button>
        </div>
      );
    default:
      return (
        <p className="text-xs text-gray-500">發票將綁定會員載具並以 Email 通知</p>
      );
  }
}

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  options: { id: string; name: string }[];
  value?: string;
  onChange: (code: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
}

function DonationModal({ open, onClose, options, value, onChange, filter, onFilterChange }: DonationModalProps) {
  return (
    <CheckoutModal
      open={open}
      title="選擇社福團體"
      onClose={onClose}
      size="lg"
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
            disabled={!value}
            onClick={onClose}
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            確認
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <input
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder="輸入社福代碼或關鍵字"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
        />
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {options.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-3 py-3">
              <input
                type="radio"
                name="donation"
                className="h-4 w-4 border-gray-300 text-gray-900 focus:ring-gray-900"
                checked={value === option.id}
                onChange={() => onChange(option.id)}
              />
              <div>
                <p className="text-sm font-medium text-gray-900">{option.name}</p>
                <p className="text-xs text-gray-500">代碼 {option.id}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </CheckoutModal>
  );
}
