interface ProductDescriptionProps {
  description: string;
}

export function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Product Description
      </h2>
      <div className="prose prose-lg text-gray-700 max-w-none">
        <p>{description}</p>
      </div>

      {/* Additional sections */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Shipping</h3>
          <p className="text-sm text-gray-600">
            Free shipping on orders over $75. Standard delivery in 3-5 business
            days.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Returns</h3>
          <p className="text-sm text-gray-600">
            30-day return policy. Items must be in original condition.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Warranty</h3>
          <p className="text-sm text-gray-600">
            1-year manufacturer warranty included with purchase.
          </p>
        </div>
      </div>
    </div>
  );
}
