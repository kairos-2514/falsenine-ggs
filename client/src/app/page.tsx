import type { Metadata } from "next";
import { seoConfig } from "@/config/seo-config";
import { ROUTES } from "@/lib/navigation";
import HeroSection from "@/ui/hero-section";
import AboutSection from "@/ui/about-section";
import ContactSection from "@/ui/contact-section";
import FeaturedProductsSection from "@/ui/featured-products-section";
import BannerSection from "@/ui/banner-section";

// Generate SEO metadata using seoConfig
const pageMetadata = seoConfig.getPageMetadata(ROUTES.THE_PLAY);

export const metadata: Metadata = {
  title: pageMetadata.title,
  description: pageMetadata.description,
  keywords: pageMetadata.keywords,
  authors: [{ name: seoConfig.brand.siteName, url: seoConfig.brand.siteUrl }],
  creator: seoConfig.brand.siteName,
  publisher: seoConfig.brand.siteName,
  metadataBase: new URL(seoConfig.brand.siteUrl),
  openGraph: {
    type: "website",
    url: pageMetadata.openGraph.url,
    title: pageMetadata.openGraph.title,
    description: pageMetadata.openGraph.description,
    siteName: pageMetadata.openGraph.siteName,
    images: pageMetadata.openGraph.images.map((img) => ({
      url: img.url,
      width: img.width,
      height: img.height,
      alt: img.alt || pageMetadata.title,
    })),
    locale: "en_US",
  },
  twitter: {
    card: pageMetadata.twitter.card,
    title: pageMetadata.twitter.title,
    description: pageMetadata.twitter.description,
    images: pageMetadata.twitter.images,
    creator: pageMetadata.twitter.creator,
  },
  alternates: {
    canonical: pageMetadata.alternates.canonical,
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
};

// Generate structured data for SEO
const websiteSchema = seoConfig.createWebsiteSchema();
const faqSchema = seoConfig.createFAQSchema();

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      <main>
        <HeroSection />
        <FeaturedProductsSection />
        <BannerSection />
        <AboutSection />
        <ContactSection />
      </main>
    </>
  );
}
