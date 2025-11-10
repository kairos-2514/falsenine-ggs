"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { IMAGES } from "@/config/images";
import { sendContactMessage } from "@/api/contact";
import { ApiError } from "@/api/config";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError(null);
    if (success) setSuccess(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      // Success
      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to send message. Please try again later."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="grid min-h-[calc(100vh-196px)] grid-cols-1 md:grid-cols-2">
      {/* Image Column */}
      <div className="relative min-h-[50vh] sm:min-h-[60vh] md:min-h-[calc(100vh-196px)]">
        <Image
          src={IMAGES.CONTACT_SECTION}
          alt="Contact FalseNine"
          fill
          className="object-cover"
          quality={85}
          unoptimized
          decoding="sync"
          loading="eager"
        />
      </div>

      {/* Form Column */}
      <div className="flex h-full flex-col bg-white text-night">
        <div className="flex flex-1 flex-col justify-between py-8 sm:py-10 md:py-12 lg:py-16">
          {/* Header Section */}
          <div className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20">
            <p className="max-w-md font-montserrat text-xs font-normal leading-relaxed uppercase tracking-[0.35em] text-night/60 sm:text-sm md:text-base lg:text-lg">
              Your direct line to the squad. Questions, collabs, or just want to
              talk football —{" "}
              <span className="text-flame">we&apos;re listening.</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-3 font-montserrat font-bold text-[10px] uppercase tracking-[0.35em] text-night sm:mt-6 sm:gap-4 sm:text-xs md:text-sm">
              <span>DROP</span>
              <span>PLAY</span>
              <span>REPRESENT</span>
            </div>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleSubmit}
            className="px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20"
          >
            <div className="space-y-4 sm:space-y-6">
              {/* Error Message */}
              {error && (
                <div className="rounded bg-red-50 p-3 font-montserrat text-xs text-red-600 sm:text-sm">
                  {error}
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="rounded bg-green-50 p-3 font-montserrat text-xs text-green-600 sm:text-sm">
                  Message sent successfully! We&apos;ll get back to you soon.
                </div>
              )}

              <label className="block">
                <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                  Name..?
                </span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
                />
              </label>

              <label className="block">
                <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                  Email..?
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
                />
              </label>

              <label className="block">
                <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                  Message..?
                </span>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={4}
                  className="mt-1.5 w-full resize-none border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="smooth-hover mt-4 inline-flex w-full items-center justify-center bg-night px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-white hover:bg-night/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-xs sm:w-auto md:px-8 md:py-3"
              >
                {isSubmitting ? "Sending..." : "Send the Pass"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
