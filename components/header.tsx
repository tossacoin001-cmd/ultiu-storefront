import Link from "next/link";
import { ShoppingBag, User, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { retrieveCart } from "@/lib/data/cart";
import { retrieveCustomer } from "@/lib/data/customer";
import { WishlistBadge } from "@/components/wishlist-badge";
import { MobileMenu } from "@/components/mobile-menu";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/customize", label: "Customize" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const [cart, customer] = await Promise.all([retrieveCart(), retrieveCustomer()]);
  const itemCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const cartLink = (
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
  );

  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      {/* Mobile: hamburger left, logo centered, account + cart right */}
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-4 md:hidden">
        <div className="flex items-center">
          <MobileMenu isSignedIn={Boolean(customer)} />
        </div>

        <Link href="/" aria-label="ULTIU home" className="justify-self-center">
          <Logo className="h-11 w-auto" />
        </Link>

        <div className="flex items-center justify-end gap-1">
          <Link
            href="/account"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <User className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          {cartLink}
        </div>
      </div>

      {/* Desktop: logo + nav left, search + account + wishlist + cart right */}
      <div className="mx-auto hidden h-16 max-w-7xl items-center justify-between px-6 md:flex">
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="ULTIU home" className="shrink-0">
            <Logo className="h-10 w-auto" />
          </Link>
          <nav className="flex items-center gap-6">
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
        </div>

        <div className="flex items-center gap-4">
          <form action="/shop" className="relative">
            <input
              type="search"
              name="q"
              placeholder="Search"
              aria-label="Search products"
              className="w-40 rounded-full border border-white/20 bg-white/10 py-1.5 pl-3 pr-8 text-sm text-white placeholder:text-white/50 outline-none transition-colors focus:border-signal lg:w-56"
            />
            <button
              type="submit"
              aria-label="Submit search"
              className="absolute right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/70 hover:text-white"
            >
              <Search className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </form>

          <Link
            href="/account"
            aria-label="Account"
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/10"
          >
            <User className="h-5 w-5" strokeWidth={1.75} />
          </Link>

          <WishlistBadge />

          {cartLink}
        </div>
      </div>
    </header>
  );
}
