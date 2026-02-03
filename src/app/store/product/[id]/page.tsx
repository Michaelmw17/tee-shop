"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import ColorSquare from "@/components/ColorSquare";
import Image from "next/image";
import { Product } from "@/types/product";
import { BETA_MODE, BETA_ENABLED_PRODUCTS } from "@/config/beta";

// Extended Product type with string ID for URL params
type ProductWithStringId = Omit<Product, 'id'> & { id: string };

async function getProduct(id: string): Promise<ProductWithStringId | null> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  
  // API returns Product with number id, convert to string for component
  return {
    ...data.product,
    id: String(data.product.id)
  };
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [showColorPrompt, setShowColorPrompt] = useState(false);
  const [showSizePrompt, setShowSizePrompt] = useState(false);
  const [betaChecked, setBetaChecked] = useState(false);

  // Beta mode: Block access to non-beta products immediately
  useEffect(() => {
    if (BETA_MODE) {
      const productId = parseInt(id);
      if (!BETA_ENABLED_PRODUCTS.includes(productId)) {
        router.push('/not-found');
        return;
      }
    }
    setBetaChecked(true);
  }, [id, router]);

  useEffect(() => {
    if (!betaChecked) return; // Don't load product until beta check is complete
    
    setLoading(true);
    getProduct(id).then((data) => {
      setProduct(data);
      if (data && data.colors && data.colors.length === 1) {
        setSelectedColor(data.colors[0]);
      }
      if (data && data.category) {
        setCategory(data.category);
      }
      setLoading(false);
    });
  }, [id, betaChecked]);

  // Loader spinner component
  const Loader = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid mb-4"></div>
      <span className="text-lg text-gray-600">Loading...</span>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Navbar category={category} />
        <Loader />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar category={category} />
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <button
            type="button"
            className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded self-start"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Responsive layout
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar category={category} />
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-6">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-8 bg-white rounded-lg shadow p-4 md:p-8">
          {/* Left column: images only */}
          <div className="md:w-1/2 w-full flex flex-row md:flex-col gap-4 items-center justify-center">
            {/* Thumbnails vertical on desktop, horizontal on mobile */}
            <div className="flex md:flex-col flex-row gap-2 md:gap-4 md:order-1 order-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`border-2 rounded-lg p-1 focus:outline-none ${selectedImage === idx ? "border-blue-600" : "border-transparent"}`}
                  onClick={() => setSelectedImage(idx)}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} width={48} height={48} className="w-12 h-12 object-cover rounded" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="md:order-2 order-1 flex justify-center items-center">
              {imageLoading && <Loader />}
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                width={384}
                height={384}
                className={`rounded-lg object-cover w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 ${imageLoading ? "hidden" : "block"}`}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
          </div>

          {/* Right column: all product info and actions */}
          <div className="md:w-1/2 w-full flex flex-col gap-6">
            {/* Gray box for options */}
            <div className={`bg-gray-100 rounded-lg p-4 flex flex-col gap-4 border border-gray-300 shadow-sm ${showColorPrompt || showSizePrompt ? 'button-hovered' : ''}`}>
              {/* Color options */}
              <div className={`flex flex-row gap-2 items-center transition-all ${
                showColorPrompt ? 'animate-shake' : ''
              }`}>
                <span className={`font-semibold transition-colors ${
                  !selectedColor && showColorPrompt ? 'text-red-600' : ''
                }`}>Color: {!selectedColor && showColorPrompt && <span className="text-red-600">*</span>}</span>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className={`transform transition-transform hover:scale-125 ${
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
                  ))}
                </div>
              </div>
              {/* Size dropdown */}
              <div className={`flex items-center gap-2 w-full ${!selectedSize && showSizePrompt ? 'shake-on-hover' : ''}`}>
                <span className={`font-semibold w-20 transition-colors ${
                  !selectedSize && showSizePrompt ? 'text-red-600' : ''
                }`}>Size: {!selectedSize && showSizePrompt && <span className="text-red-600">*</span>}</span>
                <div className="flex-1 relative">
                  <select
                    className={`w-full pl-4 pr-10 py-2 rounded-lg border-2 bg-white text-gray-700 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-center hover:border-blue-400 appearance-none ${
                      selectedSize 
                        ? 'border-green-500' 
                        : showSizePrompt 
                        ? 'border-red-400 animate-shake' 
                        : 'border-gray-300'
                    }`}
                    value={selectedSize}
                    onChange={e => {
                      setSelectedSize(e.target.value);
                      setShowSizePrompt(false);
                    }}
                  >
                    <option value="" className="text-gray-400 text-center">Select size</option>
                    {product.sizes.map(size => (
                      <option key={size} value={size} className="text-gray-700 text-center">{size}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Quantity */}
              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="font-semibold w-20">Quantity:</label>
                <div className="flex-1">
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={99}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-center hover:border-blue-400"
                  />
                </div>
              </div>
              {/* Add to Cart */}
              <button
                type="button"
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded transition-colors text-xs sm:text-sm mb-2 font-medium ${
                  !selectedSize || !selectedColor ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
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
                    id: Number(product.id),
                    name: product.name,
                    price: product.price,
                    size: selectedSize,
                    color: selectedColor,
                    image: product.images[0],
                    qty: quantity
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
              {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
            </div>
            {/* Add extra margin below options box for dropdown visibility */}
            <div className="mb-1" />

            {/* Title, price, description below gray box, still in right column */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <div className="flex flex-col gap-2 items-start sm:flex-row sm:gap-4 sm:items-center">
                <span className="font-semibold">Color:</span>
                <span>{selectedColor || "None selected"}</span>
                <span className="font-semibold">Size:</span>
                <span>{selectedSize || "None selected"}</span>
                <span className="font-semibold">Price:</span>
                <span>${product.price}</span>
              </div>
              <p className="mt-2 text-gray-700">{product.description}</p>
            </div>
            <button
              type="button"
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded self-start"
              onClick={() => window.history.back()}
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

