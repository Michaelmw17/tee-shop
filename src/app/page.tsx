"use client";
import Navbar from "@/components/Navbar";
import ProductCard from "../components/ProductCard";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { BETA_MODE, BETA_MESSAGES } from "@/config/beta";
import { getBetaProduct, Product } from "@/lib/products";

type CategoryKey = "affordable" | "workout" | "premium";

export default function Home() {
  const [affordableProducts, setAffordableProducts] = useState<Product[]>([]);
  const [workoutProducts, setWorkoutProducts] = useState<Product[]>([]);
  const [premiumProducts, setPremiumProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const affordableCarouselRef = useRef<HTMLDivElement | null>(null);
  const workoutCarouselRef = useRef<HTMLDivElement | null>(null);
  const premiumCarouselRef = useRef<HTMLDivElement | null>(null);

  const carouselRefs = useMemo<Record<CategoryKey, MutableRefObject<HTMLDivElement | null>>>(() => ({
    affordable: affordableCarouselRef,
    workout: workoutCarouselRef,
    premium: premiumCarouselRef
  }), []);

  const [scrollState, setScrollState] = useState<Record<CategoryKey, { atStart: boolean; atEnd: boolean }>>({
    affordable: { atStart: true, atEnd: true },
    workout: { atStart: true, atEnd: true },
    premium: { atStart: true, atEnd: true }
  });

  const SCROLL_TOLERANCE = 4;

  const updateScrollState = (key: CategoryKey, container: HTMLDivElement | null) => {
    if (!container) {
      return;
    }
    const maxScroll = Math.max(Math.round(container.scrollWidth - container.clientWidth), 0);
    const position = Math.max(0, Math.round(container.scrollLeft));
    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const startThreshold = Math.max(SCROLL_TOLERANCE, Math.round(paddingLeft));
    const endThreshold = Math.max(SCROLL_TOLERANCE, Math.round(paddingRight));
    const atStart = position <= startThreshold || maxScroll === 0;
    const atEnd = Math.max(0, maxScroll - position) <= endThreshold || maxScroll === 0;

    setScrollState((prev) => {
      const current = prev[key];
      if (current && current.atStart === atStart && current.atEnd === atEnd) {
        return prev;
      }
      return {
        ...prev,
        [key]: { atStart, atEnd }
      };
    });
  };

  const CARD_SCROLL_AMOUNT = 320;

  const scrollCarousel = (key: CategoryKey, direction: "prev" | "next") => {
    const container = carouselRefs[key].current;
    if (!container) {
      return;
    }
    const maxScroll = Math.max(container.scrollWidth - container.clientWidth, 0);
    const current = container.scrollLeft;
    const target =
      direction === "next"
        ? Math.min(current + CARD_SCROLL_AMOUNT, maxScroll)
        : Math.max(current - CARD_SCROLL_AMOUNT, 0);

    container.scrollTo({ left: target, behavior: "smooth" });

    const roundedTarget = Math.max(0, Math.round(target));
    const atStart = roundedTarget <= SCROLL_TOLERANCE || maxScroll === 0;
    const atEnd = roundedTarget >= maxScroll - SCROLL_TOLERANCE || maxScroll === 0;
    setScrollState((prev) => ({
      ...prev,
      [key]: { atStart, atEnd }
    }));

    requestAnimationFrame(() => updateScrollState(key, container));
  };

  const renderCarouselSection = (title: string, products: Product[], categoryKey: CategoryKey) => {
    const hasProducts = products.length > 0;
    const carouselRef = carouselRefs[categoryKey];
    const showNavButtons = products.length > 3;

    return (
      <div className="mb-12 sm:mb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-2">
          <h3 className="text-2xl sm:text-3xl font-serif text-center sm:text-left text-gray-800">
            {title}
          </h3>
          {hasProducts && (
            <span className="text-sm sm:text-base text-gray-500 text-center sm:text-right">
              {products.length} styles to explore
            </span>
          )}
        </div>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : hasProducts ? (
          <div className="relative px-6 sm:px-10 lg:px-14">
            {showNavButtons && (
              <>
                <button
                  type="button"
                  aria-label={`Scroll ${title} carousel backward`}
                  className="flex items-center justify-center absolute left-2.5 sm:left-4 lg:left-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:opacity-60 disabled:pointer-events-none"
                  onClick={() => scrollCarousel(categoryKey, "prev")}
                  disabled={scrollState[categoryKey]?.atStart}
                >
                  &lt;
                </button>
                <button
                  type="button"
                  aria-label={`Scroll ${title} carousel forward`}
                  className="flex items-center justify-center absolute right-2.5 sm:right-4 lg:right-6 top-1/2 -translate-y-1/2 z-10 h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white shadow-md border border-gray-200 hover:bg-gray-100 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200 disabled:shadow-none disabled:cursor-not-allowed disabled:hover:bg-gray-100 disabled:opacity-60 disabled:pointer-events-none"
                  onClick={() => scrollCarousel(categoryKey, "next")}
                  disabled={scrollState[categoryKey]?.atEnd}
                >
                  &gt;
                </button>
              </>
            )}
            <div
              ref={carouselRef}
              onScroll={() => updateScrollState(categoryKey, carouselRef.current)}
              className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory cursor-grab active:cursor-grabbing pl-6 pr-6 sm:pl-10 sm:pr-10 lg:pl-14 lg:pr-14"
            >
      {products.map((product) => (
        <div
          key={product.id}
          className="flex-none w-[220px] sm:w-[260px] lg:w-[300px] snap-start"
        >
          <ProductCard product={product} category={categoryKey} />
        </div>
      ))}
    </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No products available right now. Please check back soon.
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    const entries = Object.entries(carouselRefs) as Array<[CategoryKey, MutableRefObject<HTMLDivElement | null>]>;
    const cleanups: Array<() => void> = [];

    entries.forEach(([key, ref]) => {
      const container = ref.current;
      updateScrollState(key, container);
      if (!container) {
        return;
      }

      let isDragging = false;
      let startX = 0;
      let scrollLeft = 0;
      let shouldCancelClick = false;

      const handleMouseDown = (event: MouseEvent) => {
        if (event.button !== 0 || container.scrollWidth <= container.clientWidth) {
          return;
        }

        event.preventDefault();
        isDragging = true;
        startX = event.clientX;
        scrollLeft = container.scrollLeft;
        shouldCancelClick = false;
        container.classList.add("cursor-grabbing");
      };

      const handleMouseMove = (event: MouseEvent) => {
        if (!isDragging) {
          return;
        }

        const deltaX = event.clientX - startX;

        if (!shouldCancelClick && Math.abs(deltaX) > 4) {
          shouldCancelClick = true;
        }

        event.preventDefault();
        container.scrollLeft = scrollLeft - deltaX;
        updateScrollState(key, container);
      };

      const endDrag = () => {
        if (!isDragging) {
          return;
        }

        isDragging = false;
        startX = 0;
        scrollLeft = 0;
        container.classList.remove("cursor-grabbing");

        if (shouldCancelClick) {
          setTimeout(() => {
            shouldCancelClick = false;
          }, 0);
        }

        updateScrollState(key, container);
      };

      const handleClickCapture = (event: MouseEvent) => {
        if (shouldCancelClick) {
          event.preventDefault();
          event.stopPropagation();
          shouldCancelClick = false;
        }
      };

      const handleScroll = () => updateScrollState(key, container);

      container.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", endDrag);
      container.addEventListener("click", handleClickCapture, true);
      container.addEventListener("scroll", handleScroll, { passive: true });

      cleanups.push(() => {
        container.classList.remove("cursor-grabbing");
        isDragging = false;
        shouldCancelClick = false;
        container.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", endDrag);
        container.removeEventListener("click", handleClickCapture, true);
        container.removeEventListener("scroll", handleScroll);
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [
    affordableProducts.length,
    workoutProducts.length,
    premiumProducts.length,
    carouselRefs
  ]);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const affordableRes = await fetch("/api/products/category/affordable?limit=50");
        const workoutRes = await fetch("/api/products/category/workout?limit=50");
        const premiumRes = await fetch("/api/products/category/premium?limit=50");
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
    
    // In beta mode, skip fetching all products
    if (BETA_MODE) {
      setLoading(false);
      return;
    }
    
    fetchAll();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Free Shipping Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base font-medium">
            🚚 <span className="font-bold">FREE Standard Shipping</span> on orders $200+ • Express Shipping available
          </p>
        </div>
      </div>
      
      {/* Beta Mode: Simplified Hero */}
      {BETA_MODE ? (
        <>
          {/* Beta Hero Section */}
          <section className="bg-gradient-to-b from-yellow-100 to-white px-4 py-12 sm:py-16 lg:py-18">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                Beta Launch • Limited First Run
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-800 mb-6">
                {BETA_MESSAGES.storeTitle}
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 mb-4">
                {BETA_MESSAGES.storeSubtitle}
              </p>
              <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
                {BETA_MESSAGES.comingSoon}
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="#product-details"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                >
                  Shop Now
                </Link>
                <Link
                  href="#learn-more"
                  className="bg-gray-100 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium text-lg"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </section>

          {/* Beta Product Showcase */}
          <section id="product-details" className="py-12 sm:py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-serif text-gray-800 mb-4">
                  The Beta Product
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  We&apos;re starting with one exceptional T-shirt. Perfect the basics first, 
                  then expand. This is learning cycle #1.
                </p>
              </div>

              {/* Product Card */}
              <div className="flex justify-center mb-12">
                {(() => {
                  const product = getBetaProduct();
                  return product ? <ProductCard product={product} category="premium" size="large" /> : (
                    <div className="text-center py-8 text-gray-500">
                      Product details coming soon
                    </div>
                  );
                })()}
              </div>

              {/* Product Details Grid */}
              <div id="learn-more" className="grid sm:grid-cols-2 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">100% Premium Cotton</h3>
                  <p className="text-gray-600 text-sm">240-260 GSM weight for exceptional comfort and durability</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Responsibly Sourced</h3>
                  <p className="text-gray-600 text-sm">Ethically produced cotton, supporting sustainable practices</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Finished Locally</h3>
                  <p className="text-gray-600 text-sm">Supporting local craftmanship and reducing environmental impact</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2 text-gray-800">Two Classic Colors</h3>
                  <p className="text-gray-600 text-sm">Black and Off-White. 80 units total. Early supporter exclusive</p>
                </div>
              </div>

              {/* Why Beta Section */}
              <div className="bg-blue-50 p-8 rounded-lg">
                <h3 className="text-2xl font-serif text-gray-800 mb-4 text-center">Why Beta?</h3>
                <div className="space-y-3 text-gray-700">
                  <p>✓ <strong>One product, done right:</strong> We&apos;re perfecting one T-shirt before expanding</p>
                  <p>✓ <strong>Network-first launch:</strong> Building with early supporters, not paid ads</p>
                  <p>✓ <strong>Learning cycle:</strong> Your feedback shapes what comes next</p>
                  <p>✓ <strong>Smart budget:</strong> $6k-$8k for maximum learning, minimum risk</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Full Catalog Mode: Original Hero Section */}
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
              {renderCarouselSection("Affordable Tees", affordableProducts, "affordable")}
              {renderCarouselSection("Workout Tees & Singlets", workoutProducts, "workout")}
              {renderCarouselSection("Premium Collection", premiumProducts, "premium")}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
