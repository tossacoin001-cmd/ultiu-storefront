export default function ReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Returns &amp; Warranty
      </h1>

      <div className="mt-8 space-y-8 text-graphite">
        <section>
          <h2 className="text-base font-medium text-ink">Stock items</h2>
          <p className="mt-2 leading-relaxed">
            Soccer balls, jerseys, and base-configuration paddles can be
            returned within 30 days of delivery if unused and in original
            condition. Contact us to start a return; once it is received and
            inspected, we will issue a refund to your original payment
            method.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Custom paddles</h2>
          <p className="mt-2 leading-relaxed">
            Because custom paddles are built to your specific design, they
            are final sale except in the case of a manufacturing defect or an
            order that does not match what you designed. If either happens,
            contact us with your order number and photos, and we will make
            it right.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Warranty</h2>
          <p className="mt-2 leading-relaxed">
            All paddles are covered against manufacturing defects for 90
            days from delivery. This does not cover normal wear, misuse, or
            damage from impact during play.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Starting a return</h2>
          <p className="mt-2 leading-relaxed">
            Reach out through the{" "}
            <a href="/contact" className="text-signal hover:underline">
              contact page
            </a>{" "}
            with your order number and we will walk you through the next
            steps.
          </p>
        </section>
      </div>
    </div>
  );
}
