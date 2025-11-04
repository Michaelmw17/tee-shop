import React from "react";
import {
  COLOR_SWATCH_MAP,
  getCanonicalColorName
} from "@/data/colors";

export { COLOR_SWATCH_MAP, ORDERED_COLOR_KEYS, getCanonicalColorName } from "@/data/colors";
export type { SupportedColor } from "@/data/colors";

interface ColorSquareProps {
  color: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

export default function ColorSquare({ color, selected, onClick, className }: ColorSquareProps) {
  const canonical = getCanonicalColorName(color);
  const bgColor = canonical ? COLOR_SWATCH_MAP[canonical] : "#d1d5db";

  return (
      <button
      type="button"
      aria-label={canonical ? canonical.charAt(0).toUpperCase() + canonical.slice(1) : color}
      title={canonical ? canonical.charAt(0).toUpperCase() + canonical.slice(1) : color}
      onClick={onClick}
        className={`relative w-6 h-6 rounded border flex items-center justify-center transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
          ${selected ? "border-green-500 ring-2 ring-green-300" : "border-gray-300"}
          ${canonical === "white" ? "border-gray-400" : ""}
          ${className || ""}`}
      style={{ backgroundColor: bgColor }}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          {/* Smaller green tick SVG */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="7" cy="7" r="7" fill="rgba(34,197,94,0.85)" />
            <path d="M4.2 7.35L6.3 9.45L9.8 5.95" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  );
}
