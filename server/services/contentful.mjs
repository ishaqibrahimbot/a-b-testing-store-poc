import { createClient } from "contentful";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Contentful client configuration
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "jjru64zjnv0z",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
});

// Fetch site configuration
export async function getSiteConfiguration() {
  const entries = await client.getEntries({
    content_type: "siteConfiguration",
    limit: 1,
  });

  if (entries.items.length === 0) {
    throw new Error("Site configuration not found");
  }

  const entry = entries.items[0];
  return {
    name: entry.fields.name,
    logo: {
      text: entry.fields.logoText || null,
      image: entry.fields.logoImage
        ? entry.fields.logoImage.fields.file.url
        : null,
    },
    tagline: entry.fields.tagline || null,
    lastUpdated: entry.sys.updatedAt,
  };
}

// Fetch header configuration
export async function getHeaderConfiguration() {
  const entries = await client.getEntries({
    content_type: "header",
    limit: 1,
  });

  if (entries.items.length === 0) {
    throw new Error("Header configuration not found");
  }

  const entry = entries.items[0];
  return {
    navigation: entry.fields.navigation || [],
    actions: {
      search: {
        enabled: entry.fields.searchEnabled || false,
        placeholder: entry.fields.searchPlaceholder || "Search...",
      },
      cart: {
        enabled: entry.fields.cartEnabled || false,
        showCount: entry.fields.cartShowCount || false,
      },
    },
    lastUpdated: entry.sys.updatedAt,
  };
}

// Fetch footer configuration
export async function getFooterConfiguration() {
  const entries = await client.getEntries({
    content_type: "footer",
    limit: 1,
  });

  if (entries.items.length === 0) {
    throw new Error("Footer configuration not found");
  }

  const entry = entries.items[0];
  return {
    sections: entry.fields.sections || [],
    copyright: {
      year: entry.fields.copyrightYear,
      text: entry.fields.copyrightText,
    },
    lastUpdated: entry.sys.updatedAt,
  };
}

// Health check for Contentful connection
export async function healthCheck() {
  try {
    await client.getSpace();
    return { status: "connected", timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: "error",
      error: error.message,
      timestamp: new Date().toISOString(),
    };
  }
}

const contentfulService = {
  getSiteConfiguration,
  getHeaderConfiguration,
  getFooterConfiguration,
  healthCheck,
};

export default contentfulService;
