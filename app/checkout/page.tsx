import { Suspense } from "react";
import { redirect } from "next/navigation";
import { retrieveCart } from "@/lib/data/cart";
import { updateCartDetails, selectShippingMethod } from "@/lib/data/checkout";
import { sdk } from "@/lib/medusa";
import { formatPrice } from "@/lib/format-price";
import { FormSubmitButton } from "@/components/form-submit-button";
import { ShippingMethodButton } from "@/components/shipping-method-button";
import {
  CheckoutPaymentSection,
  CheckoutPaymentSkeleton,
} from "@/components/checkout-payment-section";

export default async function CheckoutPage() {
  const cart = await retrieveCart();
  if (!cart || !cart.items || cart.items.length === 0) {
    redirect("/cart");
  }

  const hasAddress = Boolean(cart.shipping_address?.address_1 && cart.email);
  const hasShippingMethod = Boolean(cart.shipping_methods && cart.shipping_methods.length > 0);

  const { shipping_options } = hasAddress
    ? await sdk.store.fulfillment.listCartOptions({ cart_id: cart.id })
    : { shipping_options: [] };

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Checkout
      </h1>

      <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {/* Step 1: contact + shipping address */}
          <section>
            <h2 className="text-lg font-medium text-ink">Contact & shipping</h2>
            <form action={updateCartDetails} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <input
                type="email"
                name="email"
                placeholder="Email"
                defaultValue={cart.email ?? ""}
                required
                className="sm:col-span-2 rounded border border-silver px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="first_name"
                placeholder="First name"
                defaultValue={cart.shipping_address?.first_name ?? ""}
                required
                className="rounded border border-silver px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last name"
                defaultValue={cart.shipping_address?.last_name ?? ""}
                required
                className="rounded border border-silver px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="address_1"
                placeholder="Address"
                defaultValue={cart.shipping_address?.address_1 ?? ""}
                required
                className="sm:col-span-2 rounded border border-silver px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                defaultValue={cart.shipping_address?.city ?? ""}
                required
                className="rounded border border-silver px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="province"
                placeholder="State (e.g. TX)"
                defaultValue={cart.shipping_address?.province ?? ""}
                required
                className="rounded border border-silver px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="postal_code"
                placeholder="ZIP code"
                defaultValue={cart.shipping_address?.postal_code ?? ""}
                required
                className="rounded border border-silver px-3 py-2 text-sm"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                defaultValue={cart.shipping_address?.phone ?? ""}
                className="rounded border border-silver px-3 py-2 text-sm"
              />
              <input type="hidden" name="country_code" value="us" />
              <FormSubmitButton
                idleLabel={hasAddress ? "Update details" : "Continue to shipping"}
                pendingLabel={hasAddress ? "Updating…" : "Continuing…"}
                className="sm:col-span-2 bg-deep text-white hover:bg-deep/90"
              />
            </form>
          </section>

          {/* Step 2: shipping method */}
          {hasAddress && (
            <section>
              <h2 className="text-lg font-medium text-ink">Shipping method</h2>
              <div className="mt-4 space-y-3">
                {shipping_options.map((option) => (
                  <form key={option.id} action={selectShippingMethod}>
                    <input type="hidden" name="option_id" value={option.id} />
                    <ShippingMethodButton
                      name={option.name}
                      amount={option.amount}
                      currencyCode={cart.currency_code}
                      selected={Boolean(
                        cart.shipping_methods?.some((m) => m.shipping_option_id === option.id)
                      )}
                    />
                  </form>
                ))}
              </div>
            </section>
          )}

          {/* Step 3: payment */}
          {hasShippingMethod && (
            <section>
              <h2 className="text-lg font-medium text-ink">Payment</h2>
              <div className="mt-4">
                <Suspense fallback={<CheckoutPaymentSkeleton />}>
                  <CheckoutPaymentSection />
                </Suspense>
              </div>
            </section>
          )}
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-lg bg-ink/5 p-6">
          <h2 className="text-sm font-medium text-ink">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {cart.items?.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span className="text-graphite">
                  {item.product_title} &times; {item.quantity}
                </span>
                <span className="text-ink">
                  {formatPrice(item.unit_price * item.quantity, cart.currency_code)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-silver pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-graphite">Subtotal</span>
              <span className="text-ink">{formatPrice(cart.item_subtotal ?? 0, cart.currency_code)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">Shipping</span>
              <span className="text-ink">{formatPrice(cart.shipping_total ?? 0, cart.currency_code)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">Tax</span>
              <span className="text-ink">{formatPrice(cart.tax_total ?? 0, cart.currency_code)}</span>
            </div>
            <div className="flex justify-between border-t border-silver pt-2 text-base font-medium">
              <span className="text-ink">Total</span>
              <span className="text-ink">{formatPrice(cart.total ?? 0, cart.currency_code)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
