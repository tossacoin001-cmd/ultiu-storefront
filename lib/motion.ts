import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion presets (docs/03-design-system.md, "Motion principles").
 * Quick, purposeful, never gratuitous. Respect prefers-reduced-motion at the
 * call site via framer-motion's `useReducedMotion` where a preset is used.
 */

export const pageTransition: Transition = {
  duration: 0.25,
  ease: "easeOut",
};

export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: pageTransition },
};

export const fadeRiseStagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const orbitalSpin: Transition = {
  duration: 50,
  ease: "linear",
  repeat: Infinity,
};
