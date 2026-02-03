"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../components/CartContext";
import ColorSquare, { getCanonicalColorName } from "./ColorSquare";
import { COLOR_SWATCH_MAP, ORDERED_COLOR_KEYS, SupportedColor } from "@/data/colors";
import { Product } from "@/types/product";

const formatColorLabel = (color: SupportedColor | "" | null) =>
  color ? color.charAt(0).toUpperCase() + color.slice(1) : "";

export default function ProductCard({ 
  product, 
  category,
  size = "default" 
}: { 
  product: Product; 
  category: string;
  size?: "default" | "large";
}) {
  const [selectedSize, setSelectedSize] = useState("");
  type SelectedColor = SupportedColor | "";
  const [selectedColor, setSelectedColor] = useState<SelectedColor>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [error, setError] = useState("");
  const [showColorPrompt, setShowColorPrompt] = useState(false);
  const [showSizePrompt, setShowSizePrompt] = useState(false);

  // Responsive width based on size variant
  const cardWidthClasses = size === "large" 
    ? "w-full max-w-[360px] sm:max-w-[380px] md:max-w-[400px]"
    : "w-[220px] sm:w-[260px] lg:w-[300px]";
  
  // Image height based on size variant
  const imageHeightClasses = size === "large"
    ? "h-56 sm:h-64 md:h-72"
    : "h-48 sm:h-56 lg:h-64";
  
  // Text sizing based on variant
  const titleClasses = size === "large"
    ? "text-xl sm:text-2xl font-semibold mb-3"
    : "text-lg sm:text-xl font-semibold mb-2";
  
  const descriptionClasses = size === "large"
    ? "text-gray-600 mb-4 text-sm sm:text-base"
    : "text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base";
  
  const priceClasses = size === "large"
    ? "text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0"
    : "text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0";
  
  const buttonTextClasses = size === "large"
    ? "text-sm sm:text-base"
    : "text-xs sm:text-sm";

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
    <div className={`${cardWidthClasses} bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col min-h-[560px] ${showColorPrompt || showSizePrompt ? 'button-hovered' : ''}`}>
      <Link href={`/store/product/${product.id}`} className="block">
        <div className={`${imageHeightClasses} bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center cursor-pointer`}>
          <span className="text-3xl sm:text-4xl">
            {category === "workout" ? "🏃‍♂️" : category === "premium" ? "✨" : "👕"}
          </span>
        </div>
      </Link>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className={titleClasses}>{product.name}</h3>
        <p className={descriptionClasses}>{product.description}</p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
          <p className={priceClasses}>${product.price}</p>
          <div className="text-xs sm:text-sm text-gray-500">{product.sizes.length} sizes available</div>
        </div>
        <div className="flex-1" />
        <div className="flex flex-col gap-3 mt-auto">
          {/* Color Selection with Label */}
          <div className={`transition-all duration-300 ${
            showColorPrompt ? 'animate-shake' : ''
          }`}>
            <div className="flex items-center justify-between mb-1.5">
              <label className={`text-xs font-medium transition-colors ${
                !selectedColor && showColorPrompt ? 'text-red-600' : 'text-gray-700'
              }`}>
                Color: {!selectedColor && showColorPrompt && <span className="text-red-600">*</span>}
              </label>
              {selectedColor && (
                <span className="text-xs text-gray-600">{formatColorLabel(selectedColor)}</span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 min-h-[28px]">
              {availableColors.length > 0 ? (
                availableColors.slice(0, 4).map((color) => (
                  <div 
                    key={color}
                    className={`transform transition-transform hover:scale-110 ${
                      !selectedColor && showColorPrompt 
                        ? 'wiggle-on-hover' 
                        : ''
                    }`}
                  >
                    <ColorSquare
                      color={color}
                      selected={selectedColor === color}
                      onClick={() => {
                        if (selectedColor === color) {
                          setSelectedColor(""); // Deselect if already selected
                        } else {
                          setSelectedColor(color); // Select new color
                        }
                        setShowColorPrompt(false);
                      }}
                    />
                  </div>
                ))
              ) : (
                <span className="text-xs text-gray-500">Color currently unavailable</span>
              )}
            </div>
          </div>
          
          {/* Size and Quantity Row */}
          {/* Size and Quantity Row */}
          <div className="flex gap-2">
            <div className={`flex flex-1 items-center gap-1 ${!selectedSize && showSizePrompt ? 'shake-on-hover' : ''}`}>
              <label htmlFor={`size-${product.id}`} className={`text-xs font-medium w-12 transition-colors ${
                !selectedSize && showSizePrompt ? 'text-red-600' : 'text-gray-700'
              }`}>
                Size: {!selectedSize && showSizePrompt && <span className="text-red-600">*</span>}
              </label>
              <div className="flex-1 relative">
                <select
                  id={`size-${product.id}`}
                  className={`w-full pl-2 pr-7 py-1.5 border-2 rounded-lg text-xs bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all hover:border-blue-400 text-center appearance-none ${
                    selectedSize 
                      ? 'border-green-500' 
                      : showSizePrompt 
                      ? 'border-red-400 animate-shake' 
                      : 'border-gray-300'
                  }`}
                  value={selectedSize}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setSelectedSize(e.target.value);
                    setShowSizePrompt(false);
                  }}
                >
                  <option value="">Select size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-700">
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
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
                className="w-full px-2 py-1.5 border-2 border-gray-300 rounded-lg text-xs bg-white text-gray-700 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all input-number-spin-visible hover:border-blue-400"
              />
            </div>
          </div>
          
          {/* Add to Cart Button with Dynamic Text */}
          <button
            className={`group w-full bg-blue-600 text-white py-2.5 px-4 rounded transition-colors ${buttonTextClasses} font-medium ${
              !selectedSize || !selectedColor 
                ? "opacity-50 cursor-not-allowed" 
                : "hover:bg-blue-700"
            }`}
            type="button"
            title={!selectedColor ? "Please select a color" : !selectedSize ? "Please select a size" : "Add to cart"}
            onMouseEnter={() => {
              if (!selectedColor) {
                setShowColorPrompt(true);
              }
              if (!selectedSize) {
                setShowSizePrompt(true);
              }
            }}
            onMouseLeave={() => {
              setShowColorPrompt(false);
              setShowSizePrompt(false);
            }}
            onClick={() => {
              if (!selectedColor || !selectedSize) {
                return;
              }
              addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                size: selectedSize,
                color: formatColorLabel(selectedColor),
                image: product.images[0],
                qty: quantity,
                colors: availableColors.map(formatColorLabel)
              });
              setError("");
            }}
          >
            {!selectedColor
              ? "Select a color" 
              : !selectedSize 
              ? "Select a size" 
              : "Add to Cart"}
          </button>
          {error && <div className="text-red-600 text-xs mb-1">{error}</div>}
        </div>
      </div>
    </div>
  );
}

