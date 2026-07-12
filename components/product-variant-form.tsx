"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { addToCart } from "@/lib/data/cart";
import { formatPrice } from "@/lib/format-price";
import { Button } from "@/components/ui/button";
import type { HttpTypes } from "@medusajs/types";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="lg"
      disabled={disabled || pending}
      className="w-full bg-deep text-white hover:bg-deep/90"
    >
      {pending ? "Adding..." : disabled ? "Select options" : "Add to Cart"}
    </Button>
  );
}

export function ProductVariantForm({
  product,
}: {
  product: HttpTypes.StoreProduct;
}) {
  const options = product.options ?? [];
  const [selected, setSelected] = useState<Record<string, string>>({});

  const variant = useMemo(() => {
    return product.variants?.find((v) =>
      v.options?.every((o) => selected[o.option_id!] === o.value)
    );
  }, [product.variants, selected]);

  const price = variant?.calculated_price;

  return (
    <form action={addToCart} className="mt-8 space-y-6">
      <input type="hidden" name="variant_id" value={variant?.id ?? ""} />
      <input type="hidden" name="quantity" value={1} />

      {options.map((option) => (
        <fieldset key={option.id}>
          <legend className="text-sm font-medium text-ink">
            {option.title}
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {option.values?.map((v) => {
              const isActive = selected[option.id] === v.value;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [option.id]: v.value }))
                  }
                  className={`rounded-full border px-4 py-2 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${
                    isActive
                      ? "border-signal bg-signal text-white"
                      : "border-silver text-ink hover:border-graphite"
                  }`}
                  aria-pressed={isActive}
                >
                  {v.value}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {price && (
        <p className="text-2xl font-medium text-ink">
          {formatPrice(price.calculated_amount!, price.currency_code!)}
        </p>
      )}

      <SubmitButton disabled={!variant} />
    </form>
  );
}
