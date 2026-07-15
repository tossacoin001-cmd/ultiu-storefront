import { notFound } from "next/navigation";
import { getProductByHandle } from "@/lib/data/products";
import { ProductVariantForm } from "@/components/product-variant-form";
import { WishlistButton } from "@/components/wishlist-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="relative aspect-square w-full bg-ink/5 flex items-center justify-center">
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.thumbnail}
              alt={product.title ?? ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-sm text-graphite/50">
              Photography coming soon
            </span>
          )}
          <WishlistButton
            productId={product.id}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow [&_svg]:h-5 [&_svg]:w-5"
          />
        </div>

        <div>
          <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
            {product.title}
          </h1>
          {product.description && (
            <p className="mt-4 text-graphite">{product.description}</p>
          )}
          <ProductVariantForm product={product} />
        </div>
      </div>
    </div>
  );
}
