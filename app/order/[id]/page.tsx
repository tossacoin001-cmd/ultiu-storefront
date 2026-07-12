import Link from "next/link";
import { notFound } from "next/navigation";
import { sdk } from "@/lib/medusa";
import { formatPrice } from "@/lib/format-price";
import { buttonVariants } from "@/components/ui/button";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let order;
  try {
    ({ order } = await sdk.store.order.retrieve(id, {
      fields: "*items,*shipping_address,display_id,email,currency_code,total",
    }));
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Thank you, your order is confirmed
      </h1>
      <p className="mt-2 text-graphite">
        Order #{order.display_id} &middot; a confirmation has been sent to {order.email}
      </p>

      <ul className="mt-10 divide-y divide-silver text-left">
        {order.items?.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-ink">{item.product_title}</p>
              <p className="text-sm text-graphite">{item.variant_title} &times; {item.quantity}</p>
            </div>
            <span className="text-sm text-ink">
              {formatPrice(item.unit_price * item.quantity, order.currency_code)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between border-t border-silver pt-6 text-base font-medium">
        <span className="text-ink">Total</span>
        <span className="text-ink">{formatPrice(order.total, order.currency_code)}</span>
      </div>

      <Link
        href="/shop"
        className={buttonVariants({ size: "lg", className: "mt-10 bg-deep text-white hover:bg-deep/90" })}
      >
        Continue shopping
      </Link>
    </div>
  );
}
