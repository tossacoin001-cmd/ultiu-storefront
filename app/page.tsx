import Link from "next/link";
import { Hero } from "@/components/hero";
import { listProducts } from "@/lib/data/products";
import { formatPrice } from "@/lib/format-price";
import { WishlistButton } from "@/components/wishlist-button";

export default async function Home() {
  const products = await listProducts();

  return (
    <>
      <Hero />

      <section className="bg-paper px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-baseline justify-between">
            <h2 className="font-headline text-2xl font-medium tracking-tight text-ink">
              The Collection
            </h2>
            <Link href="/shop" className="text-sm text-graphite hover:text-signal">
              Shop all
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const prices = product.variants
                ?.map((v) => v.calculated_price?.calculated_amount)
                .filter((p): p is number => typeof p === "number");
              const currencyCode =
                product.variants?.[0]?.calculated_price?.currency_code ?? "usd";
              const minPrice = prices?.length ? Math.min(...prices) : null;

              return (
                <div key={product.id} className="group relative">
                  <Link href={`/shop/${product.handle}`} className="block">
                    <div className="flex aspect-square w-full items-center justify-center overflow-hidden bg-ink/5">
                      {product.thumbnail ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.thumbnail}
                          alt={product.title ?? ""}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <span className="text-sm text-graphite/50">Photography coming soon</span>
                      )}
                    </div>
                    <h3 className="mt-4 text-sm font-medium text-ink">{product.title}</h3>
                    {minPrice !== null && (
                      <p className="mt-1 text-sm text-graphite">
                        From {formatPrice(minPrice, currencyCode)}
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
      </section>
    </>
  );
}
