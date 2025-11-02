import { NextResponse } from "next/server";
import {
  CATEGORY_SLUGS,
  CategorySlug,
  getProductsByCategory
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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  try {
    const awaitedParams = await params;
    const category = awaitedParams.category;

    if (!category || typeof category !== "string") {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 });
    }

    const sanitizedCategory = category.toLowerCase().trim() as CategorySlug;
    if (!CATEGORY_SLUGS.includes(sanitizedCategory)) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const products = getProductsByCategory(sanitizedCategory);
    if (!products || products.length === 0) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const page = parsePositiveInt(url.searchParams.get("page"), 1);
    const limit = Math.min(MAX_LIMIT, parsePositiveInt(url.searchParams.get("limit"), DEFAULT_LIMIT));
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const pagedProducts = products.slice(startIndex, endIndex);
    const total = products.length;
    const totalPages = Math.ceil(total / limit);
    const hasMore = endIndex < total;

    const response = NextResponse.json({
      category: sanitizedCategory,
      products: pagedProducts,
      total,
      page,
      limit,
      totalPages,
      hasMore
    });

    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");

    return response;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", error);
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
