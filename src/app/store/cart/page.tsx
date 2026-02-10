"use client";
import { useCart } from "../../../components/CartContext";
import ColorSquare from "../../../components/ColorSquare";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import AlertModal from "@/components/AlertModal";

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  color: string;
  image: string;
  qty: number;
  colors?: string[];
}

export default function CartPage() {
  const { cartItems, updateQty, clearCart } = useCart();
  const [modalItem, setModalItem] = useState<CartItem | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stockWarnings, setStockWarnings] = useState<Record<string, string | null>>({});
  const [stockLevels, setStockLevels] = useState<Record<string, number>>({});
  const [stockLimitModal, setStockLimitModal] = useState<{maxAvailable: number} | null>(null);
  const [errorModal, setErrorModal] = useState<{title: string; message: string} | null>(null);
  const router = useRouter();

  // Check stock for all cart items
  useEffect(() => {
    if (cartItems.length > 0) {
      console.log('🛒 Cart items to check:', cartItems);
      
      // Fetch stock warnings for all items
      Promise.all(
        cartItems.map((item) => {
          console.log('📤 Checking stock for:', { id: item.id, color: item.color, size: item.size });
          
          return fetch('/api/inventory/check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: item.id,
              color: item.color,
              size: item.size
            })
          })
          .then(res => res.json())
          .then(result => {
            console.log('📥 Stock check response:', result);
            return {
              key: `${item.id}-${item.color}-${item.size}`,
              warning: result.warning || null,
              stock: result.stock || 0
            };
          })
          .catch(err => {
            console.error('Failed to fetch stock warning:', err);
            return {
              key: `${item.id}-${item.color}-${item.size}`,
              warning: null,
              stock: 0
            };
          });
        })
      ).then(results => {
        const warnings: Record<string, string | null> = {};
        const stocks: Record<string, number> = {};
        results.forEach(r => {
          warnings[r.key] = r.warning;
          stocks[r.key] = r.stock;
        });
        console.log('✅ Final warnings:', warnings);
        console.log('📊 Stock levels:', stocks);
        setStockWarnings(warnings);
        setStockLevels(stocks);
      });
    }
  }, [cartItems]);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle stock validation errors from the backend
        if (data.error === 'Insufficient stock' && data.details) {
          setErrorModal({
            title: 'Stock Unavailable',
            message: `Some items in your cart are no longer available:\n\n${data.details.join('\n')}\n\nPlease adjust your cart and try again.`
          });
          setLoading(false);
          return;
        }
        throw new Error(data.error || 'Checkout failed');
      }
      
      if (data.url) {
        // Modern Stripe checkout - redirect directly to checkout URL
        window.location.href = data.url;
      } else if (data.message && data.setupUrl) {
        // Development mode with helpful setup message
        const setupNow = confirm(
          `${data.message}\n\nWould you like to open the Stripe dashboard to get your test keys?`
        );
        if (setupNow) {
          window.open(data.setupUrl, '_blank');
        }
      } else {
        setErrorModal({
          title: 'Checkout Error',
          message: `Failed to create checkout session: ${data.error || 'Unknown error'}`
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrorModal({
        title: 'Checkout Failed',
        message: 'Checkout failed. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div>
        <Navbar />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
          <div className="text-gray-500">Loading cart...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="bg-gray-100 rounded-full p-8 mb-6">
              <svg 
                className="w-24 h-24 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-center mb-8 max-w-sm">
              Looks like you haven&apos;t added any items to your cart yet. Start shopping to find your perfect tee!
            </p>
            <button
              onClick={() => router.push('/#product-details')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="space-y-6">
              {cartItems.map((item: CartItem) => {
                const stockKey = `${item.id}-${item.color}-${item.size}`;
                const stockWarning = stockWarnings[stockKey];
                const currentStock = stockLevels[stockKey] || 0;
                const itemTotal = (item.price * item.qty).toFixed(2);
                
                return (
                  <div key={item.id + item.size + item.color} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                    <div className="p-6">
                      {/* Main Grid Layout */}
                      <div className="grid grid-cols-1 md:grid-cols-[140px_1fr_auto] gap-6 items-start">
                        {/* Product Image */}
                        <div className="flex justify-center md:justify-start">
                          <div className="relative group">
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={140}
                              height={140}
                              className="w-32 h-32 md:w-36 md:h-36 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                            />
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="space-y-3">
                          <h3 className="font-bold text-xl text-gray-900">{item.name}</h3>
                          
                          {/* Size and Color Info */}
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 font-medium">Size:</span>
                              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-semibold text-gray-800">{item.size}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 font-medium">Color:</span>
                              <div className="flex gap-1.5">
                                {item.colors && Array.isArray(item.colors) ? (
                                  item.colors.map((color) => (
                                    <ColorSquare
                                      key={color}
                                      color={color}
                                      selected={item.color === color}
                                      onClick={() => updateQty(item.id, item.size, color, item.qty)}
                                      className="w-7 h-7 cursor-pointer hover:scale-110 transition-transform"
                                    />
                                  ))
                                ) : (
                                  <ColorSquare
                                    color={item.color}
                                    selected={true}
                                    onClick={() => {}}
                                    className="w-7 h-7"
                                  />
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Price and Item Total */}
                          <div className="flex items-baseline gap-3">
                            <span className="text-lg font-bold text-gray-900">${item.price}</span>
                            {item.qty > 1 && (
                              <>
                                <span className="text-gray-400">×</span>
                                <span className="text-sm text-gray-600">{item.qty}</span>
                                <span className="text-gray-400">=</span>
                                <span className="text-lg font-bold text-green-600">${itemTotal}</span>
                              </>
                            )}
                          </div>

                          {/* Stock Warnings */}
                          {stockWarning && (
                            <div className={`inline-flex items-center gap-2 text-sm font-bold py-2 px-4 rounded-lg ${
                              stockWarning === 'SOLD OUT' 
                                ? 'bg-red-600 text-white animate-pulse' 
                                : typeof stockWarning === 'string' && stockWarning.includes('Only')
                                ? 'bg-orange-500 text-white'
                                : 'bg-yellow-500 text-white'
                            }`}>
                              <span className="text-lg">⚠️</span>
                              <span>{stockWarning}</span>
                            </div>
                          )}
                          {!stockWarning && currentStock > 0 && item.qty > currentStock && (
                            <div className="inline-flex items-center gap-2 text-sm font-bold py-2 px-4 rounded-lg bg-red-600 text-white animate-pulse">
                              <span className="text-lg">⚠️</span>
                              <span>Only {currentStock} available (you have {item.qty})</span>
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex md:flex-col items-center md:items-end gap-4 justify-between md:justify-start">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                            <label htmlFor={`quantity-${item.id}-${item.size}-${item.color}`} className="font-semibold text-sm text-gray-700">Qty:</label>
                            <input
                              id={`quantity-${item.id}-${item.size}-${item.color}`}
                              type="number"
                              min={1}
                              max={currentStock > 0 ? currentStock : 999}
                              step={1}
                              value={item.qty}
                              onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
                              onChange={e => {
                                const val = Number(e.target.value);
                                const maxAvailable = currentStock > 0 ? currentStock : 999;
                                
                                if (val > maxAvailable && currentStock > 0) {
                                  updateQty(item.id, item.size, item.color, maxAvailable);
                                  setTimeout(() => {
                                    setStockLimitModal({ maxAvailable });
                                  }, 100);
                                } else {
                                  updateQty(item.id, item.size, item.color, Math.max(1, val || 1));
                                }
                              }}
                              onBlur={e => {
                                const val = Number(e.target.value);
                                const maxAvailable = currentStock > 0 ? currentStock : 999;
                                if (val > maxAvailable && currentStock > 0) {
                                  updateQty(item.id, item.size, item.color, maxAvailable);
                                } else if (!val || val < 1) {
                                  updateQty(item.id, item.size, item.color, 1);
                                }
                              }}
                              className={`w-20 px-3 py-2 rounded-lg border-2 ${
                                item.qty > currentStock && currentStock > 0
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-300 bg-white'
                              } text-gray-900 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all input-number-spin-visible`}
                              title={currentStock > 0 ? `Max available: ${currentStock}` : ''}
                            />
                          </div>
                          
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                            aria-label="Delete item"
                            onClick={() => setModalItem(item)}
                          >
                            <span className="text-xl">🗑️</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Clear Cart Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-lg transition-colors duration-200 font-semibold text-sm shadow-sm hover:shadow-md"
                onClick={() => clearCart()}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
        {/* Checkout Section */}
        {cartItems.length > 0 && (() => {
          const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
          const freeShippingThreshold = 200;
          const standardShipping = subtotal >= freeShippingThreshold ? 0 : 10;
          const isFreeShipping = standardShipping === 0;
          const total = subtotal + standardShipping;
          
          return (
            <div className="mt-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-lg p-8 border border-gray-200">
              {/* Order Summary Header */}
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Subtotal ({cartItems.reduce((sum, item) => sum + item.qty, 0)} items):</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-700">
                  <span className="font-medium">Standard Shipping:</span>
                  {isFreeShipping ? (
                    <span className="font-semibold text-green-600">FREE</span>
                  ) : (
                    <span className="font-semibold">${standardShipping.toFixed(2)}</span>
                  )}
                </div>
                {!isFreeShipping && (
                  <div className="text-xs text-gray-500 text-right">
                    Free shipping on orders ${freeShippingThreshold}+
                  </div>
                )}
                <div className="border-t border-gray-300 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">Total:</span>
                    <span className="text-3xl font-bold text-green-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-8 rounded-xl transition-all duration-200 text-lg font-bold shadow-md hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Redirecting to Checkout...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span>Proceed to Checkout</span>
                  <span>🔒</span>
                </span>
              )}
            </button>
            
            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Secure checkout powered by Stripe</span>
            </div>
          </div>
          );
        })()}

        {cartItems.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2.5 rounded-lg transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
              onClick={() => router.back()}
            >
              ← Continue Shopping
            </button>
          </div>
        )}

        {/* Delete confirmation modal */}
        {modalItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={() => setModalItem(null)}
          >
            <div
              className="bg-white rounded-lg shadow-lg p-6 max-w-xs w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex flex-col items-center">
                <Image src={modalItem.image} alt={modalItem.name} width={80} height={80} className="w-20 h-20 object-cover rounded border mb-2" />
                <div className="font-semibold text-lg mb-1">{modalItem.name}</div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-full text-lg font-bold border border-gray-200 shadow hover:bg-red-900"
                    onClick={() => {
                      updateQty(modalItem.id, modalItem.size, modalItem.color, 0);
                      setModalItem(null);
                    }}
                    aria-label="Delete item"
                  >🗑️</button>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-1 rounded font-bold hover:bg-gray-400"
                    onClick={() => setModalItem(null)}
                  >Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Limit Modal */}
        <AlertModal
          isOpen={stockLimitModal !== null}
          onClose={() => setStockLimitModal(null)}
          title="Stock Limit Reached"
          emoji="🙏"
          gradientFrom="orange-400"
          gradientTo="red-500"
        >
          <p className="text-gray-700 mb-4">
            Thank you for your interest!
          </p>
          <p className="text-gray-700 mb-4">
            <strong>Maximum available: {stockLimitModal?.maxAvailable || 0} items</strong>
          </p>
          <p className="text-gray-600 text-sm">
            Your quantity has been adjusted. If our beta launch goes well, we&apos;ll have more stock and colors available soon!
          </p>
        </AlertModal>

        {/* Error Modal */}
        <AlertModal
          isOpen={errorModal !== null}
          onClose={() => setErrorModal(null)}
          title={errorModal?.title || "Error"}
          emoji="⚠️"
          gradientFrom="red-400"
          gradientTo="red-600"
        >
          <p className="text-gray-700 whitespace-pre-line">
            {errorModal?.message}
          </p>
        </AlertModal>
      </div>
    </div>
  );
}
