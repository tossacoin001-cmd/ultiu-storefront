import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div>
      <section className="bg-court px-6 py-24 text-center text-white">
        <h1 className="font-headline text-4xl font-medium tracking-tight sm:text-5xl">
          Unlock the U Within
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-white/85">
          Sport gear for players who expect more, based in Richmond, Texas.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-lg leading-relaxed text-graphite">
          ULTIU started with a simple idea: gear should feel like it was made
          for you, not just sold to you. We build a tight, honest catalog
          rather than a sprawling one, and we put real care into the pieces
          we do offer.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-graphite">
          The signature of that idea is our pickleball paddle customizer.
          Pick your colors, add a mark from our library or upload your own,
          put your name on the face, and watch it update as you go. It is
          the same paddle we build and ship, not a mockup.
        </p>
        <p className="mt-6 text-lg leading-relaxed text-graphite">
          We are a small, solo-run operation out of Richmond, Texas. Every
          order is packed and reviewed by an actual person, not a warehouse
          system. If something is not right, we want to hear about it.
        </p>
      </section>

      <section className="bg-ink px-6 py-16 text-center text-white">
        <h2 className="font-headline text-2xl font-medium">Ready to design yours?</h2>
        <Link
          href="/customize"
          className={buttonVariants({ size: "lg", className: "mt-6 bg-deep text-white hover:bg-deep/90" })}
        >
          Design Your Paddle
        </Link>
      </section>
    </div>
  );
}
