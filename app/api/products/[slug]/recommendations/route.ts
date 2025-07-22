import { NextRequest, NextResponse } from "next/server";
import productsData from "../../../../../data/products.json";

// Simulate database delay for demonstration
const simulateDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 600 + Math.random() * 300));

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

// Mock pricing and rating data for recommendations
const mockRecommendationData: Record<
  string,
  Omit<RecommendedProduct, "id" | "slug" | "name" | "image">
> = {
  "wireless-headphones": {
    price: 199.99,
    originalPrice: 249.99,
    currency: "USD",
    rating: 4.5,
    reviewCount: 1247,
  },
  "running-shoes": {
    price: 129.99,
    currency: "USD",
    rating: 4.7,
    reviewCount: 892,
  },
  "smart-watch": {
    price: 299.99,
    originalPrice: 349.99,
    currency: "USD",
    rating: 4.4,
    reviewCount: 634,
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // Simulate API delay
  await simulateDelay();

  // Get recommended product slugs for this product
  const recommendedSlugs =
    productsData.recommendations[
      slug as keyof typeof productsData.recommendations
    ];

  if (!recommendedSlugs) {
    return NextResponse.json(
      { error: "No recommendations found for this product" },
      { status: 404 }
    );
  }

  // Build recommended products data
  const recommendations: RecommendedProduct[] = recommendedSlugs
    .map((recSlug) => {
      const product = productsData.products.find((p) => p.slug === recSlug);
      const priceData = mockRecommendationData[recSlug];

      if (!product || !priceData) {
        return null;
      }

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        ...priceData,
      };
    })
    .filter(Boolean) as RecommendedProduct[];

  return NextResponse.json({
    recommendations,
    lastUpdated: new Date().toISOString(),
  });
}
