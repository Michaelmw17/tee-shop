"use client";

import React, { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import { useParams, useRouter, notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import ColorSquare from "@/components/ColorSquare";
import Image from "next/image";
import { Product } from "@/types/product";
import { BETA_MODE, BETA_FEATURES } from "@/config/beta";

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
  const [product, setProduct] = useState<ProductWithStringId | null>(null);
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [stockWarning, setStockWarning] = useState<string | null>(null);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [currentStock, setCurrentStock] = useState<number>(0);

  // Beta mode: Block access to product pages if disabled
  useEffect(() => {
    if (BETA_MODE && !BETA_FEATURES.showProductPages) {
      notFound();
      return;
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
      
      // Fetch available colors after product loads
      if (data) {
        fetch('/api/inventory/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: Number(data.id),
            allColors: data.colors
          })
        })
        .then(res => res.json())
        .then(result => {
          if (result.availableColors) {
            setAvailableColors(result.availableColors);
          }
        })
        .catch(err => console.error('Failed to fetch available colors:', err));
      }
    });
  }, [id, betaChecked]);

  // Update available sizes and stock warning when color or size changes
  useEffect(() => {
    if (!product) return;
    
    if (selectedColor) {
      // Fetch available sizes for selected color
      fetch('/api/inventory/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(product.id),
          color: selectedColor,
          allSizes: product.sizes
        })
      })
      .then(res => res.json())
      .then(result => {
        if (result.availableSizes) {
          setAvailableSizes(result.availableSizes);
        }
      })
      .catch(err => console.error('Failed to fetch available sizes:', err));
    } else {
      setAvailableSizes(product.sizes);
    }
    
    if (selectedColor && selectedSize) {
      // Fetch stock warning
      fetch('/api/inventory/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: Number(product.id),
          color: selectedColor,
          size: selectedSize
        })
      })
      .then(res => res.json())
      .then(result => {
        setStockWarning(result.warning || null);
        setCurrentStock(result.stock || 0);
        
        console.log('📊 Stock fetched:', { stock: result.stock, warning: result.warning, currentStock: result.stock });
        
        // Reset quantity if it exceeds available stock
        if (quantity > (result.stock || 0)) {
          console.log('⚠️ Quantity exceeds new stock, resetting:', { quantity, newStock: result.stock });
          setQuantity(Math.min(quantity, result.stock || 1));
        }
      })
      .catch(err => console.error('Failed to fetch stock warning:', err));
    } else {
      setStockWarning(null);
      setCurrentStock(0);
    }
  }, [product, selectedColor, selectedSize, quantity]);

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
                  {product.colors.map((color) => {
                    const isAvailable = availableColors.includes(color);
                    return (
                      <div
                        key={color}
                        className={`transform transition-transform ${
                          isAvailable ? 'hover:scale-125' : 'opacity-40 cursor-not-allowed'
                        } ${
                          !selectedColor && showColorPrompt && isAvailable
                            ? 'wiggle-on-hover' 
                            : ''
                        }`}
                        title={isAvailable ? color : `${color} - SOLD OUT`}
                      >
                        <ColorSquare
                          color={color}
                          selected={selectedColor === color}
                          onClick={() => {
                            if (!isAvailable) return;
                            if (selectedColor === color) {
                              setSelectedColor(""); // Deselect if already selected
                            } else {
                              setSelectedColor(color); // Select new color
                              setSelectedSize(""); // Reset size when color changes
                            }
                            setShowColorPrompt(false);
                          }}
                        />
                      </div>
                    );
                  })}
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
                    {product.sizes.map(size => {
                      const isAvailable = availableSizes.includes(size);
                      return (
                        <option 
                          key={size} 
                          value={size} 
                          disabled={!isAvailable}
                          className={`text-center ${isAvailable ? 'text-gray-700' : 'text-gray-400'}`}
                        >
                          {size} {!isAvailable ? '(Sold Out)' : ''}
                        </option>
                      );
                    })}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-gray-700">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              {/* Stock Warning */}
              {selectedColor && selectedSize && currentStock > 0 && (
                <div className="text-center font-semibold py-2 px-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                  ✓ {currentStock} available
                </div>
              )}
              {stockWarning && (
                <div className={`text-center font-semibold py-2 px-4 rounded-lg ${
                  stockWarning === 'SOLD OUT' 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                }`}>
                  {stockWarning}
                </div>
              )}
              {/* Quantity */}
              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="font-semibold w-20">Quantity:</label>
                <div className="flex-1">
                  <input
                    id="quantity"
                    type="number"
                    min={1}
                    max={selectedColor && selectedSize ? currentStock : 99}
                    value={quantity}
                    onChange={e => {
                      const val = Number(e.target.value);
                      const maxStock = selectedColor && selectedSize ? currentStock : 99;
                      
                      console.log('📝 Quantity onChange:', { val, maxStock, currentStock, selectedColor, selectedSize });
                      
                      if (val > maxStock && selectedColor && selectedSize) {
                        // Auto-correct and notify
                        console.log('🚫 Exceeds max! Correcting to:', maxStock);
                        setQuantity(maxStock);
                        alert(`🙏 Thank you for your interest!\n\nMaximum available: ${maxStock} items\n\nYour quantity has been adjusted. If our beta launch goes well, we'll have more stock and colors available soon!`);
                      } else {
                        const newQty = Math.max(1, Math.min(val, maxStock));
                        console.log('✅ Setting quantity to:', newQty);
                        setQuantity(newQty);
                      }
                    }}
                    onBlur={e => {
                      const val = Number(e.target.value);
                      const maxStock = selectedColor && selectedSize ? currentStock : 99;
                      if (val > maxStock && selectedColor && selectedSize) {
                        setQuantity(maxStock);
                      }
                    }}
                    disabled={!selectedColor || !selectedSize || currentStock === 0}
                    className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all text-center hover:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder={selectedColor && selectedSize ? `Max: ${currentStock}` : "Select color & size"}
                  />
                </div>
              </div>
              {/* Add to Cart */}
              <button
                type="button"
                disabled={isAddingToCart || !selectedSize || !selectedColor || stockWarning === 'SOLD OUT' || currentStock === 0}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded transition-colors text-xs sm:text-sm mb-2 font-medium ${
                  !selectedSize || !selectedColor || isAddingToCart || stockWarning === 'SOLD OUT' || currentStock === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                }`}
                title={
                  currentStock === 0 && selectedColor && selectedSize ? "Out of stock" :
                  stockWarning === 'SOLD OUT' ? "This item is sold out" :
                  !selectedColor ? "Please select a color" : 
                  !selectedSize ? "Please select a size" : 
                  "Add to cart"
                }
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
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  console.log('🛒 Add to Cart clicked:', { selectedColor, selectedSize, quantity, currentStock, stockWarning });
                  
                  if (!selectedColor || !selectedSize || isAddingToCart || stockWarning === 'SOLD OUT' || currentStock === 0) {
                    console.log('❌ Cannot add - validation failed');
                    return;
                  }
                  
                  // Double-check quantity against available stock before adding
                  if (quantity > currentStock) {
                    console.log('❌ Quantity exceeds stock:', { quantity, currentStock });
                    alert(`🙏 Thank you for your interest!\n\nMaximum available: ${currentStock} items\n\nYour quantity has been adjusted. If our beta launch goes well, we'll have more stock and colors available soon!`);
                    setQuantity(currentStock);
                    return;
                  }
                  
                  console.log('✅ Validation passed, adding to cart:', { quantity, currentStock });
                  
                  setIsAddingToCart(true);
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
                  setQuantity(1); // Reset quantity after adding to cart
                  
                  // Re-enable button after a short delay
                  setTimeout(() => setIsAddingToCart(false), 500);
                }}
              >
                {stockWarning === 'SOLD OUT'
                  ? "SOLD OUT"
                  : !selectedColor
                  ? "Select a color" 
                  : !selectedSize 
                  ? "Select a size" 
                  : isAddingToCart
                  ? "Adding..."
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

