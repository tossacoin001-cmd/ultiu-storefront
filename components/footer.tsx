import Link from "next/link";
import { Logo } from "@/components/logo";
import { LinkedInIcon, InstagramIcon, FacebookIcon } from "@/components/social-icons";

const SHOP_LINKS = [
  { href: "/shop", label: "All Gear" },
  { href: "/customize", label: "Design a Paddle" },
  { href: "/shop/rookas-fc-jersey", label: "Rookas FC Jersey" },
];

const SUPPORT_LINKS = [
  { href: "/shipping", label: "Shipping" },
  { href: "/returns", label: "Returns & Warranty" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

const SOCIAL_LINKS = [
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedInIcon },
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
];

export function Footer() {
  return (
    <footer className="bg-court text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo className="h-6 w-auto" />
            <p className="mt-4 max-w-xs text-sm text-white/80">
              Unlock the U within. Global sport gear, based in Richmond, Texas.
            </p>
            <div className="mt-6 flex items-center gap-4">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/70 transition-colors hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Support" links={SUPPORT_LINKS} />
          <FooterColumn title="Legal" links={LEGAL_LINKS} />
        </div>

        <div className="mt-14 border-t border-white/15 pt-6 text-xs text-white/60">
          &copy; {new Date().getFullYear()} ULTIU. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-medium text-white/60">{title}</h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
