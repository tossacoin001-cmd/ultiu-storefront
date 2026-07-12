import { sdk } from "@/lib/medusa";
import { getRegion } from "@/lib/data/regions";

export async function listProducts() {
  const region = await getRegion();
  const { products } = await sdk.store.product.list({
    region_id: region.id,
    fields: "*variants.calculated_price,*images,+variants.inventory_quantity",
  });
  return products;
}

export async function getProductByHandle(handle: string) {
  const region = await getRegion();
  const { products } = await sdk.store.product.list({
    handle,
    region_id: region.id,
    fields:
      "*variants.calculated_price,*images,*options,*options.values,+variants.inventory_quantity",
  });
  return products[0] ?? null;
}
