"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/format-price";
import { buttonVariants } from "@/components/ui/button";
import { WishlistButton } from "@/components/wishlist-button";
import { useWishlist } from "@/lib/use-wishlist";
import type { HttpTypes } from "@medusajs/types";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<HttpTypes.StoreProduct[] | null>(null);

  useEffect(() => {
    listProducts().then(setProducts);
  }, []);

  const saved = products?.filter((p) => ids.includes(p.id)) ?? [];
  const loading = products === null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Wishlist
      </h1>

      {!loading && saved.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-graphite">
            Nothing saved yet. Tap the heart on any product to add it here.
          </p>
          <Link
            href="/shop"
            className={buttonVariants({ size: "lg", className: "mt-8 bg-deep text-white hover:bg-deep/90" })}
          >
            Shop Now
          </Link>
        </div>
      )}

      {saved.length > 0 && (
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((product) => {
            const prices = product.variants
              ?.map((v) => v.calculated_price?.calculated_amount)
              .filter((p): p is number => typeof p === "number");
            const currencyCode =
              product.variants?.[0]?.calculated_price?.currency_code ?? "usd";
            const minPrice = prices?.length ? Math.min(...prices) : null;

            return (
              <div key={product.id} className="group relative">
                <Link href={`/shop/${product.handle}`} className="block">
                  <div className="aspect-square w-full overflow-hidden bg-ink/5 flex items-center justify-center">
                    {product.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.thumbnail}
                        alt={product.title ?? ""}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <span className="text-sm text-graphite/50">
                        Photography coming soon
                      </span>
                    )}
                  </div>
                  <h2 className="mt-4 text-sm font-medium text-ink">{product.title}</h2>
                  {minPrice !== null && (
                    <p className="mt-1 text-sm text-graphite">{formatPrice(minPrice, currencyCode)}</p>
                  )}
                </Link>
                <WishlistButton
                  productId={product.id}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow [&_svg]:h-4 [&_svg]:w-4"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
