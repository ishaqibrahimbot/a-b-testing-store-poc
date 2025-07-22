import { notFound } from "next/navigation";
import { Suspense } from "react";
import productsData from "../../../data/products.json";
import { ProductHeader } from "../../../components/ProductHeader";
import { ProductGallery } from "../../../components/ProductGallery";
import { ProductInfo } from "../../../components/ProductInfo";
import { ProductDescription } from "../../../components/ProductDescription";
import { AvailabilitySection } from "../../../components/AvailabilitySection";
import { RecommendationsSection } from "../../../components/RecommendationsSection";
import { ProductFooter } from "../../../components/ProductFooter";
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

// Static data fetching (will be pre-rendered)
function getProduct(slug: string): Product | null {
  return productsData.products.find((p) => p.slug === slug) || null;
}

// Generate static params for all products
export async function generateStaticParams() {
  return productsData.products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const product = getProduct(params.slug);

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

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const product = getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Static header - pre-rendered */}
      <ProductHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      </main>

      {/* Static footer - pre-rendered */}
      <ProductFooter />
    </div>
  );
}
