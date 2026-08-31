import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    // All images are served locally from /public
    // No remote patterns needed for current setup
    formats: ['image/webp'],
  },
};

export default nextConfig;
