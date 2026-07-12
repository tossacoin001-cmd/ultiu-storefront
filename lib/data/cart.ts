"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { sdk } from "@/lib/medusa";
import { getRegion } from "@/lib/data/regions";

const CART_COOKIE = "ultiu_cart_id";

export async function retrieveCart() {
  const cartId = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartId) return null;

  try {
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields:
        "*items,*items.variant,*items.product,*region,*shipping_address,*shipping_methods,*payment_collection.payment_sessions,email,currency_code,item_subtotal,shipping_total,tax_total,total",
    });
    return cart;
  } catch {
    return null;
  }
}

async function getOrCreateCart() {
  const existing = await retrieveCart();
  if (existing) return existing;

  const region = await getRegion();
  const { cart } = await sdk.store.cart.create({ region_id: region.id });

  (await cookies()).set(CART_COOKIE, cart.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return cart;
}

export async function addToCart(formData: FormData) {
  const variantId = formData.get("variant_id") as string;
  const quantity = Number(formData.get("quantity") ?? 1);
  if (!variantId) throw new Error("Missing variant_id");

  const cart = await getOrCreateCart();
  await sdk.store.cart.createLineItem(cart.id, {
    variant_id: variantId,
    quantity,
  });

  revalidatePath("/", "layout");
}

export async function updateLineItem(formData: FormData) {
  const lineId = formData.get("line_id") as string;
  const quantity = Number(formData.get("quantity"));

  const cart = await retrieveCart();
  if (!cart) return;

  if (quantity < 1) {
    await sdk.store.cart.deleteLineItem(cart.id, lineId);
  } else {
    await sdk.store.cart.updateLineItem(cart.id, lineId, { quantity });
  }

  revalidatePath("/", "layout");
}

export async function removeLineItem(formData: FormData) {
  const lineId = formData.get("line_id") as string;
  const cart = await retrieveCart();
  if (!cart) return;

  await sdk.store.cart.deleteLineItem(cart.id, lineId);
  revalidatePath("/", "layout");
}
