"use client";

import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { getUserProfile, updateUserProfile, UserProfile } from "@/api/auth";
import {
  getUserAddress,
  saveAddress,
  AddressData,
  AddressResponse,
} from "@/api/address";
import { getUserOrders, OrderMetadata } from "@/api/order";
import { ApiError } from "@/api/config";
import { getUserId, clearUserData, saveUserData } from "@/lib/auth";
import { getProductImage } from "@/config/images";
import AuthForm from "@/ui/auth-form";

// ============================================================================
// INLINE ADDRESS FORM COMPONENT (for dashboard)
// ============================================================================

function AddressFormInline({
  userId,
  onSuccess,
  onCancel,
  initialData,
}: {
  userId: string;
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Partial<AddressData>;
}) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    phoneNumber: initialData?.phoneNumber || "",
    addressLine1: initialData?.addressLine1 || "",
    addressLine2: initialData?.addressLine2 || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pinCode: initialData?.pinCode || "",
    country: initialData?.country || "India",
    isDefault: initialData?.isDefault ?? true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.fullName.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.addressLine1.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pinCode.trim() ||
      !formData.country.trim()
    ) {
      setError("Please fill in all required fields");
      return;
    }

    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    if (!/^\d{6}$/.test(formData.pinCode)) {
      setError("Pin code must be 6 digits");
      return;
    }

    setIsSubmitting(true);

    try {
      await saveAddress({
        userId,
        ...formData,
      });
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to save address. Please try again later."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded bg-red-50 p-3 font-montserrat text-xs text-red-600 sm:text-sm">
          {error}
        </div>
      )}

      <label className="block">
        <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
          Full Name..?
        </span>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
        />
      </label>

      <label className="block">
        <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
          Phone Number..?
        </span>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
        />
      </label>

      <label className="block">
        <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
          Address Line 1..?
        </span>
        <input
          type="text"
          name="addressLine1"
          value={formData.addressLine1}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
        />
      </label>

      <label className="block">
        <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
          Address Line 2..? (Optional)
        </span>
        <input
          type="text"
          name="addressLine2"
          value={formData.addressLine2}
          onChange={handleChange}
          disabled={isSubmitting}
          className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <label className="block">
          <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
            City..?
          </span>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
          />
        </label>

        <label className="block">
          <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
            State..?
          </span>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        <label className="block">
          <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
            Pin Code..?
          </span>
          <input
            type="text"
            name="pinCode"
            value={formData.pinCode}
            onChange={handleChange}
            required
            maxLength={6}
            disabled={isSubmitting}
            className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
          />
        </label>

        <label className="block">
          <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
            Country..?
          </span>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
          />
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="smooth-hover inline-flex items-center justify-center bg-night px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-white hover:bg-night/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:px-8 md:py-3"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="smooth-hover inline-flex items-center justify-center border border-night/30 bg-white px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night transition-colors hover:border-night disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:px-8 md:py-3"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

// ============================================================================
// PLAYER CARD DASHBOARD PAGE
// ============================================================================

export default function PlayerCardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [address, setAddress] = useState<AddressResponse | null>(null);
  const [orders, setOrders] = useState<OrderMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const [showAuth, setShowAuth] = useState(false);

  // Load user data on mount
  useEffect(() => {
    const storedUserId = getUserId();
    if (storedUserId) {
      setUserId(storedUserId);
      loadUserData(storedUserId);
    } else {
      setLoading(false);
      setShowAuth(true);
    }
  }, []);

  // Refresh orders when component mounts or userId changes
  useEffect(() => {
    if (userId) {
      loadOrders(userId);
    }
  }, [userId]);

  // Refresh orders when page becomes visible or focused (user navigates back)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && userId) {
        loadOrders(userId);
      }
    };

    const handleFocus = () => {
      if (userId) {
        loadOrders(userId);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [userId]);

  const handleLoginSuccess = (user: { userId: string; email: string; name: string }) => {
    saveUserData(user);
    setUserId(user.userId);
    setShowAuth(false);
    loadUserData(user.userId);
  };

  const handleLogout = () => {
    clearUserData();
    setUserId(null);
    setProfile(null);
    setAddress(null);
    setShowAuth(true);
  };

  const loadUserData = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      // Load profile
      const profileResponse = await getUserProfile(id);
      if (profileResponse.data) {
        setProfile(profileResponse.data);
        setProfileFormData({
          name: profileResponse.data.name,
          email: profileResponse.data.email,
        });
      }

      // Load address
      try {
        const addressResponse = await getUserAddress(id);
        if (addressResponse.data) {
          setAddress(addressResponse.data);
        }
      } catch {
        // Address might not exist yet, that's okay
        console.log("No address found");
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to load user data");
      }
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async (id: string) => {
    try {
      setLoadingOrders(true);
      console.log("Loading orders for user:", id);
      const ordersResponse = await getUserOrders(id);
      if (ordersResponse.data) {
        console.log("Orders loaded:", ordersResponse.data.length);
        setOrders(ordersResponse.data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
      if (err instanceof ApiError) {
        // Don't show error for orders, just log it
        console.error("Failed to load orders:", err.message);
      }
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setIsSaving(true);
    try {
      const response = await updateUserProfile(userId, profileFormData);
      if (response.data) {
        setProfile(response.data);
        setEditingProfile(false);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Failed to update profile");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddressSaved = () => {
    if (userId) {
      getUserAddress(userId)
        .then((response) => {
          if (response.data) {
            setAddress(response.data);
          }
        })
        .catch(() => {
          // Ignore errors
        });
    }
    setEditingAddress(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="font-montserrat text-sm uppercase tracking-wide text-night/60">
            Loading...
          </p>
        </div>
      </main>
    );
  }

  // Show login/register form if not logged in
  if (showAuth && !userId) {
    return (
      <main className="min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-32">
        <div className="border-b border-night/10 bg-white px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12">
          <h1 className="font-thunder text-3xl font-extralight uppercase leading-[0.85] tracking-tight text-night sm:text-4xl md:text-5xl lg:text-6xl">
            PLAYER CARD
          </h1>
          <p className="mt-2 max-w-md font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm md:text-base">
            Login or register to access your player card.
          </p>
        </div>
        <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16 lg:py-20">
          <AuthForm onSuccess={handleLoginSuccess} />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-20 sm:pt-24 md:pt-28 lg:pt-32">
      {/* Page Header */}
      <div className="border-b border-night/10 bg-white px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-16 lg:py-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-thunder text-3xl font-extralight uppercase leading-[0.85] tracking-tight text-night sm:text-4xl md:text-5xl lg:text-6xl">
              PLAYER CARD
            </h1>
            <p className="mt-2 max-w-md font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm md:text-base">
              Your stats, preferences, and gear — all in one place.
            </p>
          </div>
          {userId && (
            <button
              onClick={handleLogout}
              className="smooth-hover border border-night/30 bg-white px-4 py-2 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night transition-colors hover:border-night sm:px-6 sm:py-2.5 sm:text-xs"
            >
              LOGOUT
            </button>
          )}
        </div>
      </div>

      {/* Dashboard Content */}
      <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-16 lg:py-20">
        {error && (
          <div className="mb-6 rounded bg-red-50 p-3 font-montserrat text-xs text-red-600 sm:text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Profile Section */}
          <div className="space-y-6 border border-night/10 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-montserrat text-sm font-bold uppercase tracking-wide text-night sm:text-base md:text-lg">
                PROFILE
              </h2>
              {!editingProfile && (
                <button
                  onClick={() => setEditingProfile(true)}
                  className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 transition-opacity hover:opacity-80 sm:text-sm"
                >
                  EDIT
                </button>
              )}
            </div>

            {editingProfile ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <label className="block">
                  <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Name..?
                  </span>
                  <input
                    type="text"
                    value={profileFormData.name}
                    onChange={(e) =>
                      setProfileFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                    disabled={isSaving}
                    className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
                  />
                </label>

                <label className="block">
                  <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Email..?
                  </span>
                  <input
                    type="email"
                    value={profileFormData.email}
                    onChange={(e) =>
                      setProfileFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                    disabled={isSaving}
                    className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
                  />
                </label>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="smooth-hover inline-flex items-center justify-center bg-night px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-white hover:bg-night/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:px-8 md:py-3"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProfile(false);
                      if (profile) {
                        setProfileFormData({
                          name: profile.name,
                          email: profile.email,
                        });
                      }
                    }}
                    disabled={isSaving}
                    className="smooth-hover inline-flex items-center justify-center border border-night/30 bg-white px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night transition-colors hover:border-night disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs md:px-8 md:py-3"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Name
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {profile?.name || "—"}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Email
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {profile?.email || "—"}
                  </p>
                </div>
                {profile?.createdAt && (
                  <div>
                    <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                      Member Since
                    </p>
                    <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/70 sm:text-sm md:text-base">
                      {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Address Section */}
          <div className="space-y-6 border border-night/10 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-montserrat text-sm font-bold uppercase tracking-wide text-night sm:text-base md:text-lg">
                SHIPPING ADDRESS
              </h2>
              {!editingAddress && (
                <button
                  onClick={() => setEditingAddress(true)}
                  className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 transition-opacity hover:opacity-80 sm:text-sm"
                >
                  {address ? "EDIT" : "ADD"}
                </button>
              )}
            </div>

            {editingAddress ? (
              userId && (
                <AddressFormInline
                  userId={userId}
                  onSuccess={handleAddressSaved}
                  onCancel={() => setEditingAddress(false)}
                  initialData={address || undefined}
                />
              )
            ) : address ? (
              <div className="space-y-4">
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Full Name
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {address.fullName}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Phone Number
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {address.phoneNumber}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Address
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    City, State, Pin Code
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {address.city}, {address.state} {address.pinCode}
                  </p>
                </div>
                <div>
                  <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                    Country
                  </p>
                  <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                    {address.country}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm">
                  No address saved yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="mt-8 space-y-6 border border-night/10 bg-white p-6 sm:p-8">
          <h2 className="font-montserrat text-sm font-bold uppercase tracking-wide text-night sm:text-base md:text-lg">
            ORDER HISTORY
          </h2>

          {loadingOrders ? (
            <div className="py-8 text-center">
              <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm">
                Loading orders...
              </p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-montserrat text-xs font-normal uppercase tracking-wide text-night/60 sm:text-sm">
                No orders yet
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.orderId}
                  className="border-b border-night/10 pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                    <div>
                      <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                        Order ID
                      </p>
                      <p className="mt-1.5 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                        {order.orderId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                        Status
                      </p>
                      <p className="mt-1.5 font-montserrat text-xs font-bold uppercase tracking-[0.2em] text-night sm:text-sm md:text-base">
                        {order.orderStatus}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                      Date
                    </p>
                    <p className="mt-1.5 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/70 sm:text-sm md:text-base">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="mb-4 space-y-3">
                    <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                      Items
                    </p>
                    {order.items.map((item, index) => {
                      // Validate and sanitize image URL
                      const isValidImageUrl = (url: string | undefined): boolean => {
                        if (!url || typeof url !== 'string') return false;
                        // Check if it contains unresolved env variables
                        if (url.includes('${') || url.includes('process.env')) return false;
                        // Check if it's a valid URL format
                        try {
                          new URL(url);
                          return true;
                        } catch {
                          // If it's a relative path, check if it starts with http
                          return url.startsWith('http://') || url.startsWith('https://');
                        }
                      };

                      // Try to get image URL - first from item, then fallback to product image helper
                      let imageUrl: string | null = null;
                      if (item.image && isValidImageUrl(item.image)) {
                        imageUrl = item.image;
                      } else if (item.productId) {
                        // Fallback to product image helper if item image is invalid
                        try {
                          imageUrl = getProductImage(item.productId);
                        } catch {
                          imageUrl = null;
                        }
                      }

                      return (
                        <div
                          key={index}
                          className="flex items-start gap-4 border-b border-night/5 pb-3 last:border-b-0 last:pb-0"
                        >
                          {imageUrl ? (
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-iron">
                              <Image
                                src={imageUrl}
                                alt={item.productName}
                                fill
                                className="object-cover"
                                quality={80}
                                onError={(e) => {
                                  console.error("Failed to load order item image:", imageUrl);
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-iron flex items-center justify-center">
                              <span className="font-montserrat text-[8px] uppercase text-night/30">No Image</span>
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-montserrat text-xs font-bold uppercase tracking-wide text-night sm:text-sm">
                              {item.productName}
                            </p>
                            {item.productDescription && (
                              <p className="mt-1 font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/60 sm:text-xs line-clamp-2">
                                {item.productDescription}
                              </p>
                            )}
                            <p className="mt-1 font-montserrat text-[10px] font-normal uppercase tracking-wide text-night/60 sm:text-xs">
                              Size: {item.selectedSize || "N/A"} | Qty: {item.quantity} | ₹{item.pricePerUnit.toLocaleString()} each
                            </p>
                            <p className="mt-1 font-montserrat text-xs font-bold uppercase tracking-wide text-flame sm:text-sm">
                              ₹{item.totalPrice.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between border-t border-night/10 pt-4">
                    <p className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                      Total Amount
                    </p>
                    <p className="font-montserrat text-sm font-bold uppercase tracking-wide text-night sm:text-base md:text-lg">
                      ₹{order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

