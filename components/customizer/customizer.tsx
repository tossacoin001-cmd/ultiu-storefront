"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { PaddlePreview } from "@/components/customizer/paddle-preview";
import { formatPrice } from "@/lib/format-price";
import { addCustomPaddleToCart } from "@/lib/data/customizer";
import {
  paddleCustomizer,
  defaultSelections,
  deriveTier,
  tierLabels,
  type PaddleSelections,
} from "@/lib/customizer-config";

type TierVariant = { id: string; price: number };

export function Customizer({
  tierVariants,
  currencyCode,
}: {
  tierVariants: Record<"base" | "custom" | "premium", TierVariant>;
  currencyCode: string;
}) {
  const [selections, setSelections] = useState<PaddleSelections>(defaultSelections);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const previewRef = useRef<HTMLDivElement>(null);

  const tier = deriveTier(selections);
  const variant = tierVariants[tier];

  function update<K extends keyof PaddleSelections>(key: K, value: PaddleSelections[K]) {
    setStatus("idle");
    setSelections((s) => ({ ...s, [key]: value }));
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!(paddleCustomizer.upload.types as readonly string[]).includes(file.type)) return;
    if (file.size > paddleCustomizer.upload.maxSizeMB * 1024 * 1024) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    update("uploadedGraphicUrl", dataUrl);
  }

  async function handleAddToCart() {
    if (!previewRef.current) return;
    setStatus("adding");

    const proofDataUrl = await toPng(previewRef.current, { pixelRatio: 2 });

    await addCustomPaddleToCart({
      variantId: variant.id,
      tier,
      selections,
      proofDataUrl,
    });

    setStatus("added");
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_420px]">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl bg-court p-10">
          <PaddlePreview ref={previewRef} selections={selections} />
        </div>
      </div>

      <div className="space-y-8">
        {/* Colors */}
        <fieldset>
          <legend className="text-sm font-medium text-ink">Face color</legend>
          <SwatchRow
            options={paddleCustomizer.live.faceColors}
            value={selections.faceColor}
            onChange={(hex) => update("faceColor", hex)}
          />
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Edge color</legend>
          <SwatchRow
            options={paddleCustomizer.live.edgeColors}
            value={selections.edgeColor}
            onChange={(hex) => update("edgeColor", hex)}
          />
        </fieldset>

        <fieldset>
          <legend className="text-sm font-medium text-ink">Grip color</legend>
          <SwatchRow
            options={paddleCustomizer.live.gripColors}
            value={selections.gripColor}
            onChange={(hex) => update("gripColor", hex)}
          />
        </fieldset>

        {/* Graphic */}
        <fieldset>
          <legend className="text-sm font-medium text-ink">Graphic</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {paddleCustomizer.live.graphics.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => {
                  update("graphicId", g.id);
                  update("uploadedGraphicUrl", null);
                }}
                aria-pressed={selections.graphicId === g.id && !selections.uploadedGraphicUrl}
                className={`rounded border px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-signal ${
                  selections.graphicId === g.id && !selections.uploadedGraphicUrl
                    ? "border-signal bg-signal/10 text-ink"
                    : "border-silver text-graphite"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
          {paddleCustomizer.live.allowUpload && (
            <label className="mt-3 block text-sm text-graphite">
              Or upload your own (Premium)
              <input
                type="file"
                accept={paddleCustomizer.upload.types.join(",")}
                onChange={handleUpload}
                className="mt-1 block w-full text-xs text-graphite file:mr-3 file:rounded file:border-0 file:bg-ink/5 file:px-3 file:py-1.5 file:text-xs"
              />
            </label>
          )}
        </fieldset>

        {/* Text */}
        {paddleCustomizer.live.text.enabled && (
          <fieldset>
            <legend className="text-sm font-medium text-ink">Name / text</legend>
            <input
              type="text"
              maxLength={paddleCustomizer.live.text.maxChars}
              value={selections.text}
              onChange={(e) => update("text", e.target.value)}
              placeholder="Up to 16 characters"
              className="mt-3 w-full rounded border border-silver px-3 py-2 text-sm"
            />
            <div className="mt-3">
              <SwatchRow
                options={paddleCustomizer.live.text.colors}
                value={selections.textColor}
                onChange={(hex) => update("textColor", hex)}
              />
            </div>
          </fieldset>
        )}

        {/* Tier + total, live-announced for screen readers */}
        <div
          aria-live="polite"
          className="flex items-center justify-between rounded-lg bg-ink/5 px-4 py-4"
        >
          <span className="text-sm text-graphite">{tierLabels[tier]} paddle</span>
          <span className="text-lg font-medium text-ink">
            {formatPrice(variant.price, currencyCode)}
          </span>
        </div>

        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={status === "adding"}
          className="w-full bg-deep text-white hover:bg-deep/90"
        >
          {status === "adding" ? "Adding..." : status === "added" ? "Added to cart" : "Add to cart"}
        </Button>
      </div>
    </div>
  );
}

function SwatchRow({
  options,
  value,
  onChange,
}: {
  options: readonly { label: string; hex: string }[];
  value: string;
  onChange: (hex: string) => void;
}) {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {options.map((opt) => (
        <button
          key={opt.hex}
          type="button"
          onClick={() => onChange(opt.hex)}
          aria-pressed={value === opt.hex}
          aria-label={opt.label}
          title={opt.label}
          className={`h-8 w-8 rounded-full border-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal ${
            value === opt.hex ? "border-signal" : "border-silver"
          }`}
          style={{ backgroundColor: opt.hex }}
        />
      ))}
    </div>
  );
}
