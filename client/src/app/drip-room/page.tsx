"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useNavigation } from "@/lib/navigation";
import { getAllProducts } from "@/api/product";
import { Product } from "@/types/product";
import { IMAGES } from "@/config/images";
import { ApiError } from "@/api/config";

// Product Card Component
const ProductCard = ({ product }: { product: Product }) => {
  const { navigateToDripRoom } = useNavigation();

  const handleClick = () => {
    navigateToDripRoom(product.id);
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden bg-white"
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-iron">
        <Image
          src={product.image}
          alt={product.pName}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          quality={85}
          unoptimized={product.image.includes("s3.ap-south-1.amazonaws.com")}
        />
      </div>

      {/* Product Info */}
      <div className="bg-white p-4 sm:p-6 md:p-8">
        <div className="space-y-2">
          <h3 className="font-montserrat text-sm font-bold uppercase tracking-wide text-night sm:text-base md:text-lg">
            {product.pName}
          </h3>
          <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm">
            {product.pCategory}
          </p>
          <p className="font-montserrat text-sm font-bold uppercase tracking-wide text-flame sm:text-base md:text-lg">
            ₹{product.pPrice.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function DripRoomPage() {
  const pageDescription =
    "Explore our latest drops — premium football-inspired streetwear designed for players who move different.";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllProducts();
        if (response.success && response.data) {
          setProducts(response.data);
        } else {
          setError(response.error || "Failed to load products");
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Generate structured data
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Drip Room - FalseNine",
    description: pageDescription,
    url: "https://falseninejersey.shop/drip-room",
    isPartOf: {
      "@type": "WebSite",
      name: "FalseNine",
      url: "https://falseninejersey.shop",
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <main className="min-h-screen bg-white">
        {/* Header Section - Fixed */}
        <section className="relative h-screen w-full overflow-hidden mt-12 sm:mt-16 md:mt-20">
          <div className="absolute inset-0">
            <Image
              src={IMAGES.BANNER}
              alt="Drip Room"
              fill
              className="object-cover object-center"
              quality={90}
              priority
              unoptimized
              fetchPriority="high"
              decoding="sync"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>

          {/* Header Content */}
          <div className="relative z-10 flex h-full items-center px-4 md:px-8 lg:px-16">
            <div className="max-w-2xl">
              <h1 className="font-thunder text-7xl font-extralight uppercase leading-[0.85] tracking-tight text-white sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem]">
                DRIP
                <br />
                ROOM
              </h1>
              <p className="mt-6 max-w-lg font-montserrat text-sm font-normal uppercase tracking-wide text-white/90 sm:text-base md:mt-8 md:text-lg">
                {pageDescription}
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full px-4 py-8 md:px-8 md:py-16 lg:px-16 lg:py-20">
          {loading ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-montserrat text-sm uppercase tracking-wide text-night/60">
                Loading products...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-4 text-center">
              <p className="font-montserrat text-sm font-normal uppercase tracking-wide text-red-600">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 transition-opacity hover:opacity-80 sm:text-sm"
              >
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[50vh] items-center justify-center">
              <p className="font-montserrat text-sm uppercase tracking-wide text-night/60">
                No products available
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
