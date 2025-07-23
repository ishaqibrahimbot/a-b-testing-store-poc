import { NextRequest, NextResponse } from "next/server";

// Base URL for local data server
const DATA_SERVER_URL = process.env.DATA_SERVER_URL || "http://localhost:3001";

interface RecommendedProduct {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  currency: string;
  rating: number;
  reviewCount: number;
}

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params;
  const { slug } = params;

  try {
    // Fetch from local data server
    const res = await fetch(
      `${DATA_SERVER_URL}/product/recommendations?slug=${slug}`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "No recommendations found for this product" },
          { status: 404 }
        );
      }
      throw new Error(`Server responded with ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching recommendations from data server:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
