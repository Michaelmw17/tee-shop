"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";

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

export default function Home() {
  const [affordableProducts, setAffordableProducts] = useState<Product[]>([]);
  const [workoutProducts, setWorkoutProducts] = useState<Product[]>([]);
  const [premiumProducts, setPremiumProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const affordableRes = await fetch("/api/products/category/affordable");
        const workoutRes = await fetch("/api/products/category/workout");
        const premiumRes = await fetch("/api/products/category/premium");
        const affordable = affordableRes.ok ? (await affordableRes.json()).products : [];
        const workout = workoutRes.ok ? (await workoutRes.json()).products : [];
        const premium = premiumRes.ok ? (await premiumRes.json()).products : [];
        setAffordableProducts(affordable || []);
        setWorkoutProducts(workout || []);
        setPremiumProducts(premium || []);
      } catch {
        setAffordableProducts([]);
        setWorkoutProducts([]);
        setPremiumProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white px-4 py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-gray-800 mb-6 sm:mb-8">
            Get That Comfort Feeling
          </h2>
          {/* Hero Image - Responsive */}
          <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-4xl sm:text-5xl lg:text-6xl">👫</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
                  Happy couple wearing our premium tees
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Product Sections */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Affordable Tees Section */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-serif text-center mb-6 sm:mb-8 text-gray-800">
              Affordable Tees
            </h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {affordableProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} category="affordable" />
                ))}
              </div>
            )}
          </div>
          {/* Workout Gear Section */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-serif text-center mb-6 sm:mb-8 text-gray-800">
              Workout Tees & Singlets
            </h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {workoutProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} category="workout" />
                ))}
              </div>
            )}
          </div>
          {/* Premium Collection Section */}
          <div className="mb-12 sm:mb-16">
            <h3 className="text-2xl sm:text-3xl font-serif text-center mb-6 sm:mb-8 text-gray-800">
              Premium Collection
            </h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {premiumProducts.map((product: Product) => (
                  <ProductCard key={product.id} product={product} category="premium" />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}