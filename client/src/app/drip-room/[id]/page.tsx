"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useNavigation, ROUTES } from "@/lib/navigation";
import { getProductById as getProductByIdAPI } from "@/api/product";
import { Product } from "@/types/product";
import { ApiError } from "@/api/config";
import { addToCart } from "@/lib/cart";

// Product Detail Component
export default function ProductDetailPage() {
  const params = useParams();
  const { navigateTo, goBack } = useNavigation();
  const productId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!productId) {
        setError("Product ID is required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getProductByIdAPI(productId);
        if (response.success && response.data) {
          setProduct(response.data);
        } else {
          setError(response.error || "Product not found");
        }
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("Failed to load product");
        }
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [productId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <p className="font-montserrat text-sm uppercase tracking-wide text-night/60">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <h1 className="font-thunder text-4xl font-extralight uppercase tracking-tight text-night sm:text-5xl md:text-6xl">
            {error || "PRODUCT NOT FOUND"}
          </h1>
          <button
            onClick={() => navigateTo(ROUTES.DRIP_ROOM)}
            className="mt-6 font-montserrat text-sm font-bold uppercase tracking-wide text-flame transition-opacity hover:opacity-80 sm:text-base"
          >
            BACK TO DRIP ROOM →
          </button>
        </div>
      </main>
    );
  }

  const getAvailableStock = (size: string): number => {
    if (!product?.stock) return 999;
    return product.stock[size] || 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    if (!product) return;

    const result = addToCart(product, selectedSize, quantity);
    if (!result.success) {
      alert(result.error);
      return;
    }
    navigateTo(ROUTES.LOCKER);
  };

  const handleIncrement = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    const availableStock = getAvailableStock(selectedSize);
    setQuantity((prev) => {
      if (prev >= availableStock) {
        alert(`Only ${availableStock} available in stock`);
        return prev;
      }
      return prev + 1;
    });
  };

  const handleDecrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.pName,
            description: product.pDescription,
            image: product.image,
            offers: {
              "@type": "Offer",
              price: product.pPrice,
              priceCurrency: "INR",
            },
          }),
        }}
      />

      <main className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="px-4 pt-16 sm:px-6 sm:pt-20 md:px-8 md:pt-24 lg:px-16">
          <button
            onClick={goBack}
            className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 transition-opacity hover:opacity-80 sm:text-sm"
          >
            ← BACK
          </button>
        </div>

        {/* Product Section */}
        <section className="grid grid-cols-1 gap-6 px-4 py-4 sm:px-6 sm:gap-8 sm:py-6 md:grid-cols-2 md:px-8 md:py-8 lg:px-16 lg:py-12">
          {/* Image Column */}
          <div className="relative h-full w-full overflow-hidden bg-iron">
            <Image
              src={product.image}
              alt={product.pName}
              fill
              className="object-cover object-top"
              priority
              quality={90}
              unoptimized={product.image.includes("s3.ap-south-1.amazonaws.com")}
              fetchPriority="high"
              decoding="sync"
              loading="eager"
            />
          </div>

          {/* Product Info Column */}
          <div className="flex flex-col space-y-4 sm:space-y-6">
            {/* Category */}
            <p className="font-montserrat text-xs font-normal uppercase tracking-[0.35em] text-night/60 sm:text-sm">
              {product.pCategory}
            </p>

            {/* Product Name */}
            <h1 className="font-thunder text-3xl font-extralight uppercase leading-[0.9] tracking-tight text-night sm:text-4xl md:text-5xl lg:text-6xl">
              {product.pName}
            </h1>

            {/* Price */}
            <p className="font-montserrat text-2xl font-bold uppercase tracking-wide text-flame sm:text-3xl md:text-4xl">
              ₹{product.pPrice.toLocaleString()}
            </p>

            {/* Description */}
            <div className="space-y-2 pt-4">
              <p className="font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/70 sm:text-sm md:text-base">
                DESCRIPTION
              </p>
              <p className="font-montserrat text-xs font-normal leading-relaxed tracking-wide text-night/70 sm:text-sm md:text-base">
                {product.pDescription}
              </p>
            </div>

            {/* Fit */}
            <div className="space-y-2 pt-4">
              <p className="font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/70 sm:text-sm">
                FIT
              </p>
              <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night sm:text-sm md:text-base">
                {product.pFit}
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-3 pt-4">
              <p className="font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/70 sm:text-sm">
                SELECT SIZE
              </p>
              <div className="flex flex-wrap gap-3">
                {product.pSizes.map((size) => {
                  const stock = product.stock?.[size] || 0;
                  const isOutOfStock = stock === 0;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        if (!isOutOfStock) {
                          setSelectedSize(size);
                          // Reset quantity to 1 when size changes
                          setQuantity(1);
                        }
                      }}
                      disabled={isOutOfStock}
                      className={`smooth-hover px-4 py-2 font-montserrat text-xs font-normal uppercase tracking-wide transition-all sm:text-sm ${
                        isOutOfStock
                          ? "border border-night/10 bg-night/5 text-night/30 cursor-not-allowed"
                          : selectedSize === size
                          ? "border-2 border-flame bg-flame text-white"
                          : "border border-night/30 bg-white text-night hover:border-night"
                      }`}
                    >
                      {size} {isOutOfStock && "(Out of Stock)"}
                    </button>
                  );
                })}
              </div>
              {selectedSize && product.stock && (
                <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm">
                  {product.stock[selectedSize] || 0} available in stock
                </p>
              )}
            </div>

            {/* Quantity Selection */}
            <div className="space-y-3 pt-4">
              <p className="font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/70 sm:text-sm">
                QUANTITY
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleDecrement}
                  className="flex h-10 w-10 items-center justify-center border border-night/30 bg-white font-montserrat text-sm font-normal text-night transition-colors hover:border-night"
                >
                  −
                </button>
                <span className="font-montserrat text-sm font-normal uppercase tracking-wide text-night sm:text-base">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  disabled={selectedSize ? quantity >= getAvailableStock(selectedSize) : false}
                  className="flex h-10 w-10 items-center justify-center border border-night/30 bg-white font-montserrat text-sm font-normal text-night transition-colors hover:border-night disabled:cursor-not-allowed disabled:opacity-50"
                >
                  +
                </button>
              </div>
              {selectedSize && product.stock && (
                <p className="font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/50 sm:text-xs">
                  Max: {product.stock[selectedSize] || 0}
                </p>
              )}
            </div>

            {/* Add to Cart Button - 96px below quantity */}
            <div className="pt-24">
              <button
                onClick={handleAddToCart}
                className="smooth-hover w-full bg-night px-6 py-4 font-montserrat text-xs font-normal uppercase tracking-[0.3em] text-white transition-opacity hover:opacity-90 active:scale-[0.98] sm:text-sm md:px-8 md:py-5"
              >
                ADD TO LOCKER
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
