"use client";

import Link from "next/link";
import { memo } from "react";
// import { ROUTES, SOCIAL_LINKS } from "@/lib/navigation";
import { SOCIAL_LINKS } from "@/lib/navigation";

// ============================================================================
// TYPES
// ============================================================================

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterSection {
  title?: string;
  links: FooterLink[];
}

// ============================================================================
// FOOTER DATA STRUCTURE
// ============================================================================

// const FOOTER_NAVIGATION: FooterSection = {
//   links: [
//     { href: ROUTES.THE_PLAYBOOK, label: "The Play Book" },
//     { href: ROUTES.THE_CODE, label: "The Code" },
//     { href: ROUTES.ON_THE_MOVE, label: "On The Move" },
//     { href: ROUTES.REFUND_KICK, label: "Refund Kick" },
//   ],
// };

const SOCIAL_NAVIGATION: FooterSection = {
  links: [
    { href: SOCIAL_LINKS.TWITTER, label: "Twitter", external: true },
    { href: SOCIAL_LINKS.INSTAGRAM, label: "Instagram", external: true },
    { href: SOCIAL_LINKS.PINTEREST, label: "Pinterest", external: true },
  ],
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

/**
 * Animated footer link with flame hover effect
 */
const FooterLink = memo<FooterLink>(({ href, label, external = false }) => {
  const linkProps = external
    ? {
        target: "_blank" as const,
        rel: "noopener noreferrer",
        "aria-label": `${label} (opens in new tab)`,
      }
    : {};

  return (
    <Link
      href={href}
      {...linkProps}
      className="smooth-hover font-montserrat text-xs uppercase tracking-wide text-iron hover:text-flame focus:text-flame focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-night sm:text-sm md:text-base"
    >
      {label}
    </Link>
  );
});

FooterLink.displayName = "FooterLink";

/**
 * Navigation section with links
 */
const NavigationSection = memo<FooterSection>(({ links }) => {
  return (
    <nav
      className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4 md:gap-x-8"
      aria-label="Footer navigation"
    >
      {links.map((link) => (
        <FooterLink key={link.href} {...link} />
      ))}
    </nav>
  );
});

NavigationSection.displayName = "NavigationSection";

/**
 * Social media links section
 */
const SocialSection = memo<FooterSection>(({ links }) => {
  return (
    <nav
      className="flex flex-wrap gap-x-4 gap-y-3 sm:gap-x-6 sm:gap-y-4 md:gap-x-8"
      aria-label="Social media links"
    >
      {links.map((link) => (
        <FooterLink key={link.href} {...link} />
      ))}
    </nav>
  );
});

SocialSection.displayName = "SocialSection";

/**
 * Brand header with logo
 */
const BrandHeader = memo(() => {
  return (
    <div className="mb-6 sm:mb-8" role="banner">
      <h2
        className="font-thunder font-extralight text-3xl uppercase tracking-wider text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
        aria-label="FalseNine"
      >
        FALSENINE
      </h2>
    </div>
  );
});

BrandHeader.displayName = "BrandHeader";

/**
 * Copyright and credits bar
 */
const CopyrightBar = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white px-4 py-4 text-night sm:px-6 sm:py-5 md:px-8 md:py-6 lg:px-16">
      <div className="flex flex-col items-center gap-3 text-center sm:gap-4 md:flex-row md:justify-between md:text-left">
        <p className="font-montserrat text-[10px] sm:text-xs md:text-sm" role="contentinfo">
          <span aria-label={`Copyright ${currentYear} FalseNine`}>
            © {currentYear} FALSENINE. ALL RIGHTS RESERVED.
          </span>
        </p>
        <p className="font-montserrat text-[10px] sm:text-xs md:text-sm">
          GAME BUILT. STREET TESTED. BY{" "}
          <Link
            href={SOCIAL_LINKS.DEVELOPERS}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold transition-colors duration-300 hover:text-flame focus:text-flame focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2"
            aria-label="Kairos Agency (opens in new tab)"
          >
            KAIROS
          </Link>
          .
        </p>
      </div>
    </div>
  );
});

CopyrightBar.displayName = "CopyrightBar";

// ============================================================================
// MAIN FOOTER COMPONENT
// ============================================================================
const Footer = memo(() => {
  return (
    <footer
      className="bg-night text-iron"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-16 lg:py-16">
        {/* Brand */}
        <BrandHeader />

        {/* Policy Navigation */}
        {/* <div className="mb-8">
          <NavigationSection {...FOOTER_NAVIGATION} />
        </div> */}

        {/* Social Media Links */}
        <div>
          <SocialSection {...SOCIAL_NAVIGATION} />
        </div>
      </div>

      {/* Copyright Bar */}
      <CopyrightBar />
    </footer>
  );
});

Footer.displayName = "Footer";

// ============================================================================
// EXPORT
// ============================================================================

export default Footer;
