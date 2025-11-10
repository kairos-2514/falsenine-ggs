// src/config/seo-config.ts
// Complete SEO Configuration for FalseNine Jersey Shop
// Enhanced with strict TypeScript typing and validation
import { SOCIAL_LINKS } from "@/lib/navigation";
import { ROUTES, ROUTE_METADATA } from "@/lib/navigation";

// ============================================================================
// TYPE DEFINITIONS FOR SCHEMAS
// ============================================================================

interface SchemaContext {
  "@context": "https://schema.org";
}

interface OrganizationSchema extends SchemaContext {
  "@type": "ClothingStore" | "Organization";
  name: string;
  alternateName: string;
  url: string;
  logo: string;
  image: string;
  description: string;
  slogan: string;
  foundingDate: string;
  address: PostalAddress;
  contactPoint: ContactPoint;
  sameAs: string[];
  priceRange: string;
  paymentAccepted: string[];
  currenciesAccepted: "INR" | "USD" | "EUR";
  areaServed: CountrySchema;
}

interface PostalAddress {
  "@type": "PostalAddress";
  addressCountry: string;
  addressRegion: string;
  addressLocality?: string;
  postalCode?: string;
  streetAddress?: string;
}

interface ContactPoint {
  "@type": "ContactPoint";
  telephone: string;
  email: string;
  contactType: string;
  availableLanguage: string[];
}

interface CountrySchema {
  "@type": "Country";
  name: string;
}

interface WebsiteSchema extends SchemaContext {
  "@type": "WebSite";
  name: string;
  alternateName: string;
  url: string;
  description: string;
  publisher: PublisherSchema;
  potentialAction: SearchActionSchema;
}

interface PublisherSchema {
  "@type": "Organization";
  name: string;
  logo: ImageObject;
}

interface ImageObject {
  "@type": "ImageObject";
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

interface SearchActionSchema {
  "@type": "SearchAction";
  target: EntryPoint;
  "query-input": string;
}

interface EntryPoint {
  "@type": "EntryPoint";
  urlTemplate: string;
}

interface ProductSchema extends SchemaContext {
  "@type": "Product";
  name: string;
  description: string;
  image: string;
  brand: BrandSchema;
  sku: string;
  offers: OfferSchema;
  aggregateRating: AggregateRatingSchema;
}

interface BrandSchema {
  "@type": "Brand";
  name: string;
  url?: string;
}

interface OfferSchema {
  "@type": "Offer";
  url: string;
  priceCurrency: string;
  price: number | string;
  availability: string;
  priceValidUntil: string;
  seller: SellerSchema;
  shippingDetails?: ShippingDetailsSchema;
}

interface SellerSchema {
  "@type": "Organization";
  name: string;
  url?: string;
}

interface ShippingDetailsSchema {
  "@type": "ShippingDeliveryTime";
  shippingLabel: string;
  shippingRate: ShippingRate;
}

interface ShippingRate {
  "@type": "PriceSpecification";
  priceCurrency: string;
  price: string;
}

interface AggregateRatingSchema {
  "@type": "AggregateRating";
  ratingValue: number;
  reviewCount: number;
  bestRating: number;
  worstRating: number;
}

interface CollectionSchema extends SchemaContext {
  "@type": "CollectionPage";
  name: string;
  description: string;
  url: string;
  isPartOf: WebsiteReferenceSchema;
  mainEntity: ItemListSchema;
}

interface WebsiteReferenceSchema {
  "@type": "WebSite";
  name: string;
  url: string;
}

interface ItemListSchema {
  "@type": "ItemList";
  numberOfItems: number;
}

interface BreadcrumbSchema extends SchemaContext {
  "@type": "BreadcrumbList";
  itemListElement: BreadcrumbItem[];
}

interface BreadcrumbItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

interface FAQSchema extends SchemaContext {
  "@type": "FAQPage";
  mainEntity: FAQItem[];
}

interface FAQItem {
  "@type": "Question";
  name: string;
  acceptedAnswer: Answer;
}

interface Answer {
  "@type": "Answer";
  text: string;
}

interface LocalBusinessSchema extends SchemaContext {
  "@type": "LocalBusiness";
  name: string;
  image: string;
  telephone: string;
  email: string;
  address: PostalAddress;
  url: string;
  priceRange: string;
  openingHours: string;
  areaServed: CountrySchema;
}

interface MetaTagsInput {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url: string;
  author?: string;
  publishDate?: string;
}

interface GeneratedMetaTags {
  title: string;
  description: string;
  keywords?: string;
  author?: string;
  publishDate?: string;
  openGraph: OpenGraphMeta;
  twitter: TwitterMeta;
  alternates: AlternatesMeta;
}

interface OpenGraphMeta {
  type: "website" | "article" | "product";
  url: string;
  title: string;
  description: string;
  siteName: string;
  images: ImageObject[];
}

interface TwitterMeta {
  card: "summary" | "summary_large_image";
  title: string;
  description: string;
  images: string[];
  creator: string;
}

interface AlternatesMeta {
  canonical: string;
}

interface ProductParams {
  name: string;
  description: string;
  slug: string;
  price: number;
  currency?: "INR" | "USD" | "EUR";
  imageUrl?: string;
  brand?: string;
  sku?: string;
  availability?: "InStock" | "OutOfStock" | "PreOrder";
  rating?: number;
  reviewCount?: number;
  url?: string;
}

interface CollectionParams {
  name: string;
  description: string;
  itemCount: number;
  url?: string;
}

// ============================================================================
// BRAND CONSTANTS
// ============================================================================

const BRAND_INFO = {
  siteName: "FalseNine",
  siteUrl: "https://falseninejersey.shop",
  tagline: "Born from Football, Built for Streets",
  supportEmail: "falsenine.in@gmail.com",
  supportPhone: "+91-9004220720",
  foundingYear: 2024,
  defaultCurrency: "INR" as const,
  logoUrl: "https://falseninejersey.shop/falsenine-logo.jpg",
} as const;

// ============================================================================
// KEYWORD CONFIGURATION
// ============================================================================

const KEYWORDS = {
  primary: [
    "falsenine jersey",
    "falsenine streetwear",
    "production grade football jersey",
    "premium football jerseys india",
    "authentic replica jerseys",
    "football inspired streetwear",
    "falsenine drip room",
    "best quality football jerseys",
  ] as const,
  secondary: [
    "athletic fashion",
    "football culture apparel",
    "soccer jersey india",
    "premium sportswear",
    "football fashion brand",
    "street style football",
    "authentic team jerseys",
    "production grade replica",
  ] as const,
  longTail: [
    "where to buy falsenine jerseys",
    "best football jersey shop in india",
    "production grade vs retail jersey",
    "falsenine jersey quality review",
    "premium football streetwear brand",
    "authentic replica football shirts",
  ] as const,
} as const;

// ============================================================================
// SOCIAL LINKS CONFIGURATION
// ============================================================================

// Use SOCIAL_LINKS from navigation for consistency
const SOCIAL_LINKS_CONFIG = {
  instagram: SOCIAL_LINKS.INSTAGRAM,
  twitter: SOCIAL_LINKS.TWITTER,
  pinterest: SOCIAL_LINKS.PINTEREST,
  developers: SOCIAL_LINKS.DEVELOPERS,
} as const;
// ============================================================================
// CONTENT TOPICS FOR STRATEGY
// ============================================================================

const CONTENT_STRATEGY = [
  // Brand & Story
  "FalseNine brand story - born from football built for streets",
  "What makes FalseNine different from other jersey shops",
  "The inspiration behind FalseNine streetwear",

  // Product Education
  "Production grade vs retail jerseys - complete comparison",
  "How to identify authentic production grade jerseys",
  "FalseNine jersey quality guide and materials breakdown",
  "Understanding jersey sizing - FalseNine fit guide",
  "Jersey care and maintenance tips for longevity",

  // Style & Fashion
  "How to style football jerseys for street fashion",
  "Football streetwear trends 2025",
  "Matching jerseys with everyday outfits",
  "Athletic fashion beyond the pitch",

  // Shopping Guides
  "FalseNine Drip Room collection guide",
  "Best football jerseys for India's climate",
  "How to choose the perfect football jersey",
  "Limited edition drops at FalseNine",

  // Football Culture
  "Football culture and street style connection",
  "The false nine position explained",
  "How football influences modern streetwear",
] as const;

// ============================================================================
// SCHEMA GENERATORS
// ============================================================================

const createOrganizationSchema = (): OrganizationSchema => ({
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: BRAND_INFO.siteName,
  alternateName: "FalseNine Jersey Shop",
  url: BRAND_INFO.siteUrl,
  logo: BRAND_INFO.logoUrl,
  image: BRAND_INFO.logoUrl,
  description: `${BRAND_INFO.siteName} is India's premium football-inspired streetwear brand offering production grade jerseys. ${BRAND_INFO.tagline}. Shop authentic replica jerseys, exclusive drops, and premium athletic fashion.`,
  slogan: BRAND_INFO.tagline,
  foundingDate: BRAND_INFO.foundingYear.toString(),
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Maharashtra",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: BRAND_INFO.supportPhone,
    email: BRAND_INFO.supportEmail,
    contactType: "Customer Service",
    availableLanguage: ["English", "Hindi"],
  },
  sameAs: Object.values(SOCIAL_LINKS_CONFIG),
  priceRange: "₹₹",
  paymentAccepted: ["Cash", "Credit Card", "UPI", "Net Banking"],
  currenciesAccepted: BRAND_INFO.defaultCurrency,
  areaServed: {
    "@type": "Country",
    name: "India",
  },
});

const createWebsiteSchema = (): WebsiteSchema => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: BRAND_INFO.siteName,
  alternateName: "FalseNine Jersey Shop",
  url: BRAND_INFO.siteUrl,
  description:
    "Premium football-inspired streetwear and production grade jerseys",
  publisher: {
    "@type": "Organization",
    name: BRAND_INFO.siteName,
    logo: {
      "@type": "ImageObject",
      url: BRAND_INFO.logoUrl,
    },
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BRAND_INFO.siteUrl}${ROUTES.DRIP_ROOM}?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

const createProductSchema = (params: ProductParams): ProductSchema => {
  const {
    name,
    description,
    slug,
    price,
    currency = BRAND_INFO.defaultCurrency,
    imageUrl = BRAND_INFO.logoUrl,
    brand = BRAND_INFO.siteName,
    sku = slug,
    availability = "InStock",
    rating = 4.9,
    reviewCount = 150,
    url,
  } = params;

  const productUrl = url || `${BRAND_INFO.siteUrl}${ROUTES.DRIP_ROOM}/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: brand,
      url: BRAND_INFO.siteUrl,
    },
    sku,
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: currency,
      price: price.toString(),
      availability: `https://schema.org/${availability}`,
      priceValidUntil: new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000
      ).toISOString(),
      seller: {
        "@type": "Organization",
        name: BRAND_INFO.siteName,
        url: BRAND_INFO.siteUrl,
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Math.min(5, Math.max(1, rating)),
      reviewCount: Math.max(0, reviewCount),
      bestRating: 5,
      worstRating: 1,
    },
  };
};

const createCollectionSchema = (params: CollectionParams): CollectionSchema => {
  const {
    name,
    description,
    itemCount,
    url = `${BRAND_INFO.siteUrl}${ROUTES.DRIP_ROOM}`,
  } = params;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    isPartOf: {
      "@type": "WebSite",
      name: BRAND_INFO.siteName,
      url: BRAND_INFO.siteUrl,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: Math.max(0, itemCount),
    },
  };
};

const createBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

const createFAQSchema = (): FAQSchema => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is FalseNine?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `${BRAND_INFO.siteName} is India's premium football-inspired streetwear brand. We offer production grade football jerseys and athletic fashion that combines football culture with street style. ${BRAND_INFO.tagline}.`,
      },
    },
    {
      "@type": "Question",
      name: "What are production grade jerseys?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Production grade jerseys from FalseNine are premium quality authentic replicas made with professional-level materials. They feature superior durability, moisture-wicking fabrics, accurate team badges, professional stitching, and authentic fit matching professional team jerseys.",
      },
    },
    {
      "@type": "Question",
      name: `Where can I buy ${BRAND_INFO.siteName} jerseys?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${BRAND_INFO.siteName} jerseys are available exclusively at ${BRAND_INFO.siteUrl}. Browse our Drip Room collection for the latest drops, premium jerseys, and exclusive streetwear designs. We deliver across India.`,
      },
    },
    {
      "@type": "Question",
      name: `Why choose ${BRAND_INFO.siteName} over other jersey shops?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `${BRAND_INFO.siteName} offers production grade quality jerseys with premium materials, authentic designs, competitive pricing, and excellent customer service. We specialize in football-inspired streetwear that works on and off the pitch. Every jersey is carefully crafted for quality and style.`,
      },
    },
    {
      "@type": "Question",
      name: `Does ${BRAND_INFO.siteName} ship across India?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: `Yes, ${BRAND_INFO.siteName} ships production grade football jerseys and streetwear across India. Check our 'On the Move' delivery policy page for shipping times, tracking information, and delivery options.`,
      },
    },
    {
      "@type": "Question",
      name: "What is the Drip Room?",
      acceptedAnswer: {
        "@type": "Answer",
        text: `The Drip Room is ${BRAND_INFO.siteName}'s exclusive product collection page featuring our latest drops, premium football jerseys, and streetwear. It's where you'll find all our production grade jerseys, limited editions, and exclusive designs.`,
      },
    },
  ],
});

const createLocalBusinessSchema = (): LocalBusinessSchema => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: BRAND_INFO.siteName,
  image: BRAND_INFO.logoUrl,
  telephone: BRAND_INFO.supportPhone,
  email: BRAND_INFO.supportEmail,
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
    addressRegion: "Maharashtra",
  },
  url: BRAND_INFO.siteUrl,
  priceRange: "₹₹",
  openingHours: "Mo-Su 00:00-23:59",
  areaServed: {
    "@type": "Country",
    name: "India",
  },
});

// ============================================================================
// META TAG GENERATION
// ============================================================================

const generateMetaTags = (input: MetaTagsInput): GeneratedMetaTags => {
  const {
    title,
    description,
    keywords = [],
    image = BRAND_INFO.logoUrl,
    url,
    author,
    publishDate,
  } = input;

  return {
    title,
    description,
    keywords: keywords.join(", "),
    author,
    publishDate,
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: BRAND_INFO.siteName,
      images: [
        {
          "@type": "ImageObject",
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@kairosartifex",
    },
    alternates: {
      canonical: url,
    },
  };
};

const getPageMetadata = (routePath: string): GeneratedMetaTags => {
  const routeMetadata =
    ROUTE_METADATA[routePath as keyof typeof ROUTE_METADATA];

  if (!routeMetadata) {
    return generateMetaTags({
      title: `${BRAND_INFO.siteName}`,
      description: `${BRAND_INFO.tagline}. Shop premium production grade jerseys.`,
      keywords: [...KEYWORDS.primary],
      url: `${BRAND_INFO.siteUrl}${routePath}`,
    });
  }

  return generateMetaTags({
    title: routeMetadata.title,
    description: routeMetadata.description,
    keywords: routeMetadata.keywords || [],
    url: `${BRAND_INFO.siteUrl}${routePath}`,
  });
};

// ============================================================================
// URL UTILITIES
// ============================================================================

const getCanonicalUrl = (path: string): string => {
  return `${BRAND_INFO.siteUrl}${path}`;
};

const getImageUrl = (imagePath: string): string => {
  return `${BRAND_INFO.siteUrl}${imagePath}`;
};

// ============================================================================
// EXPORTS
// ============================================================================

export const seoConfig = {
  brand: BRAND_INFO,
  keywords: KEYWORDS,
  socialLinks: SOCIAL_LINKS_CONFIG,
  contentStrategy: CONTENT_STRATEGY,

  // Schema creators
  createOrganizationSchema,
  createWebsiteSchema,
  createProductSchema,
  createCollectionSchema,
  createBreadcrumbSchema,
  createFAQSchema,
  createLocalBusinessSchema,

  // Meta tags
  generateMetaTags,
  getPageMetadata,

  // Utilities
  getCanonicalUrl,
  getImageUrl,
} as const;

export default seoConfig;
export type {
  ProductParams,
  CollectionParams,
  MetaTagsInput,
  GeneratedMetaTags,
  OrganizationSchema,
  WebsiteSchema,
  ProductSchema,
};
