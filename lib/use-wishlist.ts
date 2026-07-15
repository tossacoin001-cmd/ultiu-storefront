"use client";

import { useEffect, useState, useCallback } from "react";
import { getWishlist, subscribeWishlist, toggleWishlist } from "@/lib/wishlist";

export function useWishlist() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(getWishlist());
    return subscribeWishlist(() => setIds(getWishlist()));
  }, []);

  const toggle = useCallback((productId: string) => {
    toggleWishlist(productId);
  }, []);

  return { ids, toggle };
}
