import { NextResponse } from "next/server";
import { getProductById } from "@/data/products";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const awaitedParams = await params;
    const id = awaitedParams.id;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const productId = Number.parseInt(id, 10);
    if (Number.isNaN(productId) || productId < 1) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 });
    }

    const product = getProductById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const response = NextResponse.json({ product });
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
