"use client";
import React, { createContext, useContext, useState, useRef, useCallback } from "react";
import AlertModal from "./AlertModal";

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

interface CartContextType {
  cartCount: number;
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, "qty"> & { qty?: number }) => void;
  updateQty: (id: number, size: string, color: string, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("cartItems");
        if (stored) {
          const parsed = JSON.parse(stored);
          // Validate the parsed data structure
          if (Array.isArray(parsed)) {
            return parsed.filter(item => 
              item && 
              typeof item.id === 'number' && 
              typeof item.name === 'string' && 
              typeof item.price === 'number' &&
              typeof item.qty === 'number' && item.qty > 0
            );
          }
        }
      } catch (error) {
        // Log error in development only
        if (process.env.NODE_ENV === 'development') {
          console.warn('Failed to parse cart items from localStorage:', error);
        }
        // Clear corrupted data
        window.localStorage.removeItem("cartItems");
      }
    }
    return [];
  });
  
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockModalData, setStockModalData] = useState({ maxAvailable: 0, requestedQty: 0, existingQty: 0 });
  
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const processingAddRef = useRef(false);

  // Persist cartItems to localStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = useCallback(async (item: Omit<CartItem, "qty"> & { qty?: number }) => {
    // Prevent React StrictMode from running this multiple times
    if (processingAddRef.current) {
      console.log('🛑 Blocked duplicate addToCart execution');
      return;
    }
    
    processingAddRef.current = true;
    const qty = item.qty ?? 1;
    
    console.log('✅ Adding to cart:', { ...item, qty });
    
    // Validate stock availability before adding to cart
    try {
      const response = await fetch('/api/inventory/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: item.id,
          color: item.color,
          size: item.size
        })
      });
      
      const stockData = await response.json();
      const availableStock = stockData.stock || 0;
      
      // Use functional setState to get the latest cart state
      setCartItems((prev) => {
        // Check existing quantity in the latest state
        const existingItem = prev.find(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );
        const existingQty = existingItem?.qty || 0;
        const totalQty = existingQty + qty;
        
        console.log('📊 Stock validation:', { 
          requested: qty, 
          existing: existingQty, 
          total: totalQty, 
          available: availableStock 
        });
        
        // If total exceeds stock, show modal and cap at max
        if (totalQty > availableStock) {
          setStockModalData({ maxAvailable: availableStock, requestedQty: qty, existingQty });
          setShowStockModal(true);
          
          const adjustedQty = Math.max(0, availableStock - existingQty);
          
          if (adjustedQty === 0) {
            // Already at max, don't change cart
            return prev;
          }
          
          // Add only what fits to reach max
          const idx = prev.findIndex(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color
          );
          
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], qty: availableStock };
            console.log(`📦 Capped at max available qty: ${updated[idx].qty}`);
            return updated;
          } else {
            console.log(`🆕 Adding new item with adjusted qty: ${adjustedQty}`);
            return [...prev, { ...item, qty: adjustedQty }];
          }
        }
        
        // Stock is sufficient, add normally
        const idx = prev.findIndex(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );
        
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
          console.log(`📦 Updated existing item to qty: ${updated[idx].qty}`);
          return updated;
        } else {
          console.log('🆕 Adding new item to cart');
          return [...prev, { ...item, qty }];
        }
      });
      
    } catch (error) {
      console.error('⚠️ Stock validation failed, proceeding anyway:', error);
      
      // Fallback: add to cart without validation
      setCartItems((prev) => {
        const idx = prev.findIndex(
          (i) => i.id === item.id && i.size === item.size && i.color === item.color
        );
        
        if (idx !== -1) {
          const updated = [...prev];
          updated[idx] = { ...updated[idx], qty: updated[idx].qty + qty };
          return updated;
        } else {
          return [...prev, { ...item, qty }];
        }
      });
    }
    
    // Reset the processing flag after state update completes
    setTimeout(() => {
      processingAddRef.current = false;
      console.log('🔓 Ready for next add');
    }, 100);
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateQty = useCallback((id: number, size: string, color: string, qty: number) => {
    setCartItems((prev) => {
      if (qty < 1) {
        return prev.filter(item => !(item.id === id && item.size === size && item.color === color));
      }
      return prev.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, qty }
          : item
      );
    });
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, updateQty, clearCart }}>
      {children}
      <AlertModal 
        isOpen={showStockModal} 
        onClose={() => setShowStockModal(false)}
        title="Thank You!"
        emoji="🙏"
        gradientFrom="blue-600"
        gradientTo="purple-600"
      >
        <div className="text-center">
          <p className="text-gray-700 text-lg mb-4">
            We appreciate your enthusiasm!
          </p>
          
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-yellow-800 font-semibold mb-3">
              Maximum available: <span className="text-2xl">{stockModalData.maxAvailable}</span> items
            </p>
            <div className="text-sm text-yellow-700 space-y-1">
              <p>• You requested: <strong>{stockModalData.requestedQty}</strong> items</p>
              <p>• Already in cart: <strong>{stockModalData.existingQty}</strong> items</p>
              <p>• Total would be: <strong>{stockModalData.requestedQty + stockModalData.existingQty}</strong> items</p>
            </div>
          </div>

          <p className="text-gray-600 mb-6">
            {stockModalData.existingQty >= stockModalData.maxAvailable 
              ? "Your cart already has the maximum available stock."
              : `We've added ${stockModalData.maxAvailable - stockModalData.existingQty} items to reach the maximum available.`
            }
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              💡 <strong>Beta Launch Special:</strong> If our launch goes well, we&apos;ll have more stock and colors available soon!
            </p>
          </div>
        </div>
      </AlertModal>
    </CartContext.Provider>
  );
}
