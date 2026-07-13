/**
 * Single source of truth for the paddle customizer (docs/06-customizer-spec.md
 * in the ultiu-store planning repo). Turning on a dormant option is a
 * one-line edit: set `enabled: true` and fill its real choices once the
 * owner confirms manufacturing.
 */

export type SwatchOption = { label: string; hex: string };
export type GraphicOption = { id: string; label: string };

export const paddleCustomizer = {
  // Placeholders. The owner sets real numbers before launch. These mirror the
  // Base/Custom/Premium variant prices on the Pickleball Paddle product in
  // Medusa (the source of truth for what's actually charged) so the two
  // never drift; if you change one, change the other.
  pricing: {
    base: 129,
    customFee: 25,
    premiumFee: 45,
  },

  live: {
    edgeColors: [
      { label: "Ink", hex: "#0D0F0E" },
      { label: "Signal Green", hex: "#2FA84F" },
      { label: "Ember", hex: "#F97316" },
      { label: "Silver", hex: "#C8CDD4" },
    ] satisfies SwatchOption[],
    faceColors: [
      { label: "Paper", hex: "#F7F9F8" },
      { label: "Deep Forest", hex: "#14532D" },
      { label: "Court Teal", hex: "#1B6B70" },
      { label: "Ink", hex: "#0D0F0E" },
    ] satisfies SwatchOption[],
    gripColors: [
      { label: "Ink", hex: "#0D0F0E" },
      { label: "Graphite", hex: "#3A3A3A" },
      { label: "Signal Green", hex: "#2FA84F" },
    ] satisfies SwatchOption[],
    // Placeholder starter library (simple geometric marks). Swap in the
    // real Pegasus artwork + additional marks once the owner supplies them.
    graphics: [
      { id: "none", label: "None" },
      { id: "bolt", label: "Bolt" },
      { id: "chevron", label: "Chevron" },
      { id: "wave", label: "Wave" },
    ],
    allowUpload: true,
    text: {
      enabled: true,
      maxChars: 16,
      colors: [
        { label: "White", hex: "#FFFFFF" },
        { label: "Signal Green", hex: "#2FA84F" },
        { label: "Ember", hex: "#F97316" },
      ] satisfies SwatchOption[],
    },
  },

  dormant: {
    shape: { enabled: false, options: ["A", "B"] },
    core: { enabled: false, options: ["Polymer", "Aluminum", "Nomex"] },
    surface: { enabled: false, options: ["Carbon Fiber", "Graphite", "Fiberglass"] },
    weight: { enabled: false, options: ["Light", "Mid-light", "Mid", "Mid-heavy", "Heavy"] },
    handleShape: { enabled: false, options: ["Octagonal", "Rounded Square", "Oval"] },
    gripCirc: { enabled: false, options: ['4"', '4 1/4"', '4 1/2"', '4 5/8"', '4 3/4"', '5"'] },
    gripStyle: { enabled: false, options: ["Ridged", "Smooth", "Stitched"] },
  },

  upload: {
    requireApproval: true,
    maxSizeMB: 10,
    types: ["image/png", "image/jpeg", "image/svg+xml"],
  },
} as const;

export type PaddleSelections = {
  edgeColor: string;
  faceColor: string;
  gripColor: string;
  graphicId: string;
  uploadedGraphicUrl: string | null;
  text: string;
  textColor: string;
};

export const defaultSelections: PaddleSelections = {
  edgeColor: paddleCustomizer.live.edgeColors[0].hex,
  faceColor: paddleCustomizer.live.faceColors[0].hex,
  gripColor: paddleCustomizer.live.gripColors[0].hex,
  graphicId: "none",
  uploadedGraphicUrl: null,
  text: "",
  textColor: paddleCustomizer.live.text.colors[0].hex,
};

export type PricingTier = "base" | "custom" | "premium";

export function deriveTier(selections: PaddleSelections): PricingTier {
  if (selections.uploadedGraphicUrl) return "premium";
  if (selections.graphicId !== "none" || selections.text.trim().length > 0) return "custom";
  return "base";
}

export function tierTotal(tier: PricingTier) {
  const { base, customFee, premiumFee } = paddleCustomizer.pricing;
  if (tier === "premium") return base + premiumFee;
  if (tier === "custom") return base + customFee;
  return base;
}

export const tierLabels: Record<PricingTier, string> = {
  base: "Base",
  custom: "Custom",
  premium: "Premium",
};
