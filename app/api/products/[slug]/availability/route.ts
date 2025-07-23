import { NextRequest, NextResponse } from "next/server";

// Base URL for local data server
const DATA_SERVER_URL = process.env.DATA_SERVER_URL || "http://localhost:3001";

interface AvailabilityData {
  price: number;
  originalPrice?: number;
  currency: string;
  stock: number;
  isInStock: boolean;
  stockLevel: "high" | "medium" | "low" | "out";
  lastUpdated: string;
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
      `${DATA_SERVER_URL}/product/availability?slug=${slug}`,
      {
        cache: "no-store", // Always fetch fresh data
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }
      throw new Error(`Server responded with ${res.status}`);
    }

    const availability = await res.json();
    return NextResponse.json(availability);
  } catch (error) {
    console.error("Error fetching availability from data server:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}
