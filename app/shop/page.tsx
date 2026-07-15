import Link from "next/link";
import { listProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/format-price";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await listProducts(q);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="font-headline text-4xl font-medium tracking-tight text-ink">
        {q ? `Results for "${q}"` : "Shop"}
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
            <Link
              key={product.id}
              href={`/shop/${product.handle}`}
              className="group block"
            >
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
          );
        })}
      </div>
    </div>
  );
}
