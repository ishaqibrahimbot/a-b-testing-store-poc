"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryTilesProps {
  images: string[];
  name: string;
}

export function ProductGalleryTiles({
  images,
  name,
}: ProductGalleryTilesProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  // Fallback placeholder image
  const placeholderImage =
    "data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%236b7280'%3EProduct Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="space-y-4">
      {/* Image Grid Layout */}
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
              selectedImage === index
                ? "border-blue-500 ring-2 ring-blue-200"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={placeholderImage}
              alt={`${name} - Image ${index + 1}`}
              width={300}
              height={300}
              className="w-full h-full object-cover"
              priority={index < 4} // Prioritize first 4 images
            />
          </button>
        ))}
      </div>

      {/* Selected Image Info */}
      <div className="text-center space-y-2">
        {selectedImage !== null ? (
          <div className="text-sm text-gray-500">
            Image {selectedImage + 1} of {images.length} selected
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Click any image to view in large format
          </div>
        )}
        <div className="text-xs text-gray-400">
          {selectedImage !== null
            ? "Click outside or X to close"
            : "Click any image to view details"}
        </div>
      </div>

      {/* Large view modal overlay when image is selected */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Image
              src={placeholderImage}
              alt={`${name} - Image ${selectedImage + 1}`}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
}
