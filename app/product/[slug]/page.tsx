import { notFound } from "next/navigation";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { ProductGallery } from "../../../components/ProductGallery";
import { ProductInfo } from "../../../components/ProductInfo";
import { ProductDescription } from "../../../components/ProductDescription";
import { AvailabilitySection } from "../../../components/AvailabilitySection";
import { RecommendationsSection } from "../../../components/RecommendationsSection";
import { LoadingSkeleton } from "../../../components/LoadingSkeleton";

// Enable PPR for this page
export const experimental_ppr = true;

interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  brand: string;
  features: string[];
}

// Base URL for local data server
const DATA_SERVER_URL = process.env.DATA_SERVER_URL || "http://localhost:3001";

// Cached products data fetching
const getProductsData = unstable_cache(
  async () => {
    const res = await fetch(`${DATA_SERVER_URL}/product`, {
      cache: "force-cache", // Use cache for static generation
    });

    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }

    return res.json();
  },
  ["products-data"],
  {
    tags: ["products"],
    revalidate: 3600, // Cache for 1 hour
  }
);

// Static data fetching (will be pre-rendered)
async function getProduct(slug: string): Promise<Product | null> {
  const data = await getProductsData();
  return data.products.find((p: Product) => p.slug === slug) || null;
}

// Generate static params for all products
export async function generateStaticParams() {
  const data = await getProductsData();
  return data.products.map((product: Product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | A/B Testing Commerce`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0]],
    },
  };
}

export default async function ProductPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Static product gallery - pre-rendered */}
          <ProductGallery images={product.images} name={product.name} />

          <div className="space-y-6">
            {/* Static product info - pre-rendered */}
            <ProductInfo
              name={product.name}
              brand={product.brand}
              category={product.category}
              features={product.features}
            />

            {/* Dynamic availability section with Suspense - PPR */}
            <Suspense fallback={<LoadingSkeleton type="availability" />}>
              <AvailabilitySection slug={product.slug} />
            </Suspense>
          </div>
        </div>

        {/* Static product description - pre-rendered */}
        <ProductDescription description={product.description} />

        {/* Dynamic recommendations section with Suspense - PPR */}
        <Suspense fallback={<LoadingSkeleton type="recommendations" />}>
          <RecommendationsSection slug={product.slug} />
        </Suspense>
      </div>
    </div>
  );
}
