export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Shipping
      </h1>

      <div className="mt-8 space-y-8 text-graphite">
        <section>
          <h2 className="text-base font-medium text-ink">Processing time</h2>
          <p className="mt-2 leading-relaxed">
            In-stock items ship from Richmond, Texas within 1-2 business days.
            Custom paddles need a little longer, since each one is built to
            your design after you order it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Rates</h2>
          <p className="mt-2 leading-relaxed">
            Shipping is calculated at checkout. We currently offer flat-rate
            Standard and Express options; exact delivery windows depend on
            your destination.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">International orders</h2>
          <p className="mt-2 leading-relaxed">
            We ship worldwide. Taxes and duties for your country are
            calculated at checkout where applicable. You are responsible for
            any customs fees charged by your local authorities on arrival.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Order tracking</h2>
          <p className="mt-2 leading-relaxed">
            You will receive a shipping confirmation once your order leaves
            our warehouse. If you have not heard from us within the
            processing window above, reach out on the{" "}
            <a href="/contact" className="text-signal hover:underline">
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
