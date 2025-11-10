"use client";

import Image from "next/image";
import { useNavigation, ROUTES } from "@/lib/navigation";
import { seoConfig } from "@/config/seo-config";
import { IMAGES } from "@/config/images";

// ============================================================================
// FEATURED PRODUCTS SECTION COMPONENT
// ============================================================================

// Generate CollectionSchema for featured products
const collectionSchema = seoConfig.createCollectionSchema({
  name: "Featured Products - FalseNine",
  description:
    "Explore our featured collection of premium football-inspired streetwear. Production grade jerseys and athletic fashion designed for players who move different.",
  itemCount: 0, // Update with actual count when products are available
  url: seoConfig.getCanonicalUrl(ROUTES.DRIP_ROOM),
});

export default function FeaturedProductsSection() {
  const { navigateTo } = useNavigation();

  const handleCTAClick = () => {
    navigateTo(ROUTES.DRIP_ROOM);
  };

  return (
    <>
      {/* Structured Data for Featured Products Collection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <section
        className="grid grid-cols-1 md:grid-cols-2"
        aria-label="Featured products section"
      >
        {/* Left Column */}
        <div className="flex flex-col">
          {/* Text Block - Black Background */}
          <div className="bg-night text-white">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
              <div className="space-y-1.5 font-montserrat text-xs font-normal leading-relaxed uppercase tracking-wide sm:space-y-2 sm:text-sm md:text-base lg:text-lg">
                <p className="font-bold">CROSSFADE</p>
                <p>Understated. Unstoppable.</p>
                <p>Built for those who let their game do the talking.</p>
              </div>
              <button
                onClick={handleCTAClick}
                className="mt-4 font-montserrat text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80 sm:mt-6 sm:text-sm md:text-base lg:text-lg"
                aria-label="Check the lineup"
              >
                CHECK THE LINEUP →
              </button>
            </div>
          </div>

          {/* Image */}
          <div className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh]">
            <Image
              src={IMAGES.LEFT_SIDE}
              alt="Featured product left"
              fill
              className="object-cover"
              quality={85}
              unoptimized
              decoding="sync"
              loading="eager"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col">
          {/* Image */}
          <div className="relative min-h-[60vh] bg-iron sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[90vh]">
            <Image
              src={IMAGES.RIGHT_SIDE}
              alt="Featured product right"
              fill
              className="object-cover"
              quality={85}
              unoptimized
              decoding="sync"
              loading="eager"
            />
          </div>

          {/* Text Block - Light Blue-Grey Background */}
          <div className="bg-iron text-night">
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
              <div className="space-y-1.5 font-montserrat text-xs font-normal leading-relaxed uppercase tracking-wide sm:space-y-2 sm:text-sm md:text-base lg:text-lg">
                <p className="font-bold">REIGN</p>
                <p>Power. Precision. Presence.</p>
                <p>For players who rule every moment on and off the pitch.</p>
              </div>
              <button
                onClick={handleCTAClick}
                className="mt-4 font-montserrat text-xs font-bold uppercase tracking-wide transition-opacity hover:opacity-80 sm:mt-6 sm:text-sm md:text-base lg:text-lg"
                aria-label="Check the lineup"
              >
                CHECK THE LINEUP →
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
