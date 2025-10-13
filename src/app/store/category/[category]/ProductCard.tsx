"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "../../../components/CartContext";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
}

export default function ProductCard({ product, category }: { product: Product; category: string }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [error, setError] = useState("");

  return (
    <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <Link href={`/store/product/${product.id}`} className="block">
        <div className="h-48 sm:h-56 lg:h-64 bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center cursor-pointer">
          <span className="text-3xl sm:text-4xl">
            {category === 'workout' ? '🏃‍♂️' : category === 'premium' ? '✨' : '👕'}
          </span>
        </div>
      </Link>
      <div className="p-4 sm:p-6 flex-1 flex flex-col">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">{product.description}</p>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
          <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">${product.price}</p>
          <div className="text-xs sm:text-sm text-gray-500">
            {product.sizes.length} sizes available
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mb-4">
          {product.colors.slice(0, 4).map((color) => (
            <button
              key={color}
              type="button"
              className={`px-2 py-1 text-xs rounded border transition-colors
                ${selectedColor === color ? "bg-blue-600 text-white border-blue-600" : "bg-gray-200 text-gray-800 border-gray-300"}
                hover:bg-blue-100 hover:border-blue-400 hover:text-blue-800`}
              onClick={() => setSelectedColor(color)}
            >
              {color}
            </button>
          ))}
        </div>
        {/* Size and Quantity side by side */}
        <div className="flex gap-2 mb-2">
          <div className="flex flex-1 items-center gap-1">
            <label htmlFor={`size-${product.id}`} className="text-xs font-medium w-12">Size:</label>
            <select
              id={`size-${product.id}`}
              className="w-full px-2 py-1 border border-gray-400 rounded-lg text-xs bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
              value={selectedSize}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSize(e.target.value)}
            >
              <option value="">Select size</option>
              {product.sizes.map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-1 items-center gap-1">
            <label htmlFor={`quantity-${product.id}`} className="text-xs font-medium w-12">Qty:</label>
            <input
              id={`quantity-${product.id}`}
              type="number"
              min={1}
              max={99}
              value={quantity}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-2 py-1 border border-gray-400 rounded-lg text-xs bg-white text-gray-700 text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
        </div>
        {/* Add to Cart button */}
        <button
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-xs sm:text-sm mb-2 ${!selectedSize || !selectedColor ? "opacity-50 cursor-not-allowed" : ""}`}
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
              color: selectedColor,
              image: product.image,
              qty: quantity
            });
            setError("");
          }}
        >
          {!selectedSize ? "Select size" : !selectedColor ? "Select color" : "Add to Cart"}
        </button>
        {error && <div className="text-red-600 text-xs mb-1">{error}</div>}
      </div>
    </div>
  );
}
