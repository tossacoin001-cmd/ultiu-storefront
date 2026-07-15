import Link from "next/link";
import { ShoppingBag, User, Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import { retrieveCart } from "@/lib/data/cart";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6">
        {/* Left: mobile menu trigger */}
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 md:hidden"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </SheetTrigger>
            <SheetContent side="left" className="bg-ink text-white">
              <SheetHeader>
                <SheetTitle className="text-white">
                  <Logo className="h-5 w-auto" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded px-2 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/account"
                  className="rounded px-2 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10"
                >
                  Sign In / Sign Up
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Center: logo, always centered regardless of side content width */}
        <Link href="/" aria-label="ULTIU home" className="justify-self-center">
          <Logo className="h-6 w-auto" />
        </Link>

        {/* Right: nav (desktop) + account + cart */}
        <div className="flex items-center justify-end gap-1 sm:gap-4">
          <nav className="hidden items-center gap-6 md:flex">
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
            href="/account"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <User className="h-5 w-5" strokeWidth={1.75} />
          </Link>

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
      </div>
    </header>
  );
}
