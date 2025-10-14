import React from "react";

interface ColorSquareProps {
  color: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

// Map color names to CSS color values for common cases
const colorMap: Record<string, string> = {
  white: "#fff",
  black: "#222",
  navy: "#001f3f",
  grey: "#888",
  pink: "#ff69b4",
  blue: "#0074d9",
  red: "#ff4136",
  green: "#2ecc40",
  charcoal: "#36454F",
  cream: "#f5f5dc",
  burgundy: "#800020",
  taupe: "#b38b6d",
  rose: "#ff007f",
  camel: "#c19a6b",
  forest: "#228b22",
  orange: "#ff851b"
};

export default function ColorSquare({ color, selected, onClick, className }: ColorSquareProps) {
  const bgColor = colorMap[color.toLowerCase()] || color;
  return (
      <button
      type="button"
      aria-label={color}
      onClick={onClick}
        className={`relative w-6 h-6 rounded border flex items-center justify-center transition-all duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400
          ${selected ? "border-green-500 ring-2 ring-green-300" : "border-gray-300"}
          ${color.toLowerCase() === "white" ? "border-gray-400" : ""}
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
