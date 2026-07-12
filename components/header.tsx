import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Logo } from "@/components/logo";
import { retrieveCart } from "@/lib/data/cart";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/customize", label: "Customize" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const cart = await retrieveCart();
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

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

        <Link
          href="/cart"
          aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
          {itemCount > 0 && (
            <span
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ember px-1 text-[10px] font-medium text-white"
              aria-hidden
            >
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
