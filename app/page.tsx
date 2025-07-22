import Link from "next/link";
import productsData from "../data/products.json";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            A/B Testing Commerce PoC
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Built with Next.js 15, App Router, and Partial Pre-Rendering (PPR)
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">
              🧪 A/B Testing Features:
            </h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>
                • <strong>Version A:</strong> Green &quot;Add to Cart&quot;
                button
              </li>
              <li>
                • <strong>Version B:</strong> Blue &quot;Purchase Now&quot;
                button
              </li>
              <li>
                • Edge middleware automatically assigns variants via cookies
              </li>
              <li>• Dynamic pricing and stock data with PPR</li>
              <li>• Recommended products section with PPR</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {productsData.products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <svg
                    className="w-16 h-16 mx-auto mb-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm">Product Image</p>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {product.category}
                  </span>
                  <span className="text-blue-600 text-sm font-medium">
                    View Product →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Test</h2>
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                🚀 Quick Test
              </h3>
              <ol className="text-sm text-gray-600 space-y-1">
                <li>1. Click on any product above</li>
                <li>2. Notice the button color and text</li>
                <li>3. Clear cookies and refresh</li>
                <li>4. You may see a different variant</li>
              </ol>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                ⚡ PPR Features
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Static content loads instantly</li>
                <li>• Price/stock loads dynamically</li>
                <li>• Recommendations stream in</li>
                <li>• Loading skeletons show PPR</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
