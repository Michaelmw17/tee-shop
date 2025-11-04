"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/CartContext";
import ColorSquare, { getCanonicalColorName } from "./ColorSquare";
import { COLOR_SWATCH_MAP, ORDERED_COLOR_KEYS, SupportedColor } from "@/data/colors";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  material?: string;
}

const formatColorLabel = (color: SupportedColor | "" | null) =>
  color ? color.charAt(0).toUpperCase() + color.slice(1) : "";

export default function ProductCard({ product, category }: { product: Product; category: string }) {
  const [selectedSize, setSelectedSize] = useState("");
  type SelectedColor = SupportedColor | "";
  const [selectedColor, setSelectedColor] = useState<SelectedColor>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [error, setError] = useState("");

  const availableColors = useMemo<SupportedColor[]>(() => {
    const canonicalColors: SupportedColor[] =
      product.colors
        ?.map((color) => getCanonicalColorName(color))
        .filter((color): color is SupportedColor => Boolean(color)) ?? [];

    const uniqueColors: SupportedColor[] = Array.from(new Set(canonicalColors)).filter(
      (color): color is SupportedColor => Boolean(COLOR_SWATCH_MAP[color])
    );

    return uniqueColors.sort((a, b) => {
      const aIndex = ORDERED_COLOR_KEYS.indexOf(a);
      const bIndex = ORDERED_COLOR_KEYS.indexOf(b);
      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [product.colors]);

  useEffect(() => {
    if (selectedColor && !availableColors.includes(selectedColor)) {
      setSelectedColor("");
    }
  }, [availableColors, selectedColor]);

  return (
    <div className="w-[220px] sm:w-[260px] lg:w-[300px] bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-[560px]">
      <Link href={`/store/product/${product.id}`} className="block">
        <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center cursor-pointer">
          <span className="text-3xl sm:text-4xl">
            {category === "workout" ? "🏃‍♂️" : category === "premium" ? "✨" : "👕"}
          </span>
        </div>
      </Link>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{product.description}</p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">${product.price}</p>
          <div className="text-xs sm:text-sm text-gray-500">{product.sizes.length} sizes available</div>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col gap-2 mt-auto">
          <div className="flex flex-wrap gap-2 min-h-[28px]">
            {availableColors.length > 0 ? (
              availableColors.slice(0, 4).map((color) => (
                <ColorSquare
                  key={color}
                  color={color}
                  selected={selectedColor === color}
                  onClick={() => setSelectedColor(color)}
                />
              ))
            ) : (
              <span className="text-xs text-gray-500">Color currently unavailable</span>
            )}
          </div>
          <div className="flex gap-2">
            <div className="flex flex-1 items-center gap-1">
              <label htmlFor={`size-${product.id}`} className="text-xs font-medium w-12">
                Size:
              </label>
              <select
                id={`size-${product.id}`}
                className="w-full px-2 py-1 border border-gray-400 rounded-lg text-xs bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
                value={selectedSize}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSize(e.target.value)}
              >
                <option value="">Select size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-1 items-center gap-1">
              <label htmlFor={`quantity-${product.id}`} className="text-xs font-medium w-12">
                Qty:
              </label>
              <input
                id={`quantity-${product.id}`}
                type="number"
                min={1}
                max={99}
                value={quantity}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuantity(Math.max(1, Number(e.target.value)))
                }
                className="w-full px-2 py-1 border border-gray-400 rounded-lg text-xs bg-white text-gray-700 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all input-number-spin-visible"
              />
            </div>
          </div>
          <button
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm mb-2 ${
              !selectedSize || !selectedColor ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={!selectedSize || !selectedColor}
            onClick={() => {
              if (!selectedSize) {
                setError("Please select a size.");
                return;
              }
              if (!selectedColor) {
                setError("Please select a color.");
                return;
              }
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize,
                color: formatColorLabel(selectedColor),
                image: product.image,
                qty: quantity,
                colors: availableColors.map(formatColorLabel)
              });
              setError("");
            }}
          >
            {!selectedSize ? "Select size" : !selectedColor ? "Select color" : "Add to Cart"}
          </button>
          {error && <div className="text-red-600 text-xs mb-1">{error}</div>}
        </div>
      </div>
    </div>
  );
}

