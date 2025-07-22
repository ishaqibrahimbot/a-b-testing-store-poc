import { NextRequest, NextResponse } from "next/server";

// Simulate database delay for demonstration
const simulateDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 400));

interface AvailabilityData {
  price: number;
  originalPrice?: number;
  currency: string;
  stock: number;
  isInStock: boolean;
  stockLevel: "high" | "medium" | "low" | "out";
  lastUpdated: string;
}

// Mock availability data
const mockAvailabilityData: Record<string, AvailabilityData> = {
  "wireless-headphones": {
    price: 199.99,
    originalPrice: 249.99,
    currency: "USD",
    stock: 15,
    isInStock: true,
    stockLevel: "medium",
    lastUpdated: new Date().toISOString(),
  },
  "running-shoes": {
    price: 129.99,
    currency: "USD",
    stock: 3,
    isInStock: true,
    stockLevel: "low",
    lastUpdated: new Date().toISOString(),
  },
  "smart-watch": {
    price: 299.99,
    originalPrice: 349.99,
    currency: "USD",
    stock: 25,
    isInStock: true,
    stockLevel: "high",
    lastUpdated: new Date().toISOString(),
  },
};

export async function GET(request: NextRequest, props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const { slug } = params;

  // Simulate API delay
  await simulateDelay();

  const availability = mockAvailabilityData[slug];

  if (!availability) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Add some randomness to stock levels for demo purposes
  const randomizedAvailability = {
    ...availability,
    stock: Math.max(0, availability.stock + Math.floor(Math.random() * 5) - 2),
    lastUpdated: new Date().toISOString(),
  };

  // Update stock level based on current stock
  if (randomizedAvailability.stock === 0) {
    randomizedAvailability.stockLevel = "out";
    randomizedAvailability.isInStock = false;
  } else if (randomizedAvailability.stock <= 5) {
    randomizedAvailability.stockLevel = "low";
  } else if (randomizedAvailability.stock <= 15) {
    randomizedAvailability.stockLevel = "medium";
  } else {
    randomizedAvailability.stockLevel = "high";
  }

  return NextResponse.json(randomizedAvailability);
}
