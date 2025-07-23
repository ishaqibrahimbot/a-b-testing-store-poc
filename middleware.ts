import { NextRequest, NextResponse } from "next/server";

// Base URL for local data server
const DATA_SERVER_URL = process.env.DATA_SERVER_URL || "http://localhost:3001";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Only apply A/B testing to product pages (but not variant-b pages to avoid infinite redirects)
  if (
    !request.nextUrl.pathname.startsWith("/product/") ||
    request.nextUrl.pathname.startsWith("/product/variant-b/")
  ) {
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

    // Handle layout experiment first (for URL rewriting)
    const layoutExperiment = abExperiments.experiments["product-layout"];
    if (layoutExperiment) {
      const layoutCookieName = layoutExperiment.cookie_name;
      let layoutVariant = request.cookies.get(layoutCookieName)?.value;

      // If no cookie exists, assign a variant
      if (!layoutVariant || !["A", "B"].includes(layoutVariant)) {
        layoutVariant =
          Math.random() < layoutExperiment.traffic_allocation / 100 ? "A" : "B";

        // Set cookie with 30-day expiration
        const cookieExpiration = new Date();
        cookieExpiration.setDate(
          cookieExpiration.getDate() + layoutExperiment.cookie_duration_days
        );

        response.cookies.set(layoutCookieName, layoutVariant, {
          expires: cookieExpiration,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      // If user is on variant B, rewrite to variant-b path
      if (layoutVariant === "B") {
        const url = request.nextUrl.clone();
        url.pathname = url.pathname.replace("/product/", "/product/variant-b/");
        return NextResponse.rewrite(url);
      }

      // Add layout variant to response headers
      response.headers.set("x-ab-layout-variant", layoutVariant);
    }

    // Handle button experiment
    const buttonExperiment = abExperiments.experiments["add-to-cart-button"];
    if (buttonExperiment) {
      const buttonCookieName = buttonExperiment.cookie_name;
      let buttonVariant = request.cookies.get(buttonCookieName)?.value;

      // If no cookie exists, assign a variant
      if (!buttonVariant || !["A", "B"].includes(buttonVariant)) {
        buttonVariant =
          Math.random() < buttonExperiment.traffic_allocation / 100 ? "A" : "B";

        // Set cookie with 30-day expiration
        const cookieExpiration = new Date();
        cookieExpiration.setDate(
          cookieExpiration.getDate() + buttonExperiment.cookie_duration_days
        );

        response.cookies.set(buttonCookieName, buttonVariant, {
          expires: cookieExpiration,
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
      }

      // Add button variant to response headers
      response.headers.set("x-ab-variant", buttonVariant);
    }

    return response;
  } catch (error) {
    console.error("Error in A/B testing middleware:", error);
    return response;
  }
}

export const config = {
  matcher: "/product/:path*",
};
