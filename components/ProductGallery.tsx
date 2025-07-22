"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Fallback placeholder image
  const placeholderImage =
    "data:image/svg+xml,%3Csvg width='400' height='400' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%236b7280'%3EProduct Image%3C/text%3E%3C/svg%3E";

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={placeholderImage}
          alt={`${name} - Main Image`}
          width={500}
          height={500}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
              selectedImage === index
                ? "border-blue-500"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <Image
              src={placeholderImage}
              alt={`${name} - Image ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Image Counter */}
      <div className="text-center text-sm text-gray-500">
        {selectedImage + 1} of {images.length}
      </div>
    </div>
  );
}
