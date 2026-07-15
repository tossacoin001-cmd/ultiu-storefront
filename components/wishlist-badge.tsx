"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/use-wishlist";

export function WishlistBadge() {
  const { ids } = useWishlist();

  return (
    <Link
      href="/wishlist"
      aria-label={`Wishlist, ${ids.length} item${ids.length === 1 ? "" : "s"}`}
      className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
    >
      <Heart className="h-5 w-5" strokeWidth={1.75} />
      {ids.length > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-medium text-white"
          aria-hidden
        >
          {ids.length}
        </span>
      )}
    </Link>
  );
}
