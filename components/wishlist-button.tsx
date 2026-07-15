"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/use-wishlist";

export function WishlistButton({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { ids, toggle } = useWishlist();
  const active = ids.includes(productId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        toggle(productId);
      }}
      className={className}
    >
      <Heart
        className={active ? "fill-ember text-ember" : "text-graphite"}
        strokeWidth={1.75}
      />
    </button>
  );
}
