"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/shop?category=men", label: "Men" },
  { href: "/shop?category=women", label: "Women" },
  { href: "/customize", label: "Customize" },
  { href: "/about", label: "About" },
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // next/link's onClick prop does NOT stop its own internal navigation
  // (confirmed by reading the source: linkClicked() ignores our
  // preventDefault and always runs its own router call right after), so an
  // onClick handler that also calls router.push() races Link's own
  // navigation and intermittently aborts it (net::ERR_ABORTED on the RSC
  // fetch, confirmed via Playwright). onNavigate is the one hook Link
  // actually checks: calling its preventDefault stops Link's internal
  // navigation cleanly, so we can close the sheet and navigate ourselves
  // without competing against it.
  const navigate = (href: string) => (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setOpen(false);
    router.push(href);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label="Open menu"
        className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
      >
        <Menu className="h-5 w-5" strokeWidth={1.75} />
      </SheetTrigger>
      <SheetContent side="left" className="bg-ink text-white">
        <SheetHeader>
          <SheetTitle className="text-white">
            <Logo className="h-8 w-auto" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onNavigate={navigate(link.href)}
              className="rounded px-2 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            onNavigate={navigate("/account")}
            className="rounded px-2 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10"
          >
            Sign In / Sign Up
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
