// ============================================================================
// IMAGE CONFIGURATION
// ============================================================================

/**
 * Get the full S3 image URL
 * @param imagePath - The image filename/path
 * @returns Full S3 URL
 */
export const getImageUrl = (imagePath: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_S3_BASE_URL;
  if (!baseUrl) {
    console.warn("[Images] S3_BASE_URL not configured, using fallback");
    return `https://falsenine-image-storage.s3.ap-south-1.amazonaws.com/${imagePath}`;
  }
  return `${baseUrl}/${imagePath}`;
};

// Pre-configured image URLs
export const IMAGES = {
  HERO_SECTION: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_HERO_SECTION || "hero-section-image.png"
  ),
  BANNER: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_BANNER || "banner-image.png"
  ),
  ABOUT_SECTION: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_ABOUT_SECTION || "about-section-image.png"
  ),
  CONTACT_SECTION: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_CONTACT_SECTION || "contact-section-image.png"
  ),
  LEFT_SIDE: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_LEFT_SIDE || "left-side-image.png"
  ),
  RIGHT_SIDE: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_RIGHT_SIDE || "right-side-image.png"
  ),
  // Product images - mapped by product ID
  PRODUCT_FRONTLINE: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_PRODUCT_FRONTLINE ||
      process.env.NEXT_PUBLIC_IMAGE_BANNER ||
      "banner-image.png"
  ),
  PRODUCT_REIGN: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_PRODUCT_REIGN ||
      process.env.NEXT_PUBLIC_IMAGE_RIGHT_SIDE ||
      "right-side-image.png"
  ),
  PRODUCT_CROSSFADE: getImageUrl(
    process.env.NEXT_PUBLIC_IMAGE_PRODUCT_CROSSFADE ||
      process.env.NEXT_PUBLIC_IMAGE_LEFT_SIDE ||
      "left-side-image.png"
  ),
} as const;

/**
 * Get product image by product ID
 * @param productId - The product ID (e.g., "frontline", "reign", "crossfade")
 * @returns Image URL for the product
 */
export const getProductImage = (productId: string): string => {
  const productImageMap: Record<string, string> = {
    frontline: IMAGES.PRODUCT_FRONTLINE,
    reign: IMAGES.PRODUCT_REIGN,
    crossfade: IMAGES.PRODUCT_CROSSFADE,
  };

  return productImageMap[productId.toLowerCase()] || IMAGES.BANNER;
};
