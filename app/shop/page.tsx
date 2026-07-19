import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/format-price";
import { WishlistButton } from "@/components/wishlist-button";

const CATEGORY_LABELS: Record<string, string> = {
  men: "Men",
  women: "Women",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const products = await listProducts(q, category);
  const categoryLabel = category ? CATEGORY_LABELS[category] ?? category : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-4xl font-medium tracking-tight text-ink">
        {q ? `Results for "${q}"` : categoryLabel ?? "Shop"}
      </h1>
      {q && products.length === 0 && (
        <p className="mt-4 text-graphite">
          No products matched. Try a different search, or{" "}
          <Link href="/shop" className="text-signal hover:underline">
            browse the full collection
          </Link>
          .
        </p>
      )}
      {!q && category && products.length === 0 && (
        <p className="mt-4 text-graphite">
          Nothing in {categoryLabel} yet, check back soon, or{" "}
          <Link href="/shop" className="text-signal hover:underline">
            browse the full collection
          </Link>
          .
        </p>
      )}

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const prices = product.variants
            ?.map((v) => v.calculated_price?.calculated_amount)
            .filter((p): p is number => typeof p === "number");
          const currencyCode =
            product.variants?.[0]?.calculated_price?.currency_code ?? "usd";
          const minPrice = prices?.length ? Math.min(...prices) : null;
          const maxPrice = prices?.length ? Math.max(...prices) : null;

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
                <h2 className="mt-4 text-sm font-medium text-ink">
                  {product.title}
                </h2>
                {minPrice !== null && (
                  <p className="mt-1 text-sm text-graphite">
                    {minPrice === maxPrice
                      ? formatPrice(minPrice, currencyCode)
                      : `From ${formatPrice(minPrice, currencyCode)}`}
                  </p>
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
    </div>
  );
}
