import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 80, 85, 90, 95, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "falsenine-image-storage.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false,
    unoptimized: false, // Enable optimization for better performance
    // Device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
