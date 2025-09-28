'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
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
            <h1 className="text-2xl font-serif italic text-black">Yogi Tees</h1>
          </Link>
          {/* Cart & Hamburger (mobile only) */}
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ShoppingCart className="h-6 w-6 text-black" />
            </button>
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
        {/* Desktop Nav - horizontal links, no hamburger */}
        <div className="hidden lg:flex justify-center items-center space-x-8 py-4">
          <Link href="/store/category/affordable" className="hover:text-gray-600 font-medium transition-colors">Affordable Tees</Link>
          <Link href="/store/category/workout" className="hover:text-gray-600 font-medium transition-colors">Workout Gear</Link>
          <Link href="/store/category/premium" className="hover:text-gray-600 font-medium transition-colors">Premium Collection</Link>
          <Link href="/store" className="hover:text-gray-600 font-medium transition-colors">Store Locator</Link>
        </div>
      </div>
    </nav>
  );
}