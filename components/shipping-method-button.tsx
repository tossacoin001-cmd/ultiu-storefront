"use client";

import { useFormStatus } from "react-dom";
import { formatPrice } from "@/lib/format-price";

export function ShippingMethodButton({
  name,
  amount,
  currencyCode,
  selected,
}: {
  name: string;
  amount: number;
  currencyCode: string;
  selected: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex w-full items-center justify-between rounded border px-4 py-3 text-left text-sm transition-colors disabled:cursor-wait disabled:opacity-60 ${
        selected ? "border-signal bg-signal/5" : "border-silver"
      }`}
    >
      <span>{pending ? "Selecting…" : name}</span>
      <span>{formatPrice(amount, currencyCode)}</span>
    </button>
  );
}
