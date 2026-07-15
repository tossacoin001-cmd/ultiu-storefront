"use client";

const STORAGE_KEY = "ultiu_wishlist";
const EVENT_NAME = "ultiu-wishlist-changed";

function readWishlist(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeWishlist(ids: string[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function getWishlist(): string[] {
  return readWishlist();
}

/** Returns the new state (true = now saved) so callers can update UI immediately. */
export function toggleWishlist(productId: string): boolean {
  const current = readWishlist();
  const exists = current.includes(productId);
  writeWishlist(exists ? current.filter((id) => id !== productId) : [...current, productId]);
  return !exists;
}

export function subscribeWishlist(callback: () => void) {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}
