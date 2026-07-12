import Link from "next/link";
import { retrieveCart, updateLineItem, removeLineItem } from "@/lib/data/cart";
import { formatPrice } from "@/lib/format-price";
import { Button, buttonVariants } from "@/components/ui/button";

export default async function CartPage() {
  const cart = await retrieveCart();

  if (!cart || cart.items?.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-headline text-3xl font-medium text-ink">
          Your cart is empty
        </h1>
        <Link
          href="/shop"
          className={buttonVariants({ size: "lg", className: "mt-8 bg-deep text-white hover:bg-deep/90" })}
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Cart
      </h1>

      <ul className="mt-8 divide-y divide-silver">
        {cart.items?.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-6">
            <div className="h-20 w-20 shrink-0 bg-ink/5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{item.product_title}</p>
              <p className="text-sm text-graphite">{item.variant_title}</p>
              <p className="mt-1 text-sm text-ink">
                {formatPrice(item.unit_price, cart.currency_code)}
              </p>
            </div>

            <form action={updateLineItem} className="flex items-center gap-2">
              <input type="hidden" name="line_id" value={item.id} />
              <input
                type="number"
                name="quantity"
                min={0}
                defaultValue={item.quantity}
                className="w-16 rounded border border-silver px-2 py-1 text-sm"
              />
              <Button type="submit" variant="outline" size="sm">
                Update
              </Button>
            </form>

            <form action={removeLineItem}>
              <input type="hidden" name="line_id" value={item.id} />
              <Button type="submit" variant="ghost" size="sm">
                Remove
              </Button>
            </form>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t border-silver pt-6">
        <span className="text-sm font-medium text-ink">Subtotal</span>
        <span className="text-lg font-medium text-ink">
          {formatPrice(cart.item_subtotal ?? cart.subtotal ?? 0, cart.currency_code)}
        </span>
      </div>

      <Link
        href="/checkout"
        className={buttonVariants({ size: "lg", className: "mt-6 w-full bg-deep text-white hover:bg-deep/90" })}
      >
        Checkout
      </Link>
    </div>
  );
}
