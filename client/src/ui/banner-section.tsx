"use client";

import Image from "next/image";
import { useNavigation, ROUTES } from "@/lib/navigation";
import { IMAGES } from "@/config/images";

// ============================================================================
// BANNER SECTION COMPONENT
// ============================================================================

export default function BannerSection() {
  const { navigateTo } = useNavigation();

  const handleCTAClick = () => {
    navigateTo(ROUTES.DRIP_ROOM);
  };

  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      aria-label="Banner section"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.BANNER}
          alt="Banner section background"
          fill
          className="object-cover"
          priority
          quality={90}
          unoptimized
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen flex-col justify-between px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16">
        {/* Left Text Block - Top Left */}
        <div className="w-full space-y-4 text-left sm:space-y-6 md:absolute md:left-8 md:top-[120px] md:w-[400px] lg:left-16 lg:top-[196px] lg:w-[500px] xl:w-[600px]">
          <div className="space-y-1.5 font-montserrat text-xs font-normal leading-relaxed uppercase tracking-wide text-white sm:space-y-2 sm:text-sm md:text-base lg:text-lg">
            <p className="font-bold">Frontline</p>
            <p>Built for comfort, made for the streets.</p>
            <p>Where grit, game, and style move as one.</p>
          </div>
          <button
            onClick={handleCTAClick}
            className="font-montserrat text-sm font-bold uppercase tracking-wide text-white transition-opacity hover:opacity-80 sm:text-base md:text-lg"
            aria-label="Check the lineup"
          >
            CHECK THE LINEUP →
          </button>
        </div>

        {/* Right Text Block - Bottom Right */}
        <div className="w-full space-y-1.5 text-left font-montserrat text-xs font-normal leading-relaxed uppercase tracking-wide text-white sm:space-y-2 sm:text-sm md:absolute md:bottom-[120px] md:right-8 md:w-[400px] md:text-right lg:bottom-[196px] lg:right-16 lg:w-[500px] lg:text-base xl:w-[600px] xl:text-lg">
          <p>FalseNine isn’t just fashion — it’s movement.</p>
          <p>Where football meets fashion.</p>
          <p>Built for play. Styled for the streets.</p>
        </div>
      </div>
    </section>
  );
}
