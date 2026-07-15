"use client";

import { forwardRef, useRef } from "react";
import type { PaddleSelections } from "@/lib/customizer-config";

/**
 * Realistic layered paddle render (docs/06-customizer-spec.md, "The live
 * preview"). One silhouette for the edge guard, an inset face, a wrapped
 * grip, and gloss/vignette layers drawn OVER the graphic and text so custom
 * designs read as printed under the paddle's finish rather than pasted on
 * top. The face path doubles as a clip: graphics/text can be dragged,
 * zoomed, and rotated, and anything outside the face is cropped away.
 */

// Blade silhouette: elongated rounded-rectangle face (real paddle
// proportions, ~8x11 face) with a flat-ish top, near-straight sides, and
// shoulders flaring concavely into the throat.
const BLADE_OUTER =
  "M95 18 L205 18 C240 18 268 40 268 88 L268 210 C268 252 250 280 214 300 C192 312 180 322 176 342 L124 342 C120 322 108 312 86 300 C50 280 32 252 32 210 L32 88 C32 40 60 18 95 18 Z";
// Face inset ~12 units inside the edge guard.
const FACE_INNER =
  "M97 30 L203 30 C231 30 256 49 256 90 L256 208 C256 246 240 271 206 290 C188 300 177 312 173 330 L127 330 C123 312 112 300 94 290 C60 271 44 246 44 208 L44 90 C44 49 69 30 97 30 Z";

// Face-center in viewBox coordinates; graphic transforms pivot around this.
const FACE_CX = 150;
const FACE_CY = 170;

function LibraryGraphic({ id, color }: { id: string; color: string }) {
  if (id === "bolt") {
    return (
      <g transform="translate(-72 -72) scale(6)">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" fill={color} />
      </g>
    );
  }
  if (id === "chevron") {
    return <path d="M-28 -33 L34 0 L-28 33 Z" fill={color} />;
  }
  if (id === "wave") {
    return (
      <path
        d="M-48 6 C-40 -14 -28 -14 -20 6 C-12 26 0 26 8 6 C16 -14 28 -14 36 6"
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
      />
    );
  }
  return null;
}

/** Picks a legible mark color for a given face fill. */
function contrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0D0F0E" : "#FFFFFF";
}

type PaddlePreviewProps = {
  selections: PaddleSelections;
  /** Called with viewBox-space deltas while the user drags the graphic. */
  onGraphicMove?: (dx: number, dy: number) => void;
};

export const PaddlePreview = forwardRef<HTMLDivElement, PaddlePreviewProps>(
  function PaddlePreview({ selections, onGraphicMove }, ref) {
    const {
      edgeColor,
      faceColor,
      gripColor,
      graphicId,
      uploadedGraphicUrl,
      graphicTransform: t,
      text,
      textColor,
    } = selections;
    const markColor = contrastColor(faceColor);
    const hasGraphic = Boolean(uploadedGraphicUrl) || graphicId !== "none";
    const interactive = hasGraphic && Boolean(onGraphicMove);

    const svgRef = useRef<SVGSVGElement>(null);
    const drag = useRef<{ pointerId: number; x: number; y: number } | null>(null);

    function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
      if (!interactive) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { pointerId: e.pointerId, x: e.clientX, y: e.clientY };
    }

    function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
      const d = drag.current;
      if (!d || d.pointerId !== e.pointerId || !svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const scale = 300 / rect.width; // client px -> viewBox units
      onGraphicMove?.((e.clientX - d.x) * scale, (e.clientY - d.y) * scale);
      d.x = e.clientX;
      d.y = e.clientY;
    }

    function onPointerEnd() {
      drag.current = null;
    }

    return (
      <div ref={ref} className="mx-auto w-full max-w-xs bg-transparent">
        <svg
          ref={svgRef}
          viewBox="0 0 300 500"
          className="w-full select-none"
          role="img"
          aria-label="Paddle preview"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
          style={{
            touchAction: interactive ? "none" : undefined,
            cursor: interactive ? "grab" : undefined,
          }}
        >
          <defs>
            <clipPath id="faceClip">
              <path d={FACE_INNER} />
            </clipPath>
            <linearGradient id="faceSheen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.22" />
              <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="faceVignette" cx="0.5" cy="0.42" r="0.75">
              <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
              <stop offset="1" stopColor="#000000" stopOpacity="0.14" />
            </radialGradient>
            <filter id="paddleShadow" x="-25%" y="-10%" width="150%" height="125%">
              <feDropShadow
                dx="0"
                dy="12"
                stdDeviation="14"
                floodColor="#000000"
                floodOpacity="0.35"
              />
            </filter>
          </defs>

          <g filter="url(#paddleShadow)">
            {/* Grip: handle, wrap texture, highlight, butt cap */}
            <rect x={126} y={330} width={48} height={122} rx={13} fill={gripColor} />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <path
                key={i}
                d={`M126 ${356 + i * 13} L174 ${349 + i * 13}`}
                stroke="#000000"
                strokeOpacity={0.22}
                strokeWidth={4}
              />
            ))}
            <rect x={131} y={338} width={5} height={106} rx={2.5} fill="#FFFFFF" opacity={0.12} />
            <rect x={116} y={446} width={68} height={24} rx={11} fill={gripColor} />
            <rect x={116} y={446} width={68} height={24} rx={11} fill="#000000" opacity={0.3} />

            {/* Edge guard */}
            <path d={BLADE_OUTER} fill={edgeColor} stroke="#000000" strokeOpacity={0.2} />

            {/* Face */}
            <path d={FACE_INNER} fill={faceColor} />

            {/* Graphic layer, clipped to the face, user-transformable */}
            {hasGraphic && (
              <g clipPath="url(#faceClip)">
                <g
                  transform={`translate(${FACE_CX + t.x} ${FACE_CY + t.y}) rotate(${t.rotation}) scale(${t.scale})`}
                >
                  {uploadedGraphicUrl ? (
                    <image
                      href={uploadedGraphicUrl}
                      x={-110}
                      y={-110}
                      width={220}
                      height={220}
                      preserveAspectRatio="xMidYMid meet"
                    />
                  ) : (
                    <LibraryGraphic id={graphicId} color={markColor} />
                  )}
                </g>
              </g>
            )}

            {/* Text layer, clipped to the face */}
            {text && (
              <g clipPath="url(#faceClip)">
                <text
                  x={FACE_CX}
                  y={284}
                  textAnchor="middle"
                  fontSize={28}
                  fontWeight={700}
                  fill={textColor}
                  style={{ fontFamily: "var(--font-headline), sans-serif", letterSpacing: 2 }}
                >
                  {text.slice(0, 16)}
                </text>
              </g>
            )}

            {/* Finish: edge vignette + top gloss drawn OVER the print */}
            <g clipPath="url(#faceClip)">
              <rect x={32} y={18} width={236} height={324} fill="url(#faceVignette)" />
              <path
                d="M32 18 L268 18 L268 110 C200 150 100 150 32 110 Z"
                fill="url(#faceSheen)"
              />
            </g>
          </g>
        </svg>
      </div>
    );
  }
);
