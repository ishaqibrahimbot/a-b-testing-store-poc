import cmsData from "../data/cms.json";
import { unstable_cache } from "next/cache";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  isActive: boolean;
}

export interface HeaderData {
  navigation: NavigationItem[];
  actions: {
    search: {
      enabled: boolean;
      placeholder: string;
    };
    cart: {
      enabled: boolean;
      showCount: boolean;
    };
  };
  lastUpdated: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  id: string;
  title: string;
  type: "description" | "links";
  content?: string;
  links?: FooterLink[];
}

export interface FooterData {
  sections: FooterSection[];
  copyright: {
    year: number;
    text: string;
  };
  lastUpdated: string;
}

export interface SiteConfig {
  name: string;
  logo: {
    text: string;
    image: string | null;
  };
  tagline: string;
  lastUpdated: string;
}

// Cached CMS data fetching with revalidation tags
export const getCMSData = unstable_cache(
  async () => {
    // In a real CMS, this would be an API call
    // For now, we're using the JSON file but with cache tags for revalidation
    return cmsData;
  },
  ["cms-data"],
  {
    tags: ["cms"], // This tag allows us to revalidate all CMS content
    revalidate: 3600, // Revalidate every hour as fallback
  }
);

export const getHeaderData = unstable_cache(
  async (): Promise<HeaderData> => {
    const data = await getCMSData();
    return data.header;
  },
  ["header-data"],
  {
    tags: ["cms", "header"], // Multiple tags for granular revalidation
    revalidate: 3600,
  }
);

export const getFooterData = unstable_cache(
  async (): Promise<FooterData> => {
    const data = await getCMSData();
    return data.footer as FooterData;
  },
  ["footer-data"],
  {
    tags: ["cms", "footer"], // Multiple tags for granular revalidation
    revalidate: 3600,
  }
);

export const getSiteConfig = unstable_cache(
  async (): Promise<SiteConfig> => {
    const data = await getCMSData();
    return data.siteConfig;
  },
  ["site-config"],
  {
    tags: ["cms", "site-config"],
    revalidate: 3600,
  }
);

// Utility function to check if CMS data is stale
export function isCMSDataStale(
  lastUpdated: string,
  maxAgeMinutes: number = 60
): boolean {
  const updatedTime = new Date(lastUpdated);
  const now = new Date();
  const diffMinutes = (now.getTime() - updatedTime.getTime()) / (1000 * 60);
  return diffMinutes > maxAgeMinutes;
}
