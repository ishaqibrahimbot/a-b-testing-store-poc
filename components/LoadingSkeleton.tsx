interface LoadingSkeletonProps {
  type: "availability" | "recommendations";
}

export function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  if (type === "availability") {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
        <div className="space-y-4">
          {/* Price skeleton */}
          <div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>

          {/* Stock skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>

          {/* Button skeleton */}
          <div className="h-12 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    );
  }

  if (type === "recommendations") {
    return (
      <div className="bg-white rounded-lg p-8 shadow-sm">
        <div className="h-8 bg-gray-200 rounded w-64 mb-6 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
