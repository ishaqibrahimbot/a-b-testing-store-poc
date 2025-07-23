import { NextRequest, NextResponse } from "next/server";

// Base URL for local data server
const DATA_SERVER_URL = process.env.DATA_SERVER_URL || "http://localhost:3001";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only apply A/B testing to product pages
  if (!request.nextUrl.pathname.startsWith("/product/")) {
    return response;
  }

  try {
    // Fetch experiments data from server
    const experimentsRes = await fetch(`${DATA_SERVER_URL}/experiments`, {
      cache: "no-store",
    });

    if (!experimentsRes.ok) {
      console.error("Failed to fetch experiments data");
      return response;
    }

    const abExperiments = await experimentsRes.json();
    const experiment = abExperiments.experiments["add-to-cart-button"];

    if (!experiment) {
      return response;
    }

    const cookieName = experiment.cookie_name;

    // Check if user already has A/B test cookie
    let variant = request.cookies.get(cookieName)?.value;

    // If no cookie exists, assign a variant
    if (!variant || !["A", "B"].includes(variant)) {
      // Simple 50/50 split based on traffic allocation
      variant = Math.random() < experiment.traffic_allocation / 100 ? "A" : "B";

      // Set cookie with 30-day expiration
      const cookieExpiration = new Date();
      cookieExpiration.setDate(
        cookieExpiration.getDate() + experiment.cookie_duration_days
      );

      response.cookies.set(cookieName, variant, {
        expires: cookieExpiration,
        httpOnly: false, // Allow client-side access for analytics
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
    }

    // Add variant to response headers for server components
    response.headers.set("x-ab-variant", variant);

    return response;
  } catch (error) {
    console.error("Error in A/B testing middleware:", error);
    return response;
  }
}

export const config = {
  matcher: "/product/:path*",
};
