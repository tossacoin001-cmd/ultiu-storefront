import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-paper px-6 py-32 text-center">
      <h1 className="max-w-2xl font-headline text-5xl font-medium leading-[0.95] tracking-tight text-ink">
        Unlock the U Within
      </h1>
      <p className="max-w-md text-lg text-graphite">
        The real hero (Court gradient, floating paddle, orbital rings) ships in Phase 5,
        once product photography exists. This page proves the design system: fonts,
        colors, header, footer, and a styled button.
      </p>
      <Link
        href="/shop"
        className={buttonVariants({ size: "lg", className: "bg-deep text-white hover:bg-deep/90" })}
      >
        Shop Now
      </Link>
    </div>
  );
}
