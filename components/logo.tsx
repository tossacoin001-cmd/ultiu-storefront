type LogoProps = {
  className?: string;
};

/**
 * The real brand mark (public/logo.png), supplied as a transparent-background
 * PNG. Solid black artwork, so `invert` flips it to white for the dark
 * (court/ink) surfaces it's currently placed on everywhere in the app. If
 * the logo is ever placed on a paper/light surface, drop the `invert` class
 * at that call site instead of here.
 */
export function Logo({ className }: LogoProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.png" alt="ULTIU" className={`invert ${className ?? ""}`} />;
}
