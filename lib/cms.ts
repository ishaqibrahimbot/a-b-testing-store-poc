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
  taglineV2: string;
  lastUpdated: string;
}

// Base URL for local data server
const DATA_SERVER_URL = process.env.DATA_SERVER_URL || "http://localhost:3001";

// Utility function to fetch from data server
async function fetchFromDataServer(endpoint: string, tag: string) {
  const res = await fetch(`${DATA_SERVER_URL}${endpoint}`, {
    next: {
      tags: [tag],
    },
    cache: "force-cache",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from data server: ${endpoint}`);
  }

  return res.json();
}

export const getHeaderData = async (): Promise<HeaderData> => {
  const header = await fetchFromDataServer("/header", "header");
  return header;
};

export const getFooterData = async (): Promise<FooterData> => {
  const footer = await fetchFromDataServer("/footer", "footer");
  return footer;
};

export const getSiteConfig = async (): Promise<SiteConfig> => {
  const globalConfig = await fetchFromDataServer("/global", "global");
  return globalConfig;
};

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
