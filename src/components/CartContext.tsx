"use client";
import React, { createContext, useContext, useState } from "react";

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
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  // Persist cartItems to localStorage whenever it changes
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, "qty"> & { qty?: number }) => {
    setCartItems((prev) => {
      const idx = prev.findIndex(
        (i) =>
          i.id === item.id &&
          i.size === item.size &&
          i.color === item.color
      );
      if (idx !== -1) {
        // If item exists, increase qty
        const updated = [...prev];
        updated[idx].qty += item.qty ?? 1;
        return updated;
      }
      // If new item, add with provided qty or 1
      return [...prev, { ...item, qty: item.qty ?? 1 }];
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const updateQty = (id: number, size: string, color: string, qty: number) => {
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
  };

  return (
    <CartContext.Provider value={{ cartCount, cartItems, addToCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
