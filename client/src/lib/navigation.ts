"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface NavigationOptions {
  replace?: boolean;
  scroll?: boolean;
  /** Enable performance monitoring for this navigation */
  trackPerformance?: boolean;
}

export interface ExternalLinkOptions {
  target?: "_blank" | "_self" | "_parent" | "_top";
  features?: string;
  /** Enable security validation for external links */
  validateSecurity?: boolean;
}

export interface RouteMetadata {
  title: string;
  description: string;
  keywords?: string[];
  /** Indicates if this route should be lazy loaded */
  lazy?: boolean;
  /** Priority level for prefetching (higher = more important) */
  prefetchPriority?: "high" | "medium" | "low";
}

export interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

export interface NavigationState {
  isNavigating: boolean;
  currentPath: string | null;
  error: Error | null;
}

export interface PerformanceMetrics {
  navigationStart: number;
  navigationEnd: number;
  duration: number;
  route: string;
}

// ============================================================================
// ROUTE CONSTANTS (Football-themed naming)
// ============================================================================

export const ROUTES = {
  THE_PLAY: "/", //homepage
  DRIP_ROOM: "/drip-room", //product listing
  DRIP_ROOM_DETAIL: "/drip-room/[id]", //product detail
  LOCKER: "/locker", //cart
  PLAYER_CARD: "/player-card", //user profile
  THE_PLAYBOOK: "/the-playbook", //terms and conditions
  THE_CODE: "/the-code", //privacy policy
  ON_THE_MOVE: "/on-the-move", //delivery policy
  REFUND_KICK: "/refund-kick", //refund n return policy
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];

// ============================================================================
// EXTERNAL LINKS
// ============================================================================

export const SOCIAL_LINKS = {
  INSTAGRAM: "https://instagram.com/kairos.artifex",
  TWITTER: "https://x.com/kairosartifex",
  PINTEREST: "https://pinterest.com/kairosartifex",
  DEVELOPERS: "https://www.kairosagency.xyz",
} as const;

export const CONTACT_LINKS = {
  EMAIL: "mailto:falsenine.in@gmail.com",
  PHONE: "tel:+919004220720", //cypher's contact number
} as const;

export type SocialPlatform = keyof typeof SOCIAL_LINKS;

// ============================================================================
// SECURITY CONSTANTS
// ============================================================================

/** Whitelist of allowed external domains for enhanced security */
const ALLOWED_EXTERNAL_DOMAINS = [
  "instagram.com",
  "x.com",
  "twitter.com",
  "pinterest.com",
  "kairosagency.xyz",
] as const;

/** Protocols considered safe for navigation */
const SAFE_PROTOCOLS = ["http:", "https:", "mailto:", "tel:", "sms:"] as const;

// ============================================================================
// SEO METADATA
// ============================================================================

export const ROUTE_METADATA: Record<string, RouteMetadata> = {
  [ROUTES.THE_PLAY]: {
    title: "The Play - FalseNine",
    description:
      "Born from football, built for streets. Discover next-gen streetwear inspired by the beautiful game.",
    keywords: [
      "football streetwear",
      "sportswear",
      "athletic fashion",
      "FalseNine",
      "premium clothing",
      "urban apparel",
    ],
    prefetchPriority: "high",
  },

  [ROUTES.DRIP_ROOM]: {
    title: "Drip Room - FalseNine",
    description:
      "Explore our latest drops — premium football-inspired streetwear designed for players who move different.",
    keywords: [
      "collection",
      "drops",
      "sportswear",
      "streetwear",
      "athletic fashion",
      "FalseNine",
    ],
    prefetchPriority: "high",
  },

  [ROUTES.DRIP_ROOM_DETAIL]: {
    title: "Product Details - Drip Room",
    description:
      "Discover the details of premium football-inspired streetwear. Quality materials, unique designs, and the perfect fit for your game.",
    keywords: [
      "product details",
      "football streetwear",
      "sportswear details",
      "FalseNine product",
      "streetwear specs",
    ],
    prefetchPriority: "high",
  },

  [ROUTES.LOCKER]: {
    title: "Locker - Your Cart",
    description:
      "Your picks are ready. Review your gear and get set for checkout.",
    keywords: ["cart", "locker", "checkout", "shopping", "sportswear"],
    prefetchPriority: "high",
  },

  [ROUTES.PLAYER_CARD]: {
    title: "Player Card - Your Profile",
    description:
      "Your personal stats, preferences, and orders — all in one place. Manage your FalseNine account.",
    keywords: ["profile", "account", "user", "player card", "dashboard"],
    prefetchPriority: "medium",
  },

  [ROUTES.THE_PLAYBOOK]: {
    title: "The Playbook - Terms & Conditions",
    description:
      "Every game has rules. Read the official FalseNine playbook to understand how we keep the match fair and secure.",
    keywords: [
      "terms and conditions",
      "user agreement",
      "FalseNine",
      "legal",
      "policy",
    ],
    prefetchPriority: "low",
    lazy: true,
  },

  [ROUTES.THE_CODE]: {
    title: "The Code - Privacy Policy",
    description:
      "Respecting your privacy is part of our game plan. Learn how FalseNine protects your data on and off the pitch.",
    keywords: [
      "privacy policy",
      "data protection",
      "user privacy",
      "FalseNine",
      "security",
    ],
    prefetchPriority: "low",
    lazy: true,
  },

  [ROUTES.ON_THE_MOVE]: {
    title: "On the Move - Delivery Policy",
    description:
      "Fast, reliable delivery to keep you moving. Learn about FalseNine's shipping options, timelines, and tracking.",
    keywords: [
      "delivery policy",
      "shipping",
      "delivery times",
      "FalseNine shipping",
      "order tracking",
    ],
    prefetchPriority: "low",
    lazy: true,
  },

  [ROUTES.REFUND_KICK]: {
    title: "Refund Kick - Returns & Refunds",
    description:
      "Not the right fit? No worries. Learn about our hassle-free returns and refund process at FalseNine.",
    keywords: [
      "refund policy",
      "return policy",
      "exchanges",
      "FalseNine returns",
      "money back",
    ],
    prefetchPriority: "low",
    lazy: true,
  },
};

// ============================================================================
// SECURITY UTILITIES
// ============================================================================

/**
 * Sanitizes a URL to prevent XSS and injection attacks
 * @param url - The URL to sanitize
 * @returns Sanitized URL or null if invalid
 * @example
 * ```typescript
 * const safe = sanitizeUrl("javascript:alert('xss')"); // Returns null
 * const valid = sanitizeUrl("https://example.com"); // Returns "https://example.com"
 * ```
 */
export const sanitizeUrl = (url: string): string | null => {
  if (!url || typeof url !== "string") return null;

  const trimmedUrl = url.trim();

  // Block dangerous protocols
  const dangerousPatterns = [
    /^javascript:/i,
    /^data:/i,
    /^vbscript:/i,
    /^file:/i,
    /^about:/i,
  ];

  if (dangerousPatterns.some((pattern) => pattern.test(trimmedUrl))) {
    console.warn("[Security] Blocked dangerous URL pattern:", trimmedUrl);
    return null;
  }

  // Validate URL structure
  try {
    const urlObj = new URL(
      trimmedUrl,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost"
    );
    return urlObj.href;
  } catch {
    // Check if it's a safe protocol
    if (SAFE_PROTOCOLS.some((protocol) => trimmedUrl.startsWith(protocol))) {
      return trimmedUrl;
    }
    return null;
  }
};

/**
 * Validates if an external domain is whitelisted
 * @param url - The URL to validate
 * @returns True if domain is allowed
 */
export const isAllowedExternalDomain = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return ALLOWED_EXTERNAL_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};

/**
 * Validates and sanitizes external URLs with security checks
 * @param url - The URL to validate
 * @param strict - Enable strict validation (whitelist check)
 * @returns Sanitized URL or null if invalid
 */
export const validateExternalUrl = (
  url: string,
  strict: boolean = false
): string | null => {
  const sanitized = sanitizeUrl(url);
  if (!sanitized) return null;

  if (strict && !isAllowedExternalDomain(sanitized)) {
    console.warn("[Security] External domain not whitelisted:", sanitized);
    return null;
  }

  return sanitized;
};

// ============================================================================
// ROUTE VALIDATION UTILITIES
// ============================================================================

/**
 * Generates a dynamic route by replacing parameters
 * @param template - Route template with [param] placeholders
 * @param params - Object containing parameter values
 * @returns Constructed route path
 * @example
 * ```typescript
 * buildRoute("/drip-room/[id]", { id: "striker-jersey" })
 * // Returns: "/drip-room/striker-jersey"
 * ```
 */
export const buildRoute = (
  template: string,
  params: Record<string, string>
): string => {
  if (!template || typeof template !== "string") {
    throw new Error("[Navigation] Invalid route template");
  }

  return Object.entries(params).reduce((route, [key, value]) => {
    if (!value || typeof value !== "string") {
      throw new Error(`[Navigation] Invalid parameter value for key: ${key}`);
    }
    return route.replace(`[${key}]`, encodeURIComponent(value));
  }, template);
};

/**
 * Constructs a product detail page route (Drip Room)
 * @param productId - The product identifier
 * @returns Full route path
 * @throws Error if productId is invalid
 */
export const buildDripRoomRoute = (productId: string): string => {
  if (!productId || typeof productId !== "string" || productId.trim() === "") {
    throw new Error("[Navigation] Invalid product ID");
  }
  return buildRoute(ROUTES.DRIP_ROOM_DETAIL, { id: productId.trim() });
};

/**
 * Extracts product ID from a drip room detail URL
 * @param path - The URL path to parse
 * @returns Product ID or null if not found
 * @example
 * ```typescript
 * extractProductId("/drip-room/striker-jersey") // Returns: "striker-jersey"
 * extractProductId("/") // Returns: null
 * ```
 */
export const extractProductId = (path: string): string | null => {
  if (!path || typeof path !== "string") return null;

  const match = path.match(/^\/drip-room\/([^/]+)$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    console.warn("[Navigation] Failed to decode product ID from path:", path);
    return null;
  }
};

/**
 * Determines if a URL points to an external resource
 * @param url - The URL to check
 * @returns True if URL is external
 */
export const isExternalUrl = (url: string): boolean => {
  if (!url || typeof url !== "string") return false;

  try {
    const urlObj = new URL(
      url,
      typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost"
    );
    return (
      urlObj.origin !==
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost")
    );
  } catch {
    return (
      url.startsWith("mailto:") ||
      url.startsWith("tel:") ||
      url.startsWith("sms:")
    );
  }
};

/**
 * Validates if a path is a recognized internal route
 * @param path - The path to validate
 * @returns True if path is valid
 */
export const isValidRoute = (path: string): boolean => {
  if (!path || typeof path !== "string") return false;

  const staticRoutes = Object.values(ROUTES).filter(
    (route) => !route.includes("[")
  );

  return (
    staticRoutes.includes(path as RoutePath) ||
    /^\/drip-room\/[^/]+$/.test(path)
  );
};

/**
 * Retrieves SEO metadata for a given route
 * @param path - The route path
 * @returns Route metadata or null
 */
export const getRouteMetadata = (path: string): RouteMetadata | null => {
  return ROUTE_METADATA[path] || null;
};

/**
 * Generates breadcrumb navigation items for the current path
 * @param currentPath - The current route path
 * @param productTitle - Optional product title for detail pages
 * @returns Array of breadcrumb items
 * @example
 * ```typescript
 * generateBreadcrumbs("/drip-room/striker-jersey", "Striker Jersey")
 * // Returns: [
 * //   { label: "The Play", path: "/" },
 * //   { label: "Drip Room", path: "/drip-room" },
 * //   { label: "Striker Jersey", path: "/drip-room/striker-jersey", isActive: true }
 * // ]
 * ```
 */
export const generateBreadcrumbs = (
  currentPath: string,
  productTitle?: string
): BreadcrumbItem[] => {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "The Play", path: ROUTES.THE_PLAY },
  ];

  if (!currentPath || currentPath === ROUTES.THE_PLAY) {
    breadcrumbs[0].isActive = true;
    return breadcrumbs;
  }

  // Drip Room list page
  if (currentPath === ROUTES.DRIP_ROOM) {
    breadcrumbs.push({
      label: "Drip Room",
      path: ROUTES.DRIP_ROOM,
      isActive: true,
    });
    return breadcrumbs;
  }

  // Drip Room detail page
  const productId = extractProductId(currentPath);
  if (productId) {
    breadcrumbs.push({ label: "Drip Room", path: ROUTES.DRIP_ROOM });
    breadcrumbs.push({
      label: productTitle || "Product",
      path: currentPath,
      isActive: true,
    });
    return breadcrumbs;
  }

  // Other static pages
  const metadata = getRouteMetadata(currentPath);
  if (metadata) {
    const label = metadata.title.split(" - ")[0];
    breadcrumbs.push({ label, path: currentPath, isActive: true });
  }

  return breadcrumbs;
};

// ============================================================================
// PERFORMANCE MONITORING
// ============================================================================

/**
 * Performance monitoring utility for navigation events
 */
class NavigationPerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 50; // Keep last 50 navigations

  /**
   * Records the start of a navigation event
   */
  startNavigation(route: string): number {
    void route;
    return performance.now();
  }

  /**
   * Records the end of a navigation event and calculates duration
   */
  endNavigation(route: string, startTime: number): PerformanceMetrics {
    const endTime = performance.now();
    const metric: PerformanceMetrics = {
      navigationStart: startTime,
      navigationEnd: endTime,
      duration: endTime - startTime,
      route,
    };

    this.metrics.push(metric);

    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift();
    }

    // Log slow navigations
    if (metric.duration > 1000) {
      console.warn(
        `[Performance] Slow navigation detected: ${route} (${metric.duration.toFixed(
          2
        )}ms)`
      );
    }

    return metric;
  }

  /**
   * Gets average navigation duration
   */
  getAverageDuration(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.metrics.length;
  }

  /**
   * Gets all recorded metrics
   */
  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  /**
   * Clears all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

// Global performance monitor instance
const performanceMonitor = new NavigationPerformanceMonitor();

// ============================================================================
// NAVIGATION HOOK
// ============================================================================

/**
 * Enhanced navigation hook with performance monitoring and loading states
 * @returns Navigation utilities and state
 * @example
 * ```typescript
 * const { navigateTo, isNavigating, navigateToDripRoom } = useNavigation();
 *
 * // Navigate to a route
 * await navigateTo("/drip-room");
 *
 * // Navigate to specific product
 * await navigateToDripRoom("striker-jersey");
 *
 * // Check navigation state
 * if (isNavigating) {
 *   return <LoadingSpinner />;
 * }
 * ```
 */
export const useNavigation = () => {
  const router = useRouter();
  const [navigationState, setNavigationState] = useState<NavigationState>({
    isNavigating: false,
    currentPath: null,
    error: null,
  });

  // Track current path
  useEffect(() => {
    if (typeof window !== "undefined") {
      setNavigationState((prev) => ({
        ...prev,
        currentPath: window.location.pathname,
      }));
    }
  }, []);

  const navigateTo = useCallback(
    async (path: string, options: NavigationOptions = {}): Promise<void> => {
      const {
        replace = false,
        scroll = true,
        trackPerformance = true,
      } = options;

      // Validate path
      if (!isValidRoute(path) && !path.startsWith("/")) {
        const error = new Error(`Invalid route: ${path}`);
        setNavigationState((prev) => ({ ...prev, error }));
        console.error("[Navigation] Invalid route:", path);
        return;
      }

      setNavigationState({
        isNavigating: true,
        currentPath: path,
        error: null,
      });

      const startTime = trackPerformance
        ? performanceMonitor.startNavigation(path)
        : 0;

      try {
        if (replace) {
          router.replace(path, { scroll });
        } else {
          router.push(path, { scroll });
        }

        if (trackPerformance) {
          performanceMonitor.endNavigation(path, startTime);
        }

        setNavigationState({
          isNavigating: false,
          currentPath: path,
          error: null,
        });
      } catch (err) {
        const navError =
          err instanceof Error ? err : new Error("Navigation failed");

        setNavigationState({
          isNavigating: false,
          currentPath: null,
          error: navError,
        });

        console.error("[Navigation] Error:", navError);

        // Fallback to window navigation
        if (typeof window !== "undefined") {
          window.location.href = path;
        }
      }
    },
    [router]
  );

  const navigateToExternal = useCallback(
    (url: string, options: ExternalLinkOptions = {}): void => {
      const {
        target = "_blank",
        features = "noopener,noreferrer",
        validateSecurity = true,
      } = options;

      if (typeof window === "undefined") return;

      // Security validation
      const validatedUrl = validateSecurity
        ? validateExternalUrl(url, true)
        : sanitizeUrl(url);

      if (!validatedUrl) {
        console.error("[Navigation] Invalid or blocked external URL:", url);
        return;
      }

      try {
        if (target === "_blank") {
          window.open(validatedUrl, target, features);
        } else {
          window.location.href = validatedUrl;
        }
      } catch (err) {
        console.error("[Navigation] External navigation error:", err);
      }
    },
    []
  );

  const navigateToDripRoom = useCallback(
    async (
      productId: string,
      options: NavigationOptions = {}
    ): Promise<void> => {
      try {
        const dripRoomPath = buildDripRoomRoute(productId);
        await navigateTo(dripRoomPath, options);
      } catch (err) {
        console.error("[Navigation] Failed to navigate to drip room:", err);
        setNavigationState((prev) => ({
          ...prev,
          error: err instanceof Error ? err : new Error("Navigation failed"),
        }));
      }
    },
    [navigateTo]
  );

  const navigateToSocial = useCallback(
    (platform: SocialPlatform): void => {
      navigateToExternal(SOCIAL_LINKS[platform]);
    },
    [navigateToExternal]
  );

  const goBack = useCallback((): void => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      void navigateTo(ROUTES.THE_PLAY);
    }
  }, [router, navigateTo]);

  const goForward = useCallback((): void => {
    router.forward();
  }, [router]);

  const refresh = useCallback((): void => {
    router.refresh();
  }, [router]);

  const prefetch = useCallback(
    (path: string): void => {
      if (!isValidRoute(path) || isExternalUrl(path)) {
        return;
      }

      try {
        const metadata = getRouteMetadata(path);
        // Respect lazy loading preferences
        if (metadata?.lazy) {
          return;
        }
        router.prefetch(path);
      } catch {
        console.warn("[Navigation] Prefetch failed for:", path);
      }
    },
    [router]
  );

  const prefetchDripRoom = useCallback(
    (productId: string): void => {
      try {
        const dripRoomPath = buildDripRoomRoute(productId);
        prefetch(dripRoomPath);
      } catch {
        console.warn("[Navigation] Failed to prefetch drip room:", productId);
      }
    },
    [prefetch]
  );

  const getPerformanceMetrics = useCallback((): PerformanceMetrics[] => {
    return performanceMonitor.getMetrics();
  }, []);

  const clearPerformanceMetrics = useCallback((): void => {
    performanceMonitor.clearMetrics();
  }, []);

  return {
    // Navigation
    navigateTo,
    navigateToExternal,
    navigateToDripRoom,
    navigateToSocial,

    // History
    goBack,
    goForward,
    refresh,

    // Performance
    prefetch,
    prefetchDripRoom,

    // State
    isNavigating: navigationState.isNavigating,
    currentPath: navigationState.currentPath,
    error: navigationState.error,

    // Performance monitoring
    getPerformanceMetrics,
    clearPerformanceMetrics,
  };
};

// ============================================================================
// STANDALONE UTILITIES
// ============================================================================

/**
 * Standalone navigation utilities for use outside React components
 * @example
 * ```typescript
 * // Navigate to a route
 * navigate.to("/drip-room");
 *
 * // Navigate to external link in new tab
 * navigate.to("https://example.com", "_blank");
 *
 * // Navigate to specific product
 * navigate.toDripRoom("striker-jersey");
 *
 * // Navigate to social media
 * navigate.toSocial("INSTAGRAM");
 * ```
 */
export const navigate = {
  to: (destination: string, target: "_self" | "_blank" = "_self"): void => {
    if (typeof window === "undefined") return;

    const sanitized = sanitizeUrl(destination);
    if (!sanitized) {
      console.error("[Navigation] Invalid destination:", destination);
      return;
    }

    if (isExternalUrl(sanitized)) {
      const validated = validateExternalUrl(sanitized, true);
      if (!validated) {
        console.error("[Navigation] External URL blocked:", sanitized);
        return;
      }

      if (target === "_blank") {
        window.open(validated, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = validated;
      }
    } else {
      window.location.href = sanitized;
    }
  },

  toDripRoom: (productId: string): void => {
    try {
      navigate.to(buildDripRoomRoute(productId));
    } catch (err) {
      console.error("[Navigation] Failed to navigate to drip room:", err);
    }
  },

  toSocial: (platform: SocialPlatform): void => {
    navigate.to(SOCIAL_LINKS[platform], "_blank");
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export const routes = ROUTES;
export const socialLinks = SOCIAL_LINKS;
export const contactLinks = CONTACT_LINKS;
export { performanceMonitor as navigationPerformanceMonitor };
