type LogoProps = {
  className?: string;
};

/**
 * Placeholder wordmark. The real brand asset is an interlocked monoline mark
 * (docs/03-design-system.md, "The logo"). Swap the contents of this
 * component for the owner's actual logo SVG once supplied; the currentColor
 * contract (white on court/ink, graphite on paper) stays the same.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 108 24"
      role="img"
      aria-label="ULTIU"
      className={className}
      fill="none"
    >
      <text
        x="0"
        y="18"
        fill="currentColor"
        fontFamily="var(--font-headline), sans-serif"
        fontSize="20"
        fontWeight="600"
        letterSpacing="1"
      >
        ULTIU
      </text>
    </svg>
  );
}
