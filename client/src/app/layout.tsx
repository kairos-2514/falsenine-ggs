import type { Metadata } from "next";
import "./globals.css";
import { ROUTE_METADATA, socialLinks as SOCIAL_LINKS } from "@/lib/navigation";
import { seoConfig } from "@/config/seo-config";
import Script from "next/script";
// ui elements
import Navbar from "@/ui/navbar";
import Footer from "@/ui/footer";

export const metadata: Metadata = {
  title: "FalseNine",
  description:
    "Premium football-inspired streetwear. Born from the game, built for the streets.",
  keywords: [
    "FalseNine",
    "football streetwear",
    "sportswear brand",
    "athletic fashion",
    "urban football apparel",
    "premium jerseys",
    "street fashion",
    "performance wear",
  ],
  metadataBase: new URL("https://falseninejersey.shop"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "FalseNine",
    title: "FalseNine",
    description:
      "Premium football-inspired streetwear. Born from the game, built for the streets.",
    images: [
      {
        url: "/falsenine-logo.jpg",
        width: 1200,
        height: 630,
        alt: "FalseNine Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FalseNine",
    description:
      "Premium football-inspired streetwear. For those who play different — on and off the pitch.",
    images: ["/falsenine-logo.jpg"],
    creator: "@kairosartifex",
    site: "@kairosartifex",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml", sizes: "any" },
    ],
    apple: "/apple-icon.png",
  },
  authors: [{ name: "FalseNine", url: "https://falseninejersey.shop" }],
  creator: "FalseNine",
  publisher: "FalseNine",
  alternates: {
    canonical: "https://falseninejersey.shop",
  },
  other: {
    "instagram:url": SOCIAL_LINKS.INSTAGRAM,
    "twitter:url": SOCIAL_LINKS.TWITTER,
    "pinterest:url": SOCIAL_LINKS.PINTEREST,
  },
};

// Structured data for better SEO - using centralized config
const structuredData = seoConfig.createOrganizationSchema();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        <meta name="theme-color" content="#0d0208" />

        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Preconnect to S3 for faster image loading */}
        <link
          rel="preconnect"
          href="https://falsenine-image-storage.s3.ap-south-1.amazonaws.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://falsenine-image-storage.s3.ap-south-1.amazonaws.com"
        />

        {/* Preload critical images for instant loading */}
        <link
          rel="preload"
          as="image"
          href={`${
            process.env.NEXT_PUBLIC_S3_BASE_URL ||
            "https://falsenine-image-storage.s3.ap-south-1.amazonaws.com"
          }/${
            process.env.NEXT_PUBLIC_IMAGE_HERO_SECTION ||
            "hero-section-image.png"
          }`}
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href={`${
            process.env.NEXT_PUBLIC_S3_BASE_URL ||
            "https://falsenine-image-storage.s3.ap-south-1.amazonaws.com"
          }/${process.env.NEXT_PUBLIC_IMAGE_BANNER || "banner-image.png"}`}
          fetchPriority="high"
        />

        {/* DNS Prefetch for social media platforms */}
        <link rel="dns-prefetch" href="https://instagram.com" />
        <link rel="dns-prefetch" href="https://x.com" />
        <link rel="dns-prefetch" href="https://pinterest.com" />

        {/* Favicon */}
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <Navbar />
        {children}
        <Footer />
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

// Export route metadata for use in page components
export { ROUTE_METADATA };
