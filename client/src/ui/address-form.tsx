"use client";

import { useState, FormEvent } from "react";
import { saveAddress, AddressData } from "@/api/address";
import { ApiError } from "@/api/config";

interface AddressFormProps {
  userId: string;
  onSuccess: () => void;
  onCancel?: () => void;
  initialData?: Partial<AddressData>;
}

export default function AddressForm({
  userId,
  onSuccess,
  onCancel,
  initialData,
}: AddressFormProps) {
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

    // Validation
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

    // Phone number validation
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("Please enter a valid phone number");
      return;
    }

    // Pin code validation (6 digits)
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="font-thunder text-2xl font-extralight uppercase leading-[0.85] tracking-tight text-night sm:text-3xl md:text-4xl">
            SHIPPING ADDRESS
          </h2>
          <p className="mt-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/60 sm:text-sm">
            Where should we deliver your gear?
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 font-montserrat text-xs text-red-600 sm:text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
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

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="smooth-hover inline-flex w-full items-center justify-center bg-night px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-white hover:bg-night/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-xs md:px-8 md:py-3"
            >
              {isSubmitting ? "Saving..." : "Save Address"}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="smooth-hover inline-flex w-full items-center justify-center border border-night/30 bg-white px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night transition-colors hover:border-night disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-xs md:px-8 md:py-3"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

