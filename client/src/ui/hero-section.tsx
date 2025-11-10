"use client";

import Image from "next/image";
import { IMAGES } from "@/config/images";

// ============================================================================
// HERO SECTION COMPONENT
// ============================================================================

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen w-full overflow-hidden"
      aria-label="Hero section"
    >
      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen flex-col justify-end">
        <div className="relative w-full px-4 pb-8 md:px-6 md:pb-12 lg:px-16 lg:pb-16">
          {/* Bottom Right - Descriptive Text */}
          <div className="mb-6 space-y-4 text-left sm:mb-8 sm:space-y-6 md:absolute md:bottom-[200px] md:right-6 md:mb-0 md:text-right lg:bottom-[364px] lg:right-16 xl:space-y-8">
            <p className="font-montserrat text-sm font-normal uppercase tracking-[0.2em] text-white sm:text-base md:text-lg">
              ( PLAY DIFFERENT )
            </p>
            <div className="space-y-1 font-montserrat text-xs font-normal leading-relaxed tracking-wide text-white sm:text-sm md:text-base">
              <p>BORN FROM THE GAME.</p>
              <p>BUILT FOR THE STREETS.</p>
              <p>FALSE NINE REDEFINES HOW</p>
              <p>FOOTBALL MEETS FASHION.</p>
            </div>
          </div>

          {/* Bottom Left - Main Title */}
          <div className="md:absolute md:bottom-16 md:left-6 lg:left-16">
            <h1
              className="font-thunder font-extralight uppercase leading-[0.85] tracking-tight text-white"
              style={{ fontSize: "clamp(48px, 12vw, 224px)" }}
            >
              FALSE
              <br />
              NINE
            </h1>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={IMAGES.HERO_SECTION}
          alt="FalseNine Hero"
          fill
          className="object-cover"
          priority
          quality={90}
          unoptimized
          fetchPriority="high"
          decoding="sync"
          loading="eager"
        />
        {/* Blur Overlay */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px]" />
      </div>
    </section>
  );
}
