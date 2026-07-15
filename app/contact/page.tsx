export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 text-center">
      <h1 className="font-headline text-3xl font-medium tracking-tight text-ink">
        Get in touch
      </h1>
      <p className="mt-4 text-graphite">
        Questions about an order, a custom design, or anything else, we
        read every message.
      </p>

      <a
        href="mailto:support@ultiusport.com"
        className="mt-8 inline-block text-lg font-medium text-signal hover:underline"
      >
        support@ultiusport.com
      </a>

      <p className="mt-8 text-sm text-graphite">
        Real questions get real answers. We typically reply within 1-2
        business days.
      </p>
    </div>
  );
}
