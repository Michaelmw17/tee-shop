import { NextResponse } from "next/server";
import {
  CATEGORY_SLUGS,
  PRODUCTS_BY_CATEGORY,
  getAllProducts
} from "@/data/products";

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value) {
    return fallback;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }
  return parsed;
}

const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 9;

export async function GET(request: Request) {
  const allProducts = getAllProducts();
  const url = new URL(request.url);
  const page = parsePositiveInt(url.searchParams.get("page"), 1);
  const limit = Math.min(MAX_LIMIT, parsePositiveInt(url.searchParams.get("limit"), DEFAULT_LIMIT));
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const pagedProducts = allProducts.slice(startIndex, endIndex);
  const total = allProducts.length;
  const totalPages = Math.ceil(total / limit);
  const hasMore = endIndex < total;

  const categories = CATEGORY_SLUGS.reduce<Record<string, typeof pagedProducts>>((acc, slug) => {
    acc[slug] = PRODUCTS_BY_CATEGORY[slug];
    return acc;
  }, {});

  return NextResponse.json({
    products: pagedProducts,
    total,
    page,
    limit,
    totalPages,
    hasMore,
    categories
  });
}
