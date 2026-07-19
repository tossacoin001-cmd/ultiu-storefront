import { getStripeClientSecret } from "@/lib/data/checkout";
import { CheckoutPaymentForm } from "@/components/checkout-payment-form";

export async function CheckoutPaymentSection() {
  const clientSecret = await getStripeClientSecret();
  if (!clientSecret) {
    return (
      <p className="text-sm text-graphite">
        Payment isn&apos;t available right now. Refresh the page, or{" "}
        <a href="/contact" className="text-signal hover:underline">
          contact us
        </a>{" "}
        if this keeps happening.
      </p>
    );
  }

  return <CheckoutPaymentForm clientSecret={clientSecret} />;
}

export function CheckoutPaymentSkeleton() {
  return (
    <div className="space-y-4 animate-pulse" aria-live="polite" aria-busy="true">
      <p className="text-sm text-graphite">Preparing payment&hellip;</p>
      <div className="h-12 rounded bg-ink/5" />
      <div className="h-12 rounded bg-ink/5" />
      <div className="h-11 rounded bg-ink/10" />
    </div>
  );
}
