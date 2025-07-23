import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true, // Enable Partial Pre-Rendering
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
