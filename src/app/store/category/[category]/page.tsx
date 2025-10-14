"use client";
import ProductCard from "../../../../components/ProductCard";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

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

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    function updateColumns() {
      if (window.innerWidth >= 1024) setColumns(3);
      else if (window.innerWidth >= 768) setColumns(2);
      else setColumns(1);
    }
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`/api/products/category/${category}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    if (category) {
      fetchProducts();
    }
  }, [category]);
  const categoryNames: Record<string, string> = {
    affordable: 'Affordable Tees',
    workout: 'Workout Gear',
    premium: 'Premium Collection'
  };
  const isValidCategory = Object.keys(categoryNames).includes(category);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-base sm:text-lg">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-800 mb-2 sm:mb-4">
            {isValidCategory ? categoryNames[category] : 'Category not found'}
          </h1>
          {isValidCategory && (
            <p className="text-gray-600 text-sm sm:text-base">
              Discover our collection of {category} tees and apparel
            </p>
          )}
        </div>
        {isValidCategory ? (
          products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
              {products.map((product, idx) => {
                const isLast = idx === products.length - 1;
                const itemsInLastRow = products.length % columns;
                const shouldCenter = isLast && itemsInLastRow === 1 && products.length > columns;
                return (
                  <div key={product.id} className={shouldCenter ? "col-span-full flex justify-center" : "w-full flex justify-center"}>
                    <ProductCard product={product} category={category} />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-gray-600 text-base sm:text-lg">No products found in this category.</p>
            </div>
          )
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-600 text-base sm:text-lg">Category not found.</p>
            <Link href="/" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm sm:text-base">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

