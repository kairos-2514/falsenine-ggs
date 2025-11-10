"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useNavigation, ROUTES } from "@/lib/navigation";
import { seoConfig } from "@/config/seo-config";
import { CartItem } from "@/types/product";
import {
  getCartItems,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} from "@/lib/cart";
import AuthForm from "@/ui/auth-form";
import AddressForm from "@/ui/address-form";
import { UserResponse } from "@/api/auth";
import { saveUserData, getUserData, getUserId } from "@/lib/auth";
import { getUserAddress, AddressResponse } from "@/api/address";

type CheckoutStep = "cart" | "auth" | "address" | "address-confirm";

interface WindowWithRazorpay extends Window {
  Razorpay?: new (options: unknown) => { open: () => void };
  razorpayLoaded?: boolean;
}

// Resolve API base from env and strip any trailing slash
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export default function LockerPage() {
  const { navigateTo } = useNavigation();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [savedAddress, setSavedAddress] = useState<AddressResponse | null>(
    null
  );
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  // Load cart items on mount and listen for updates
  useEffect(() => {
    const loadCart = () => {
      setCartItems(getCartItems());
    };

    loadCart();

    // Listen for cart updates from other pages
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, []);

  // Load user data if logged in
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setCurrentUser(userData);
    }
  }, []);

  // Step 2: Check Razorpay availability on mount and periodically
  useEffect(() => {
    const checkRazorpay = () => {
      console.log("🔍 CHECKING RAZORPAY AVAILABILITY:");
      console.log("- Window defined:", typeof window !== "undefined");
      const windowWithRazorpay = window as WindowWithRazorpay;
      const razorpayAvailable =
        typeof window !== "undefined" &&
        typeof windowWithRazorpay.Razorpay !== "undefined";
      console.log("- Razorpay available:", razorpayAvailable);

      if (typeof window !== "undefined") {
        if (razorpayAvailable) {
          console.log("✅ Razorpay is available");
          windowWithRazorpay.razorpayLoaded = true;
        } else {
          console.warn("⚠️ Razorpay not yet loaded, will check again...");
          windowWithRazorpay.razorpayLoaded = false;
        }
      }
    };

    // Check immediately
    checkRazorpay();

    // Check again after a delay (script might still be loading)
    const timeout = setTimeout(() => {
      checkRazorpay();
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // Handle proceed to checkout
  const handleProceedToCheckout = async () => {
    const userId = getUserId();

    if (!userId) {
      // Not logged in - show auth form
      setCheckoutStep("auth");
      return;
    }

    // User is logged in - check for address
    setLoadingAddress(true);
    try {
      const addressResponse = await getUserAddress(userId);
      if (addressResponse.data) {
        // User has address - show confirmation
        setSavedAddress(addressResponse.data);
        setCheckoutStep("address-confirm");
      } else {
        // User doesn't have address - show address form
        const userData = getUserData();
        if (userData) {
          setCurrentUser(userData);
        }
        setCheckoutStep("address");
      }
    } catch {
      // Address not found or error - show address form
      const userData = getUserData();
      if (userData) {
        setCurrentUser(userData);
      }
      setCheckoutStep("address");
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleRemoveItem = (itemId: string, selectedSize: string) => {
    removeFromCart(itemId, selectedSize);
    setCartItems(getCartItems());
  };

  const handleUpdateQuantity = async (
    itemId: string,
    selectedSize: string,
    newQuantity: number
  ) => {
    // Fetch product to get stock information
    try {
      const { getProductById } = await import("@/api/product");
      const productResponse = await getProductById(itemId);
      if (productResponse.success && productResponse.data) {
        const result = updateCartItemQuantity(
          itemId,
          selectedSize,
          newQuantity,
          productResponse.data
        );
        if (!result.success) {
          alert(result.error);
        }
      } else {
        // Fallback if product fetch fails
        updateCartItemQuantity(itemId, selectedSize, newQuantity);
      }
    } catch {
      // Fallback if product fetch fails
      updateCartItemQuantity(itemId, selectedSize, newQuantity);
    }
    setCartItems(getCartItems());
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.pPrice * item.quantity,
      0
    );
  };

  const handlePayment = async () => {
    if (!currentUser || !savedAddress || cartItems.length === 0) {
      alert("Please ensure you have items in cart and address is saved");
      return;
    }

    setProcessingPayment(true);

    try {
      const totalAmount = calculateTotal();

      // Step 1: Create Razorpay order (using env-based API)
      console.log("💳 Creating Razorpay order...");
      const { data: razorpayOrder } = await axios.post(
        `${API_URL}/api/v2/razorpay/create-transaction`,
        { amount: totalAmount }
      );
      console.log("✅ Razorpay order created:", razorpayOrder.id);

      // Step 2: Prepare order data
      const orderId = `ORD_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const orderData = {
        orderId,
        userId: currentUser.userId,
        userEmail: currentUser.email,
        totalAmount: totalAmount,
        currency: "INR",
        orderStatus: "PAID",
        shippingAddress: {
          fullName: String(savedAddress.fullName || ""),
          phoneNumber: String(savedAddress.phoneNumber || ""),
          addressLine1: String(savedAddress.addressLine1 || ""),
          addressLine2: savedAddress.addressLine2
            ? String(savedAddress.addressLine2)
            : undefined,
          city: String(savedAddress.city || ""),
          state: String(savedAddress.state || ""),
          pinCode: String(savedAddress.pinCode || ""),
          country: String(savedAddress.country || ""),
        },
        items: cartItems.map((item) => ({
          productId: String(item.id),
          productName: String(item.pName || ""),
          productDescription: item.pDescription
            ? String(item.pDescription)
            : undefined,
          quantity: Number(item.quantity || 1),
          pricePerUnit: Number(item.pPrice || 0),
          totalPrice: Number(item.pPrice || 0) * Number(item.quantity || 1),
          selectedSize: item.selectedSize
            ? String(item.selectedSize)
            : undefined,
          image: item.image ? String(item.image) : undefined,
        })),
        razorpayOrderId: razorpayOrder.id,
        razorpayPaymentId: "TEST_MODE",
        createdAt: new Date().toISOString(),
      };

      console.log("📦 Order data prepared:", orderData.orderId);

      // Step 3: Save order to DynamoDB IMMEDIATELY (test mode) using env-based API
      console.log("💾 Saving order to DynamoDB immediately (test mode):");
      console.log("📤 Order payload:", JSON.stringify(orderData, null, 2));

      try {
        const saveResponse = await axios.post(
          `${API_URL}/api/orders/test-save`,
          orderData,
          {
            headers: { "Content-Type": "application/json" },
            timeout: 30000,
          }
        );

        console.log("✅ Order save response:", saveResponse.data);

        if (!saveResponse.data.success) {
          throw new Error(saveResponse.data.error || "Order save failed");
        }

        console.log("✅✅✅ ORDER SAVED SUCCESSFULLY TO DYNAMODB ✅✅✅");
      } catch (saveError) {
        console.error("❌ Order save failed:", saveError);
        const errorMessage = axios.isAxiosError(saveError)
          ? saveError.response?.data?.error ||
            saveError.message ||
            "Unknown error"
          : saveError instanceof Error
          ? saveError.message
          : "Unknown error";
        alert(
          `Order save failed before opening payment.\n\nOrder ID: ${orderData.orderId}\nError: ${errorMessage}\n\nPlease try again.`
        );
        setProcessingPayment(false);
        return;
      }

      // Step 4: Check if Razorpay is loaded
      const windowWithRazorpay = window as WindowWithRazorpay;
      if (typeof window === "undefined" || !windowWithRazorpay.Razorpay) {
        console.error("❌ Razorpay script not loaded!");
        alert(
          "Payment gateway not loaded. Please refresh the page and try again."
        );
        setProcessingPayment(false);
        return;
      }

      // Step 5: Initialize Razorpay (order already saved, just handle payment UI)
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_TEST_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "FalseNine",
        description: `Order #${orderId}`,
        order_id: razorpayOrder.id,
        handler: async function (razorpayResponse: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          console.log("\n🎉🎉🎉 RAZORPAY PAYMENT SUCCESSFUL 🎉🎉🎉");
          console.log(
            "Payment Response:",
            JSON.stringify(razorpayResponse, null, 2)
          );
          console.log("✅ Order already saved to DynamoDB before payment");

          // Order is already saved, just clear cart and redirect
          clearCart();
          setCartItems([]);
          navigateTo(ROUTES.PLAYER_CARD);
          setProcessingPayment(false);
        },
        prefill: {
          name: savedAddress.fullName,
          email: currentUser.email,
          contact: savedAddress.phoneNumber,
        },
        theme: {
          color: "#000000",
        },
        modal: {
          ondismiss: function () {
            console.log("❌ Razorpay modal dismissed");
            // Order is already saved, just reset processing state
            setProcessingPayment(false);
          },
        },
      };

      // Step 6: Open Razorpay payment modal (order already saved to DB)
      console.log(
        "🚀 Opening Razorpay payment modal (order already saved to DB)..."
      );
      const rzp = new windowWithRazorpay.Razorpay(options);
      rzp.open();
      console.log("✅ Razorpay modal opened");
    } catch (error) {
      console.error("❌ Error in handlePayment:", error);
      const errorMessage = axios.isAxiosError(error)
        ? error.response?.data?.error ||
          error.message ||
          "Failed to initialize payment"
        : error instanceof Error
        ? error.message
        : "Failed to initialize payment";
      alert("Payment initialization failed: " + errorMessage);
      setProcessingPayment(false);
    }
  };

  const CartItemCard = ({ item }: { item: CartItem }) => {
    return (
      <div className="grid grid-cols-1 gap-4 border-b border-night/10 pb-6 sm:grid-cols-[200px_1fr] md:grid-cols-[250px_1fr]">
        {/* Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-iron sm:w-full">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.pName}
              fill
              className="object-cover"
              quality={100}
              onError={() => {
                console.error(
                  `Failed to load image for cart item ${item.id}:`,
                  item.image
                );
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-iron text-night/30">
              <p className="font-montserrat text-xs uppercase">No Image</p>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <h3 className="font-montserrat text-sm font-bold uppercase tracking-wide text-night sm:text-base md:text-lg">
              {item.pName}
            </h3>
            <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm">
              {item.pCategory}
            </p>
            <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm">
              SIZE: {item.selectedSize}
            </p>
            <p className="font-montserrat text-base font-bold uppercase tracking-wide text-flame sm:text-lg md:text-xl">
              ₹{item.pPrice.toLocaleString()}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  handleUpdateQuantity(
                    item.id,
                    item.selectedSize,
                    item.quantity - 1
                  )
                }
                className="flex h-8 w-8 items-center justify-center border border-night/30 bg-white font-montserrat text-sm font-normal text-night transition-colors hover:border-night sm:h-10 sm:w-10"
              >
                −
              </button>
              <span className="font-montserrat text-sm font-normal uppercase tracking-wide text-night sm:text-base">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  handleUpdateQuantity(
                    item.id,
                    item.selectedSize,
                    item.quantity + 1
                  )
                }
                className="flex h-8 w-8 items-center justify-center border border-night/30 bg-white font-montserrat text-sm font-normal text-night transition-colors hover:border-night sm:h-10 sm:w-10"
              >
                +
              </button>
            </div>

            <button
              onClick={() => handleRemoveItem(item.id, item.selectedSize)}
              className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 transition-opacity hover:opacity-80 sm:text-sm"
            >
              REMOVE
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            seoConfig.createCollectionSchema({
              name: "Locker - FalseNine",
              description:
                "Your picks are ready. Review your gear and get set for checkout.",
              itemCount: cartItems.length,
              url: seoConfig.getCanonicalUrl(ROUTES.LOCKER),
            })
          ),
        }}
      />

      <main className="min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        {/* Page Header */}
        <div className="border-b border-night/10 bg-white px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12">
          <h1 className="font-thunder text-3xl font-extralight uppercase leading-[0.85] tracking-tight text-night sm:text-4xl md:text-5xl lg:text-6xl">
            LOCKER
          </h1>
          <p className="mt-2 max-w-md font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm md:text-base">
            YOUR PICKS ARE READY. REVIEW YOUR GEAR AND GET SET FOR CHECKOUT.
          </p>
        </div>

        {/* Checkout Flow */}
        {checkoutStep === "auth" && (
          <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16 lg:py-20">
            <AuthForm
              onSuccess={async (user) => {
                // Save user data to localStorage for persistent login
                saveUserData(user);
                setCurrentUser(user);

                // Check if user already has an address
                setLoadingAddress(true);
                try {
                  const addressResponse = await getUserAddress(user.userId);
                  if (addressResponse.data) {
                    // User has address - show confirmation
                    setSavedAddress(addressResponse.data);
                    setCheckoutStep("address-confirm");
                  } else {
                    // User doesn't have address - show address form
                    setCheckoutStep("address");
                  }
                } catch {
                  // Address not found or error - show address form
                  setCheckoutStep("address");
                } finally {
                  setLoadingAddress(false);
                }
              }}
              onCancel={() => setCheckoutStep("cart")}
            />
          </section>
        )}

        {/* Address Confirmation - User has address */}
        {checkoutStep === "address-confirm" && savedAddress && (
          <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-thunder text-2xl font-extralight uppercase leading-[0.85] tracking-tight text-night sm:text-3xl md:text-4xl">
                SHIPPING ADDRESS
              </h2>
              <p className="mt-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/60 sm:text-sm">
                Is this the address you want to use?
              </p>

              <div className="mt-8 space-y-4 border border-night/10 bg-white p-6 sm:p-8">
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Full Name
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {savedAddress.fullName}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Phone Number
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {savedAddress.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Address
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {savedAddress.addressLine1}
                    {savedAddress.addressLine2 &&
                      `, ${savedAddress.addressLine2}`}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    City, State, Pin Code
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {savedAddress.city}, {savedAddress.state}{" "}
                    {savedAddress.pinCode}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Country
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {savedAddress.country}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className="smooth-hover inline-flex w-full items-center justify-center bg-night px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-white hover:bg-night/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-xs md:px-8 md:py-3"
                >
                  {processingPayment ? "Processing..." : "USE THIS ADDRESS"}
                </button>
                <button
                  onClick={() => {
                    if (currentUser) {
                      setCheckoutStep("address");
                    } else {
                      setCheckoutStep("auth");
                    }
                  }}
                  className="smooth-hover inline-flex w-full items-center justify-center border border-night/30 bg-white px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night transition-colors hover:border-night sm:w-auto sm:text-xs md:px-8 md:py-3"
                >
                  EDIT ADDRESS
                </button>
                <button
                  onClick={() => setCheckoutStep("cart")}
                  className="smooth-hover inline-flex w-full items-center justify-center border border-night/30 bg-white px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night transition-colors hover:border-night sm:w-auto sm:text-xs md:px-8 md:py-3"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Address Form - User needs to fill address */}
        {checkoutStep === "address" && currentUser && (
          <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16 lg:py-20">
            <AddressForm
              userId={currentUser.userId}
              onSuccess={async () => {
                // Address saved successfully - reload and show confirmation
                try {
                  const addressResponse = await getUserAddress(
                    currentUser.userId
                  );
                  if (addressResponse.data) {
                    setSavedAddress(addressResponse.data);
                    setCheckoutStep("address-confirm");
                  } else {
                    // TODO: Proceed to payment/order confirmation
                    alert("Address saved! Order confirmation coming soon...");
                    setCheckoutStep("cart");
                  }
                } catch {
                  // TODO: Proceed to payment/order confirmation
                  alert("Address saved! Order confirmation coming soon...");
                  setCheckoutStep("cart");
                }
              }}
              onCancel={() => {
                if (currentUser) {
                  setCheckoutStep("cart");
                } else {
                  setCheckoutStep("auth");
                }
              }}
            />
          </section>
        )}

        {/* Cart Content */}
        {checkoutStep === "cart" && (
          <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16 lg:py-20">
            {cartItems.length === 0 ? (
              /* Empty Cart */
              <div className="flex min-h-[50vh] flex-col items-center justify-center space-y-6 text-center">
                <h2 className="font-thunder text-3xl font-extralight uppercase tracking-tight text-night sm:text-4xl md:text-5xl">
                  YOUR LOCKER IS EMPTY
                </h2>
                <p className="max-w-md font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm md:text-base">
                  ADD SOME GEAR TO GET STARTED. EXPLORE OUR COLLECTION AND FIND
                  YOUR PERFECT FIT.
                </p>
                <button
                  onClick={() => navigateTo(ROUTES.DRIP_ROOM)}
                  className="smooth-hover bg-night px-6 py-3 font-montserrat text-xs font-normal uppercase tracking-[0.3em] text-white transition-opacity hover:opacity-90 active:scale-[0.98] sm:px-8 sm:py-4 sm:text-sm"
                >
                  EXPLORE DRIP ROOM →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">
                {/* Cart Items */}
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <CartItemCard
                      key={`${item.id}-${item.selectedSize}`}
                      item={item}
                    />
                  ))}
                </div>

                {/* Order Summary */}
                <div className="h-fit space-y-6 border border-night/10 bg-white p-6 sm:p-8">
                  <h2 className="font-montserrat text-sm font-bold uppercase tracking-wide text-night sm:text-base md:text-lg">
                    ORDER SUMMARY
                  </h2>

                  <div className="space-y-4 border-t border-night/10 pt-4">
                    <div className="flex justify-between font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 sm:text-sm">
                      <span>SUBTOTAL</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-montserrat text-xs font-normal uppercase tracking-wide text-night/70 sm:text-sm">
                      <span>SHIPPING</span>
                      <span>CALCULATED AT CHECKOUT</span>
                    </div>
                    <div className="border-t border-night/10 pt-4">
                      <div className="flex justify-between font-montserrat text-base font-bold uppercase tracking-wide text-night sm:text-lg md:text-xl">
                        <span>TOTAL</span>
                        <span className="text-flame">
                          ₹{calculateTotal().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    disabled={loadingAddress}
                    className="smooth-hover w-full bg-night px-6 py-4 font-montserrat text-xs font-normal uppercase tracking-[0.3em] text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm md:px-8 md:py-5"
                  >
                    {loadingAddress ? "LOADING..." : "PROCEED TO CHECKOUT"}
                  </button>

                  <button
                    onClick={() => navigateTo(ROUTES.DRIP_ROOM)}
                    className="smooth-hover w-full border border-night/30 bg-white px-6 py-3 font-montserrat text-xs font-normal uppercase tracking-[0.3em] text-night transition-colors hover:border-night sm:text-sm"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
