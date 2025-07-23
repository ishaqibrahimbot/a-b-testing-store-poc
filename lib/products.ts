const DATA_SERVER_URL = "http://localhost:3001";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  brand: string;
  features: string[];
}

interface AvailabilityData {
  price: number;
  originalPrice?: number;
  currency: string;
  stock: number;
  isInStock: boolean;
  stockLevel: "high" | "medium" | "low" | "out";
  lastUpdated: string;
}

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

interface RecommendationsData {
  recommendations: RecommendedProduct[];
  lastUpdated: string;
}

export async function getAllProducts() {
  const response = await fetch(`${DATA_SERVER_URL}/product`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const response = await fetch(`${DATA_SERVER_URL}/product/${slug}`);

  if (response.ok) {
    return response.json();
  }

  return null;
}

export async function fetchAvailability(
  slug: string
): Promise<AvailabilityData> {
  const res = await fetch(`${DATA_SERVER_URL}/product/${slug}/availability`, {
    cache: "no-store", // Always fetch fresh data for PPR
  });

  if (!res.ok) {
    throw new Error("Failed to fetch availability");
  }

  return res.json();
}

export async function fetchRecommendations(
  slug: string
): Promise<RecommendationsData> {
  const res = await fetch(
    `${DATA_SERVER_URL}/product/${slug}/recommendations`,
    {
      cache: "no-store", // Always fetch fresh data for PPR
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch recommendations");
  }

  return res.json();
}
