"use client";

import { CreditCard } from "lucide-react";
import { VisaIcon } from "./VisaIcon";
import { MastercardIcon } from "./MastercardIcon";
import { AmexIcon } from "./AmexIcon";
import { DiscoverIcon } from "./DiscoverIcon";
import { JcbIcon } from "./JcbIcon";

interface CardPreviewProps {
  brand: string;
  last4: string;
  expMonth: string;
  expYear: string;
  cardName: string;
}

export function CardPreview({
  brand,
  last4,
  expMonth,
  expYear,
  cardName,
}: CardPreviewProps) {
  const normalizedBrand = brand?.toLowerCase() ?? "";

  const getBrandGradient = (b: string) => {
    switch (b) {
      case "visa":
        return "from-blue-600 via-blue-700 to-blue-900";
      case "mastercard":
        return "from-gray-800 via-gray-900 to-black";
      case "amex":
        return "from-emerald-500 to-teal-700";
      case "jcb":
        return "from-green-500 to-green-700";
      case "discover":
        return "from-orange-400 to-orange-600";
      default:
        return "from-gray-700 to-gray-900";
    }
  };

  const renderBrandIcon = () => {
    const iconClass = "h-7 w-auto opacity-90 transition-all duration-300 animate-in fade-in drop-shadow-sm";
    
    switch (normalizedBrand) {
      case "visa":
        return <VisaIcon className={iconClass} />;
      case "mastercard":
        return <MastercardIcon className={iconClass} />;
      case "amex":
        return <AmexIcon className={iconClass} />;
      case "discover":
        return <DiscoverIcon className={iconClass} />;
      case "jcb":
        return <JcbIcon className={iconClass} />;
      default:
        return (
          <span className="text-sm font-extrabold uppercase tracking-widest opacity-60">
            {(!brand || brand.toLowerCase() === "unknown") ? "" : brand}
          </span>
        );
    }
  };

  return (
    <div className="relative mb-8 w-full">
      <div
        className={`relative w-full rounded-2xl bg-gradient-to-br ${getBrandGradient(
          normalizedBrand
        )} p-6 text-white shadow-2xl transition-all duration-500 ease-out transform hover:scale-[1.02] aspect-[1.586/1] flex flex-col justify-between overflow-hidden`}
      >
        {/* Decorative background circles for depth */}
        <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/5 pointer-events-none" />

        {/* Top bar: Bank label (left) + Brand icon (right) */}
        <div className="flex justify-between items-start">
          <span className="text-sm font-bold uppercase tracking-[0.2em] opacity-80">
            BANK
          </span>
          <div className="h-7 flex items-center">
            {renderBrandIcon()}
          </div>
        </div>

        {/* Card Chip area */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-12 rounded-md bg-gradient-to-br from-yellow-100 via-yellow-400 to-yellow-600 opacity-90 shadow-inner" />
          <div className="opacity-40">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M2 9h20M2 15h20M9 2v20M15 2v20" />
            </svg>
          </div>
        </div>

        {/* Card Number */}
        <div>
          <p className="text-xl font-mono tracking-[0.2em] drop-shadow-md">
            •••• •••• •••• {last4 || "••••"}
          </p>
        </div>

        {/* Card Bottom: Holder + Expiry */}
        <div className="flex justify-between items-end">
          <div className="space-y-0.5 max-w-[65%]">
            <p className="text-[10px] uppercase tracking-tighter opacity-60">
              Card Holder
            </p>
            <p className="truncate text-sm font-semibold tracking-wider uppercase">
              {cardName || "JOHN DOE"}
            </p>
          </div>
          <div className="space-y-0.5 text-right">
            <p className="text-[10px] uppercase tracking-tighter opacity-60">
              Expires
            </p>
            <p className="text-sm font-semibold tracking-wider">
              {expMonth || "MM"}/{expYear || "YY"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
