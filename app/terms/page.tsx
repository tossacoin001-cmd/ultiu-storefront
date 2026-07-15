export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-graphite">Last updated: 2026</p>

      <div className="mt-8 space-y-8 text-graphite">
        <section>
          <h2 className="text-base font-medium text-ink">1. Acceptance of terms</h2>
          <p className="mt-2 leading-relaxed">
            By placing an order on ultiusport.com, you agree to these terms.
            If you do not agree, please do not use the site.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">2. Products and pricing</h2>
          <p className="mt-2 leading-relaxed">
            We make a reasonable effort to display accurate pricing and
            product information. Prices are shown in USD and may change
            without notice; the price at the time you complete checkout is
            what you are charged.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">3. Custom paddle orders</h2>
          <p className="mt-2 leading-relaxed">
            When you design a paddle, your color, graphic, and text choices
            are recorded and used to build your order. If your design
            includes an uploaded image, it is reviewed by us before
            production begins; we may decline to produce a design that
            infringes someone else&apos;s rights or is offensive, and will
            contact you if that happens.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">4. Your uploads</h2>
          <p className="mt-2 leading-relaxed">
            You keep ownership of anything you upload. By uploading it, you
            confirm you have the right to use it and grant us a license to
            print it on the product you ordered. Do not upload content you
            do not have the rights to.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">5. Payment</h2>
          <p className="mt-2 leading-relaxed">
            Payments are processed by Stripe. We never see or store your
            full card details.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">6. Shipping and returns</h2>
          <p className="mt-2 leading-relaxed">
            See our{" "}
            <a href="/shipping" className="text-signal hover:underline">
              Shipping
            </a>{" "}
            and{" "}
            <a href="/returns" className="text-signal hover:underline">
              Returns &amp; Warranty
            </a>{" "}
            pages for details.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">7. Limitation of liability</h2>
          <p className="mt-2 leading-relaxed">
            ULTIU is not liable for indirect or incidental damages arising
            from use of our products or site, to the extent permitted by
            law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">8. Governing law</h2>
          <p className="mt-2 leading-relaxed">
            These terms are governed by the laws of the State of Texas.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">9. Changes</h2>
          <p className="mt-2 leading-relaxed">
            We may update these terms from time to time. Continued use of
            the site after changes means you accept the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-base font-medium text-ink">10. Contact</h2>
          <p className="mt-2 leading-relaxed">
            Questions about these terms:{" "}
            <a href="mailto:support@ultiusport.com" className="text-signal hover:underline">
              support@ultiusport.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
