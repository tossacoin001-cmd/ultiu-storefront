import { cache } from "react";
import { sdk } from "@/lib/medusa";

export const getRegion = cache(async () => {
  const { regions } = await sdk.store.region.list();
  const us = regions.find((r) => r.countries?.some((c) => c.iso_2 === "us"));
  return us ?? regions[0];
});
