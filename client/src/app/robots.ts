import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/drip-room/"],
        disallow: ["/api/", "/admin/", "/_next/", "/locker", "/player-card"],
      },
    ],
    sitemap: "https://falseninejersey.shop/sitemap.xml",
  };
}
