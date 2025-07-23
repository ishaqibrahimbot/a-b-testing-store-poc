import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - Request received`);
  next();
});

// Load data files
const loadJSONFile = (filename) => {
  try {
    const filePath = path.join(__dirname, "data", filename);
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
};

// Mock availability data (same as current API)
const mockAvailabilityData = {
  "wireless-headphones": {
    price: 199.99,
    originalPrice: 249.99,
    currency: "USD",
    stock: 15,
    isInStock: true,
    stockLevel: "medium",
    lastUpdated: new Date().toISOString(),
  },
  "running-shoes": {
    price: 129.99,
    currency: "USD",
    stock: 3,
    isInStock: true,
    stockLevel: "low",
    lastUpdated: new Date().toISOString(),
  },
  "smart-watch": {
    price: 299.99,
    originalPrice: 349.99,
    currency: "USD",
    stock: 25,
    isInStock: true,
    stockLevel: "high",
    lastUpdated: new Date().toISOString(),
  },
};

// Mock pricing and rating data for recommendations (same as current API)
const mockRecommendationData = {
  "wireless-headphones": {
    price: 199.99,
    originalPrice: 249.99,
    currency: "USD",
    rating: 4.5,
    reviewCount: 1247,
  },
  "running-shoes": {
    price: 129.99,
    currency: "USD",
    rating: 4.7,
    reviewCount: 892,
  },
  "smart-watch": {
    price: 299.99,
    originalPrice: 349.99,
    currency: "USD",
    rating: 4.4,
    reviewCount: 634,
  },
};

// Simulate API delay
const simulateDelay = () =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

// Routes

// /footer -> serves the footer data
app.get("/footer", (req, res) => {
  const cmsData = loadJSONFile("cms.json");
  if (!cmsData || !cmsData.footer) {
    return res.status(500).json({ error: "Footer data not available" });
  }
  res.json(cmsData.footer);
});

// /header -> serves the header data
app.get("/header", (req, res) => {
  const cmsData = loadJSONFile("cms.json");
  if (!cmsData || !cmsData.header) {
    return res.status(500).json({ error: "Header data not available" });
  }
  res.json(cmsData.header);
});

// /global -> serves the global header data (site config)
app.get("/global", (req, res) => {
  const cmsData = loadJSONFile("cms.json");
  if (!cmsData || !cmsData.siteConfig) {
    return res.status(500).json({ error: "Site config data not available" });
  }
  res.json(cmsData.siteConfig);
});

// /product -> serves the product data
app.get("/product", (req, res) => {
  const productsData = loadJSONFile("products.json");
  if (!productsData) {
    return res.status(500).json({ error: "Products data not available" });
  }
  res.json(productsData);
});

// /product/:slug -> serves a specific product's data
app.get("/product/:slug", (req, res) => {
  const { slug } = req.params;
  const productsData = loadJSONFile("products.json");

  if (!productsData || !productsData.products) {
    return res.status(500).json({ error: "Products data not available" });
  }

  const product = productsData.products.find((p) => p.slug === slug);

  if (!product) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.json(product);
});

// /product/availability -> serves the availability data
app.get("/product/:slug/availability", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Product slug is required" });
  }

  // Simulate API delay
  await simulateDelay();

  const availability = mockAvailabilityData[slug];

  if (!availability) {
    return res.status(404).json({ error: "Product not found" });
  }

  // Add some randomness to stock levels for demo purposes
  const randomizedAvailability = {
    ...availability,
    stock: Math.max(0, availability.stock + Math.floor(Math.random() * 5) - 2),
    lastUpdated: new Date().toISOString(),
  };

  // Update stock level based on current stock
  if (randomizedAvailability.stock === 0) {
    randomizedAvailability.stockLevel = "out";
    randomizedAvailability.isInStock = false;
  } else if (randomizedAvailability.stock <= 5) {
    randomizedAvailability.stockLevel = "low";
  } else if (randomizedAvailability.stock <= 15) {
    randomizedAvailability.stockLevel = "medium";
  } else {
    randomizedAvailability.stockLevel = "high";
  }

  res.json(randomizedAvailability);
});

// /product/recommendations -> serves recommended products
app.get("/product/:slug/recommendations", async (req, res) => {
  const { slug } = req.params;

  if (!slug) {
    return res.status(400).json({ error: "Product slug is required" });
  }

  // Simulate API delay
  await simulateDelay();

  const productsData = loadJSONFile("products.json");

  if (!productsData || !productsData.recommendations) {
    return res
      .status(500)
      .json({ error: "Recommendations data not available" });
  }

  // Get recommended product slugs for this product
  const recommendedSlugs = productsData.recommendations[slug];

  if (!recommendedSlugs) {
    return res.status(404).json({
      error: "No recommendations found for this product",
    });
  }

  // Build recommended products data
  const recommendations = recommendedSlugs
    .map((recSlug) => {
      const product = productsData.products.find((p) => p.slug === recSlug);
      const priceData = mockRecommendationData[recSlug];

      if (!product || !priceData) {
        return null;
      }

      return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        ...priceData,
      };
    })
    .filter(Boolean);

  res.json({
    recommendations,
    lastUpdated: new Date().toISOString(),
  });
});

// /experiments -> serves the A/B experiments data
app.get("/experiments", (req, res) => {
  const abExperimentsData = loadJSONFile("ab-experiments.json");
  if (!abExperimentsData) {
    return res.status(500).json({ error: "Experiments data not available" });
  }
  res.json(abExperimentsData);
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Data server running on http://localhost:${PORT}`);
  console.log("Available endpoints:");
  console.log("  GET /footer - Footer data");
  console.log("  GET /header - Header data");
  console.log("  GET /global - Global site config");
  console.log("  GET /product - All products data");
  console.log("  GET /product/<slug> - Specific product data");
  console.log(
    "  GET /product/availability?slug=<product-slug> - Product availability"
  );
  console.log(
    "  GET /product/recommendations?slug=<product-slug> - Product recommendations"
  );
  console.log("  GET /experiments - A/B testing experiments");
  console.log("  GET /health - Health check");
});
