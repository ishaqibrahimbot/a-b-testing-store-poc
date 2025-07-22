import { getABVariant, getVariantConfig } from "../lib/ab-testing";

interface AvailabilityData {
  price: number;
  originalPrice?: number;
  currency: string;
  stock: number;
  isInStock: boolean;
  stockLevel: "high" | "medium" | "low" | "out";
  lastUpdated: string;
}

interface AvailabilitySectionProps {
  slug: string;
}

async function fetchAvailability(slug: string): Promise<AvailabilityData> {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/products/${slug}/availability`, {
    cache: "no-store", // Always fetch fresh data for PPR
  });

  if (!res.ok) {
    throw new Error("Failed to fetch availability");
  }

  return res.json();
}

export async function AvailabilitySection({ slug }: AvailabilitySectionProps) {
  // Fetch dynamic data
  const availability = await fetchAvailability(slug);

  // Get A/B test variant
  const variant = await getABVariant("add-to-cart-button");
  const variantConfig = getVariantConfig("add-to-cart-button", variant);

  const stockLevelColors = {
    high: "text-green-600",
    medium: "text-yellow-600",
    low: "text-orange-600",
    out: "text-red-600",
  };

  const stockLevelText = {
    high: "In Stock",
    medium: "Limited Stock",
    low: "Only Few Left",
    out: "Out of Stock",
  };

  const buttonColorClasses = {
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="space-y-4">
        {/* Price */}
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">
              ${availability.price.toFixed(2)}
            </span>
            {availability.originalPrice && (
              <span className="text-xl text-gray-500 line-through">
                ${availability.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Price updated:{" "}
            {new Date(availability.lastUpdated).toLocaleTimeString()}
          </p>
        </div>

        {/* Stock Information */}
        <div>
          <p
            className={`text-sm font-medium ${
              stockLevelColors[availability.stockLevel]
            }`}
          >
            {stockLevelText[availability.stockLevel]}
          </p>
          {availability.isInStock && (
            <p className="text-sm text-gray-600">
              {availability.stock} units available
            </p>
          )}
        </div>

        {/* A/B Tested Add to Cart Button */}
        <button
          className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            variantConfig
              ? buttonColorClasses[
                  variantConfig.button_color as keyof typeof buttonColorClasses
                ]
              : buttonColorClasses.green
          }`}
          disabled={!availability.isInStock}
        >
          {availability.isInStock
            ? variantConfig?.button_text || "Add to Cart"
            : "Out of Stock"}
        </button>

        {/* A/B Test Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
            A/B Test Variant: {variant} - {variantConfig?.description}
          </div>
        )}

        {/* Additional Actions */}
        <div className="flex space-x-2 pt-2">
          <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              Wishlist
            </span>
          </button>
          <button className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            <span className="flex items-center justify-center">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
