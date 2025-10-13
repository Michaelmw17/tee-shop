"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "../app/components/CartContext";
import { Menu, X, ShoppingCart } from "lucide-react";

export default function Navbar({ category }: { category?: string }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Mobile First Layout */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-serif italic text-black">Eliza Tees</h1>
          </Link>
          <div className="hidden lg:flex justify-center items-center space-x-2 py-4">
            <Link
              href="/store/category/affordable"
              className={`px-4 py-2 rounded font-medium transition-colors ${pathname === "/store/category/affordable" || category === "affordable" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800"}`}
            >Affordable Tees</Link>
            <Link
              href="/store/category/workout"
              className={`px-4 py-2 rounded font-medium transition-colors ${pathname === "/store/category/workout" || category === "workout" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800"}`}
            >Workout Gear</Link>
            <Link
              href="/store/category/premium"
              className={`px-4 py-2 rounded font-medium transition-colors ${pathname === "/store/category/premium" || category === "premium" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800"}`}
            >Premium Collection</Link>
            <Link
              href="/store"
              className={`px-4 py-2 rounded font-medium transition-colors ${pathname === "/store" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800 hover:bg-blue-100 hover:text-blue-800"}`}
            >Store Locator</Link>
          </div>
          {/* Cart & Hamburger (mobile only) */}
          <div className="flex items-center space-x-2">
            <Link href="/store/cart" className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="h-6 w-6 text-black" />
              {hasMounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {/* Hamburger only on mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-black" />
              ) : (
                <Menu className="h-6 w-6 text-black" />
              )}
            </button>
          </div>
        </div>
        {/* Mobile Nav Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 bg-white">
            <div className="flex flex-col space-y-2">
              <Link href="/store/category/affordable" className="hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Affordable Tees</Link>
              <Link href="/store/category/workout" className="hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Workout Gear</Link>
              <Link href="/store/category/premium" className="hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Premium Collection</Link>
              <Link href="/store" className="hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors" onClick={() => setIsMenuOpen(false)}>Store Locator</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}