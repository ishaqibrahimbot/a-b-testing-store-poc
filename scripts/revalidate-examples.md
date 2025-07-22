# CMS Revalidation Strategies for Next.js 15

This document explains how to handle cache revalidation when CMS data changes in our A/B testing commerce PoC.

## 🎯 Cache Strategy Overview

Our implementation uses **cache tags** with Next.js `unstable_cache` to enable granular revalidation:

- `cms` - All CMS content
- `header` - Header navigation and settings
- `footer` - Footer content and links
- `site-config` - Site-wide configuration

## 🔄 Revalidation Methods

### 1. **On-Demand Revalidation (Recommended for Production)**

**When to use:** Real-time updates when CMS content changes

#### Via API Endpoint

```bash
# Revalidate specific tags
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret-key",
    "tags": ["header", "footer"]
  }'

# Revalidate specific paths
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "secret": "your-secret-key",
    "paths": ["/", "/product/wireless-headphones"]
  }'
```

#### GET Method (for testing)

```bash
# Revalidate header tag
curl "http://localhost:3000/api/revalidate?tag=header&secret=your-secret-key"

# Revalidate homepage
curl "http://localhost:3000/api/revalidate?path=/&secret=your-secret-key"
```

### 2. **Time-Based Revalidation (ISR)**

**When to use:** Fallback for systems without webhooks

Our CMS cache functions already include `revalidate: 3600` (1 hour) as a fallback.

### 3. **CMS Webhook Integration**

**When to use:** Automatic revalidation when content changes

#### Example webhook handler for Contentful/Strapi:

```typescript
// app/api/webhooks/cms/route.ts
import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-webhook-secret");

  if (secret !== process.env.CMS_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { model, action } = await request.json();

  // Map CMS content types to cache tags
  const tagMapping = {
    header: ["header", "cms"],
    footer: ["footer", "cms"],
    siteConfig: ["site-config", "cms"],
  };

  if (tagMapping[model]) {
    tagMapping[model].forEach((tag) => revalidateTag(tag));
  }

  return NextResponse.json({ success: true });
}
```

## 🚀 Production Implementation Examples

### Contentful Integration

```typescript
// lib/contentful.ts
import { unstable_cache } from "next/cache";

export const getContentfulHeader = unstable_cache(
  async () => {
    const response = await fetch(
      `${process.env.CONTENTFUL_API_URL}/entries?content_type=header`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
        },
      }
    );
    return response.json();
  },
  ["contentful-header"],
  {
    tags: ["cms", "header"],
    revalidate: 3600,
  }
);
```

### Strapi Integration

```typescript
// lib/strapi.ts
import { unstable_cache } from "next/cache";

export const getStrapiFooter = unstable_cache(
  async () => {
    const response = await fetch(
      `${process.env.STRAPI_API_URL}/api/footer?populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      }
    );
    return response.json();
  },
  ["strapi-footer"],
  {
    tags: ["cms", "footer"],
    revalidate: 3600,
  }
);
```

## 🧪 Testing Cache Invalidation

### 1. Manual Testing

```bash
# 1. Load a product page to populate cache
curl http://localhost:3000/product/wireless-headphones

# 2. Update CMS data (modify data/cms.json)

# 3. Revalidate header tag
curl "http://localhost:3000/api/revalidate?tag=header&secret=your-secret-key"

# 4. Refresh page to see updated content
```

### 2. Automated Testing

```javascript
// test-revalidation.js
const testRevalidation = async () => {
  // Update CMS data
  await updateCMSData();

  // Trigger revalidation
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      secret: "your-secret-key",
      tags: ["header", "footer"],
    }),
  });

  // Verify cache invalidation
  const response = await fetch("/product/test");
  // Check if new content is served
};
```

## 📊 Cache Performance Monitoring

### Development Debug Info

Our components show cache freshness in development:

- Header: Shows last updated timestamp
- Footer: Shows last updated timestamp

### Production Monitoring

```typescript
// lib/cache-monitoring.ts
export function logCacheHit(key: string, isHit: boolean) {
  if (process.env.NODE_ENV === "production") {
    console.log(`Cache ${isHit ? "HIT" : "MISS"}: ${key}`);
    // Send to analytics service
  }
}
```

## 🔐 Security Considerations

1. **Secure revalidation endpoints** with secret tokens
2. **Validate webhook signatures** from CMS providers
3. **Rate limit** revalidation requests to prevent abuse
4. **Log revalidation events** for debugging and monitoring

## 🎛️ Cache Granularity Best Practices

- **Use specific tags** rather than invalidating all cache
- **Group related content** under shared tags (e.g., 'cms')
- **Separate frequently vs rarely changing content**
- **Consider dependencies** when designing tag structure

This setup provides flexible, efficient cache management for CMS-driven content while maintaining optimal performance.
