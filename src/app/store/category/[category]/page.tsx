"use client";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import FilterDropdown from "@/components/FilterDropdown";
import {
  COLOR_SWATCH_MAP,
  getCanonicalColorName,
  ORDERED_COLOR_KEYS,
  SupportedColor
} from "@/components/ColorSquare";
import ProductCard from "../../../../components/ProductCard";

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  material?: string;
}

const COLOR_MAP: Record<string, string> = {
  ...COLOR_SWATCH_MAP
};

const resolveColorValue = (value: string) => {
  const canonical = getCanonicalColorName(value);
  if (!canonical) {
    return null;
  }
  return COLOR_MAP[canonical] ?? null;
};

const generateFallbackColor = (value: string) => {
  let hash = 0;
  const normalized = value.toLowerCase();
  for (let i = 0; i < normalized.length; i += 1) {
    hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 55%)`;
};

const getColorSwatchStyle = (value: string) => {
  const segments = value.split("/").map((segment) => segment.trim()).filter(Boolean);

  if (segments.length > 1) {
    const gradientStops = segments
      .map((segment, index) => {
        const resolved = resolveColorValue(segment) ?? generateFallbackColor(segment);
        const ratio = segments.length === 1 ? 0 : (index / (segments.length - 1)) * 100;
        return `${resolved} ${ratio}%`;
      })
      .join(", ");
    return { backgroundImage: `linear-gradient(135deg, ${gradientStops})` };
  }

  const resolved = resolveColorValue(value);
  return { backgroundColor: resolved ?? generateFallbackColor(value) };
};

const formatColorLabel = (color: SupportedColor | "") =>
  color ? color.charAt(0).toUpperCase() + color.slice(1) : "";

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState(1);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [selectedColors, setSelectedColors] = useState<SupportedColor[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceSort, setPriceSort] = useState<"default" | "asc" | "desc">("default");
  const pageSize = 9;

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
    if (!category) {
      return;
    }

    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/category/${category}?page=${page}&limit=${pageSize}`,
          { signal: controller.signal }
        );
        if (res.ok) {
          const data = await res.json();
          const computedHasMore =
            data.hasMore ?? (page < (data.totalPages || 1));

          setProducts(data.products || []);
          setTotalPages(data.totalPages || 1);
          setHasMore(Boolean(computedHasMore));
        }
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          console.error('Error fetching products:', error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [category, page, pageSize]);

  useEffect(() => {
    setPage(1);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setPriceSort("default");
  }, [category]);

  const availableColors = useMemo<SupportedColor[]>(() => {
    const colorSet = new Set<SupportedColor>();
    products.forEach((product) => {
      product.colors
        ?.map((color) => getCanonicalColorName(color))
        .filter((color): color is SupportedColor => Boolean(color))
        .forEach((color) => colorSet.add(color));
    });
    return Array.from(colorSet).sort((a, b) => {
      const aIndex = ORDERED_COLOR_KEYS.indexOf(a);
      const bIndex = ORDERED_COLOR_KEYS.indexOf(b);
      if (aIndex === -1 && bIndex === -1) {
        return a.localeCompare(b);
      }
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [products]);

  const availableSizes = useMemo(() => {
    const sizeSet = new Set<string>();
    products.forEach((product) => {
      product.sizes?.forEach((size) => sizeSet.add(size));
    });
    return Array.from(sizeSet).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const availableMaterials = useMemo(() => {
    const materialSet = new Set<string>();
    products.forEach((product) => {
      if (product.material) {
        materialSet.add(product.material);
      }
    });
    return Array.from(materialSet).sort((a, b) => a.localeCompare(b));
  }, [products]);

  const filteredProducts = useMemo(() => {
    const matchesSize = (product: Product) => {
      if (selectedSizes.length === 0) {
        return true;
      }
      return product.sizes?.some((size) => selectedSizes.includes(size)) ?? false;
    };
    const matchesMaterial = (product: Product) => {
      if (selectedMaterials.length === 0) {
        return true;
      }
      if (!product.material) {
        return false;
      }
      return selectedMaterials.includes(product.material);
    };

    const filtered = products.filter((product) => {
      const canonicalColors: SupportedColor[] =
        product.colors
          ?.map((color) => getCanonicalColorName(color))
          .filter((color): color is SupportedColor => Boolean(color)) ?? [];

      const matchesColor =
        selectedColors.length === 0 || canonicalColors.some((color) => selectedColors.includes(color));

      return matchesColor && matchesSize(product) && matchesMaterial(product);
    });

    if (priceSort === "asc") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (priceSort === "desc") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [products, selectedColors, selectedSizes, selectedMaterials, priceSort]);

  const filtersApplied =
    selectedColors.length > 0 ||
    selectedSizes.length > 0 ||
    selectedMaterials.length > 0 ||
    priceSort !== "default";

  const toggleColor = (color: SupportedColor) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((value) => value !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((value) => value !== size) : [...prev, size]
    );
  };

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material) ? prev.filter((value) => value !== material) : [...prev, material]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedMaterials([]);
    setPriceSort("default");
  };

  const priceOptions: Array<{ value: "default" | "asc" | "desc"; label: string }> = [
    { value: "default", label: "Default order" },
    { value: "asc", label: "Price: Low to High" },
    { value: "desc", label: "Price: High to Low" }
  ];

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
          filteredProducts.length > 0 ? (
            <>
              <div className="mb-5 flex flex-wrap items-center justify-center gap-3">
                <FilterDropdown label="Color" count={selectedColors.length}>
                  {availableColors.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {availableColors.map((color) => {
                        const isSelected = selectedColors.includes(color);
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => toggleColor(color)}
                            className={`flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm transition-colors ${
                              isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-gray-300"
                              style={getColorSwatchStyle(color)}
                              aria-hidden
                            />
                            <span className="flex-1 text-left">{formatColorLabel(color)}</span>
                            <span
                              className={`h-2.5 w-2.5 rounded-full border ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-transparent"}`}
                              aria-hidden
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No color options available.</p>
                  )}
                </FilterDropdown>
                <FilterDropdown label="Size" count={selectedSizes.length}>
                  {availableSizes.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {availableSizes.map((size) => {
                        const isSelected = selectedSizes.includes(size);
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => toggleSize(size)}
                            className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                              isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{size}</span>
                            <span
                              className={`h-2.5 w-2.5 rounded-full border ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-transparent"}`}
                              aria-hidden
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No size options available.</p>
                  )}
                </FilterDropdown>
                <FilterDropdown label="Material" count={selectedMaterials.length}>
                  {availableMaterials.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {availableMaterials.map((material) => {
                        const isSelected = selectedMaterials.includes(material);
                        return (
                          <button
                            key={material}
                            type="button"
                            onClick={() => toggleMaterial(material)}
                            className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                              isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                            }`}
                          >
                            <span>{material}</span>
                            <span
                              className={`h-2.5 w-2.5 rounded-full border ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-transparent"}`}
                              aria-hidden
                            />
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No material options available.</p>
                  )}
                </FilterDropdown>
                <FilterDropdown label="Price" count={priceSort !== "default" ? 1 : 0}>
                  <div className="flex flex-col gap-1">
                    {priceOptions.map((option) => {
                      const isSelected = priceSort === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setPriceSort(option.value)}
                          className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors ${
                            isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span>{option.label}</span>
                          <span
                            className={`h-2.5 w-2.5 rounded-full border ${isSelected ? "border-blue-600 bg-blue-600" : "border-gray-300 bg-transparent"}`}
                            aria-hidden
                          />
                        </button>
                      );
                    })}
                  </div>
                </FilterDropdown>
                {filtersApplied && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="rounded-full border border-blue-100 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:border-blue-200 hover:text-blue-700"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredProducts.map((product, idx) => {
                  const isLast = idx === filteredProducts.length - 1;
                  const itemsInLastRow = filteredProducts.length % columns;
                  const shouldCenter = isLast && itemsInLastRow === 1 && filteredProducts.length > columns;
                  return (
                    <div
                      key={product.id}
                      className={shouldCenter ? "col-span-full flex justify-center" : "w-full flex justify-center"}
                    >
                      <ProductCard product={product} category={category} />
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <p className="text-gray-600 text-base sm:text-lg">
                {filtersApplied
                  ? "No products match your current filters."
                  : "No products found in this category."}
              </p>
              {filtersApplied && (
                <button
                  type="button"
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
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
        {isValidCategory && products.length > 0 && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {products.length} items on this page
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-3">
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage(prev => Math.max(1, prev - 1))}
                  disabled={page === 1 || loading}
                >
                  Previous
                </button>
                <button
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setPage(prev => prev + 1)}
                  disabled={loading || !hasMore}
                >
                  Next
                </button>
              </div>
              <span className="text-sm text-gray-600 mt-1">
                Page {page} of {totalPages}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
