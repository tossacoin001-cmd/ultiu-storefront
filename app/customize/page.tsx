import { notFound } from "next/navigation";
import { sdk } from "@/lib/medusa";
import { getRegion } from "@/lib/data/regions";
import { Customizer } from "@/components/customizer/customizer";

export default async function CustomizePage() {
  const region = await getRegion();
  const { products } = await sdk.store.product.list({
    handle: "pickleball-paddle",
    region_id: region.id,
    fields: "id,title,*variants,*variants.options,*variants.calculated_price",
  });

  const product = products[0];
  if (!product) notFound();

  const findVariant = (configuration: string) => {
    const variant = product.variants?.find((v) =>
      v.options?.some((o) => o.value === configuration)
    );
    if (!variant) throw new Error(`Missing "${configuration}" variant on the paddle product`);
    return { id: variant.id, price: variant.calculated_price?.calculated_amount ?? 0 };
  };

  const tierVariants = {
    base: findVariant("Base"),
    custom: findVariant("Custom"),
    premium: findVariant("Premium"),
  };

  return (
    <div className="bg-paper px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-headline text-4xl tracking-tight text-ink">
          Design your paddle
        </h1>
        <p className="mt-2 max-w-xl text-graphite">
          Colors, a mark from the ULTIU library or your own upload, and your name on the
          face. Watch it update live.
        </p>

        <div className="mt-10">
          <Customizer tierVariants={tierVariants} currencyCode={region.currency_code} />
        </div>
      </div>
    </div>
  );
}
