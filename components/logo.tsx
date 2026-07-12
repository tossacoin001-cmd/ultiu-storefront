type LogoProps = {
  className?: string;
};

/**
 * Placeholder wordmark. The real brand asset is an interlocked monoline mark
 * (docs/03-design-system.md, "The logo"). Swap the <path> below for the
 * owner's actual logo SVG once supplied; this component's currentColor
 * contract (white on court/ink, graphite on paper) stays the same.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 32"
      role="img"
      aria-label="ULTIU"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6v12a10 10 0 0 0 20 0V6" />
      <path d="M30 6v20" />
      <path d="M42 6v16a4 4 0 0 0 4 4h8" />
      <path d="M66 6v20h14" />
      <path d="M90 6v20" />
      <path d="M102 6v12a10 10 0 0 0 20 0V6" />
    </svg>
  );
}
