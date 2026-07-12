"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sdk } from "@/lib/medusa";
import { retrieveCart } from "@/lib/data/cart";

export async function updateCartDetails(formData: FormData) {
  const cart = await retrieveCart();
  if (!cart) return;

  const email = formData.get("email") as string;
  const shipping_address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    address_1: formData.get("address_1") as string,
    city: formData.get("city") as string,
    province: formData.get("province") as string,
    postal_code: formData.get("postal_code") as string,
    country_code: (formData.get("country_code") as string) || "us",
    phone: formData.get("phone") as string,
  };

  await sdk.store.cart.update(cart.id, {
    email,
    shipping_address,
    billing_address: shipping_address,
  });

  revalidatePath("/checkout");
}

export async function selectShippingMethod(formData: FormData) {
  const cart = await retrieveCart();
  if (!cart) return;

  const option_id = formData.get("option_id") as string;
  await sdk.store.cart.addShippingMethod(cart.id, { option_id });

  revalidatePath("/checkout");
}

export async function getStripeClientSecret() {
  const cart = await retrieveCart();
  if (!cart) return null;

  const existing = cart.payment_collection?.payment_sessions?.find(
    (s) => s.provider_id === "pp_stripe_stripe" && s.status !== "canceled"
  );
  if (existing) return (existing.data.client_secret as string) ?? null;

  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: "pp_stripe_stripe",
  });
  const session = payment_collection.payment_sessions?.find(
    (s) => s.provider_id === "pp_stripe_stripe"
  );
  return (session?.data.client_secret as string) ?? null;
}

export async function placeOrder() {
  const cart = await retrieveCart();
  if (!cart) return { error: "Cart not found" };

  const result = await sdk.store.cart.complete(cart.id);

  if (result.type === "order") {
    revalidatePath("/", "layout");
    redirect(`/order/${result.order.id}`);
  }

  return { error: result.error?.message ?? "Something went wrong placing the order." };
}
