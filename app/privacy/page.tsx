export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-graphite">Last updated: 2026</p>

      <div className="mt-8 space-y-8 text-graphite">
        <section>
          <h2 className="text-base font-medium text-ink">What we collect</h2>
          <p className="mt-2 leading-relaxed">
            When you place an order, we collect your name, email, shipping
            address, and order details. If you design a custom paddle, we
            also store your color and text choices and, if you upload one,
            your graphic file.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">How we use it</h2>
          <p className="mt-2 leading-relaxed">
            We use this information to process and ship your order, send
            order confirmations, and provide support if you contact us. We
            do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Payment</h2>
          <p className="mt-2 leading-relaxed">
            Payments are handled by Stripe. We never see or store your full
            card number.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Third parties</h2>
          <p className="mt-2 leading-relaxed">
            We use Stripe for payments, Cloudinary to store uploaded
            graphics and design proofs, and standard hosting/database
            providers to run the site. Each only receives what they need to
            do their part.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Cookies</h2>
          <p className="mt-2 leading-relaxed">
            We use a single cookie to remember your shopping cart between
            visits. We do not use tracking or advertising cookies at this
            time.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Your rights</h2>
          <p className="mt-2 leading-relaxed">
            You can ask us to access, correct, or delete your personal
            information at any time by contacting us below.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">Contact</h2>
          <p className="mt-2 leading-relaxed">
            Questions about this policy:{" "}
            <a href="mailto:support@ultiusport.com" className="text-signal hover:underline">
              support@ultiusport.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
