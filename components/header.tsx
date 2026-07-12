import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about", label: "About" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" aria-label="ULTIU home" className="shrink-0">
          <Logo className="h-6 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-colors hover:text-signal"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart badge (ember dot for a non-empty cart) wires up in Phase 3 with real Medusa cart state. */}
        <Link
          href="/cart"
          aria-label="Cart"
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
        </Link>
      </div>
    </header>
  );
}
