import { sdk } from "@/lib/medusa";
import { getRegion } from "@/lib/data/regions";

export async function listProducts(query?: string, categoryHandle?: string) {
  const region = await getRegion();

  let categoryId: string | undefined;
  if (categoryHandle) {
    const { product_categories } = await sdk.store.category.list({
      handle: categoryHandle,
    });
    categoryId = product_categories[0]?.id;
    // Category doesn't exist (or has no products yet): no matches, not an error.
    if (!categoryId) return [];
  }

  const { products } = await sdk.store.product.list({
    region_id: region.id,
    q: query,
    category_id: categoryId ? [categoryId] : undefined,
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
