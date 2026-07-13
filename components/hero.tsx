"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { LinkedInIcon, InstagramIcon, FacebookIcon } from "@/components/social-icons";
import { fadeRise, fadeRiseStagger, orbitalSpin } from "@/lib/motion";

const SOCIAL_LINKS = [
  { href: "https://linkedin.com", label: "LinkedIn", icon: LinkedInIcon },
  { href: "https://instagram.com", label: "Instagram", icon: InstagramIcon },
  { href: "https://facebook.com", label: "Facebook", icon: FacebookIcon },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-court px-6 py-28 sm:py-36">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(0,0,0,0.25),transparent_60%)]" />

      <div className="absolute left-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-5 md:flex">
        {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer"
            aria-label={label}
            className="text-white/60 transition-colors hover:text-white"
          >
            <Icon className="h-4 w-4" />
          </a>
        ))}
        <div className="h-16 w-px bg-white/20" />
      </div>

      {/* Orbital rings: decorative, standing in for the product photo (blocked
          on the owner's photography) until it exists. */}
      <div className="pointer-events-none absolute right-[-10%] top-1/2 hidden h-[520px] w-[520px] -translate-y-1/2 lg:block">
        <motion.div
          className="absolute inset-0 rounded-full border border-white/15"
          animate={{ rotate: 360 }}
          transition={orbitalSpin}
        />
        <motion.div
          className="absolute inset-12 rounded-full border border-white/10"
          animate={{ rotate: -360 }}
          transition={{ ...orbitalSpin, duration: 65 }}
        />
        <div className="absolute inset-24 rounded-full border border-white/10" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeRiseStagger}
        className="relative mx-auto flex max-w-7xl flex-col items-start md:pl-16"
      >
        <motion.h1
          variants={fadeRise}
          className="max-w-xl font-headline text-5xl font-medium leading-[0.95] tracking-tight text-white sm:text-6xl"
        >
          Unlock the U Within
        </motion.h1>
        <motion.p variants={fadeRise} className="mt-6 max-w-md text-lg text-white/80">
          Gear built for players who expect more. Browse the collection, or design a
          pickleball paddle that&apos;s entirely yours.
        </motion.p>
        <motion.div variants={fadeRise} className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/shop"
            className={buttonVariants({ size: "lg", className: "bg-deep text-white hover:bg-deep/90" })}
          >
            Shop Now
          </Link>
          <Link
            href="/customize"
            className={buttonVariants({
              size: "lg",
              variant: "outline",
              className: "border-white/40 bg-transparent text-white hover:bg-white/10",
            })}
          >
            Design Your Paddle
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
