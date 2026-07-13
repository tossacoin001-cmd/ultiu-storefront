"use server";

import { revalidatePath } from "next/cache";
import { sdk } from "@/lib/medusa";
import { retrieveCart } from "@/lib/data/cart";
import { getRegion } from "@/lib/data/regions";
import type { PaddleSelections, PricingTier } from "@/lib/customizer-config";

export type AddCustomPaddleInput = {
  variantId: string;
  tier: PricingTier;
  selections: PaddleSelections;
  proofDataUrl: string;
};

async function getOrCreateCart() {
  const existing = await retrieveCart();
  if (existing) return existing;

  const region = await getRegion();
  const { cart } = await sdk.store.cart.create({ region_id: region.id });

  const { cookies } = await import("next/headers");
  (await cookies()).set("ultiu_cart_id", cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return cart;
}

export async function addCustomPaddleToCart(input: AddCustomPaddleInput) {
  const cart = await getOrCreateCart();
  const { selections, tier, proofDataUrl, variantId } = input;

  await sdk.store.cart.createLineItem(cart.id, {
    variant_id: variantId,
    quantity: 1,
    metadata: {
      customizer: {
        tier,
        edge_color: selections.edgeColor,
        face_color: selections.faceColor,
        grip_color: selections.gripColor,
        graphic_id: selections.graphicId,
        uploaded_graphic_url: selections.uploadedGraphicUrl,
        text: selections.text,
        text_color: selections.textColor,
        proof_image: proofDataUrl,
        requires_approval: Boolean(selections.uploadedGraphicUrl),
      },
    },
  });

  revalidatePath("/", "layout");
}
