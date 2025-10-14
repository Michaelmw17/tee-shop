"use client";
import { useCart } from "../../../components/CartContext";
import ColorSquare from "../../../components/ColorSquare";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

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
  const router = useRouter();

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
          <div className="text-gray-500">Your cart is empty.</div>
        ) : (
          <>
            <ul className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <li key={item.id + item.size + item.color} className="bg-white rounded-lg shadow p-4 flex flex-col min-[360px]:flex-row min-[360px]:items-center min-[360px]:justify-between">
                  <div>
                    <div className="font-semibold text-lg">{item.name}</div>
                    <div className="text-sm text-gray-600">Size: {item.size}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2">Color:
                      {/* Show all color options as small squares, allow changing */}
                      {item.colors && Array.isArray(item.colors) ? (
                        item.colors.map((color) => (
                          <ColorSquare
                            key={color}
                            color={color}
                            selected={item.color === color}
                            onClick={() => updateQty(item.id, item.size, color, item.qty)}
                            className="w-6 h-6"
                          />
                        ))
                      ) : (
                        <ColorSquare
                          color={item.color}
                          selected={true}
                          onClick={() => {}}
                          className="w-6 h-6"
                        />
                      )}
                    </div>
                    <div className="text-sm text-gray-800 font-bold mt-1">${item.price}</div>
                  </div>
                  <div className="mt-2 min-[360px]:mt-0 flex items-center gap-2 min-[360px]:justify-end">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <div className="flex items-center gap-2">
                      <label htmlFor={`quantity-${item.id}-${item.size}-${item.color}`} className="font-semibold text-xs">Quantity:</label>
                      <input
                        id={`quantity-${item.id}-${item.size}-${item.color}`}
                        type="number"
                        min={1}
                        value={item.qty}
                        onChange={e => {
                          const val = Math.max(1, Number(e.target.value));
                          updateQty(item.id, item.size, item.color, val);
                        }}
                        className="w-20 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs text-center focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all input-number-spin-visible"
                      />
                      <button
                        className="bg-red-500 text-white px-2 py-1 rounded-full text-lg font-bold border border-gray-200 shadow hover:bg-red-900"
                        aria-label="Delete item"
                        onClick={() => setModalItem(item)}
                      >🗑️</button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm font-semibold"
                onClick={() => clearCart()}
              >Delete All</button>
            </div>
          </>
        )}
        <div className="mt-8">
          <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-semibold"
            onClick={() => router.back()}
          >Go Back</button>
        </div>

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
                <img src={modalItem.image} alt={modalItem.name} className="w-20 h-20 object-cover rounded border mb-2" />
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
      </div>
    </div>
  );
}
