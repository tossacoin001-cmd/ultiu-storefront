import { forwardRef } from "react";
import type { PaddleSelections } from "@/lib/customizer-config";

const GRAPHIC_PATHS: Record<string, string> = {
  bolt: "M13 2L3 14h7l-1 8 10-12h-7l1-8z",
  chevron: "M4 4 L18 12 L4 20 Z",
};

function Graphic({ id, color }: { id: string; color: string }) {
  if (id === "none") return null;

  if (id === "wave") {
    return (
      <path
        d="M100 130 C104 118, 112 118, 116 130 S128 142, 132 130 S144 118, 148 130"
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        transform="translate(0, -10)"
      />
    );
  }

  const path = GRAPHIC_PATHS[id];
  if (!path) return null;

  return (
    <g transform="translate(102, 95) scale(1.6)">
      <path d={path} fill={color} />
    </g>
  );
}

/** Picks a legible mark/text color for a given face fill. */
function contrastColor(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#0D0F0E" : "#FFFFFF";
}

export const PaddlePreview = forwardRef<HTMLDivElement, { selections: PaddleSelections }>(
  function PaddlePreview({ selections }, ref) {
    const { edgeColor, faceColor, gripColor, graphicId, uploadedGraphicUrl, text, textColor } =
      selections;
    const markColor = contrastColor(faceColor);

    return (
      <div ref={ref} className="mx-auto w-full max-w-xs bg-transparent">
        <svg viewBox="0 0 240 400" className="w-full drop-shadow-lg">
          {/* Edge layer */}
          <rect x={20} y={10} width={200} height={250} rx={46} fill={edgeColor} />
          {/* Face layer */}
          <rect x={30} y={20} width={180} height={230} rx={40} fill={faceColor} />
          {/* Neck */}
          <rect x={104} y={252} width={32} height={26} rx={6} fill={edgeColor} />
          {/* Handle / grip layer */}
          <rect x={90} y={270} width={60} height={115} rx={22} fill={gripColor} />

          {/* Graphic layer */}
          {uploadedGraphicUrl ? (
            <image
              href={uploadedGraphicUrl}
              x={70}
              y={70}
              width={100}
              height={100}
              preserveAspectRatio="xMidYMid meet"
            />
          ) : (
            <Graphic id={graphicId} color={markColor} />
          )}

          {/* Text layer */}
          {text && (
            <text
              x={120}
              y={195}
              textAnchor="middle"
              fontSize={22}
              fontWeight={600}
              fill={textColor}
              style={{ fontFamily: "var(--font-headline), sans-serif" }}
            >
              {text.slice(0, 16)}
            </text>
          )}
        </svg>
      </div>
    );
  }
);
