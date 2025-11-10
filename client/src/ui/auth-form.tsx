"use client";

import { useState, FormEvent } from "react";
import { registerUser, loginUser, UserResponse } from "@/api/auth";
import { ApiError } from "@/api/config";

interface AuthFormProps {
  onSuccess: (user: UserResponse) => void;
  onCancel?: () => void;
}

type AuthMode = "login" | "register";

export default function AuthForm({ onSuccess, onCancel }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (mode === "register") {
      if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    } else {
      if (!formData.email.trim() || !formData.password) {
        setError("Please fill in all fields");
        return;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      if (mode === "register") {
        response = await registerUser({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await loginUser({
          email: formData.email,
          password: formData.password,
        });
      }

      if (response.data) {
        onSuccess(response.data);
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : `Failed to ${mode}. Please try again later.`
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-6 sm:p-8 md:p-10 lg:p-12">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="font-thunder text-2xl font-extralight uppercase leading-[0.85] tracking-tight text-night sm:text-3xl md:text-4xl">
            {mode === "login" ? "LOGIN" : "REGISTER"}
          </h2>
          <p className="mt-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night/60 sm:text-sm">
            {mode === "login"
              ? "Welcome back to the squad."
              : "Join the FalseNine squad."}
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
          {mode === "register" && (
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
          )}

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
              Password..?
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isSubmitting}
              className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
            />
          </label>

          {mode === "register" && (
            <label className="block">
              <span className="font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-night/50 sm:text-xs">
                Confirm Password..?
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isSubmitting}
                className="mt-1.5 w-full border-b border-night/50 bg-transparent pb-2 font-montserrat text-xs font-normal uppercase tracking-[0.2em] text-night outline-none transition-colors focus:border-night disabled:opacity-50 sm:mt-2 sm:text-sm md:text-base"
              />
            </label>
          )}

          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="smooth-hover inline-flex w-full items-center justify-center bg-night px-6 py-2.5 font-montserrat text-[10px] font-normal uppercase tracking-[0.3em] text-white hover:bg-night/90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:text-xs md:px-8 md:py-3"
            >
              {isSubmitting
                ? mode === "login"
                  ? "Logging in..."
                  : "Registering..."
                : mode === "login"
                  ? "Login"
                  : "Register"}
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

          {/* Toggle Mode */}
          <div className="pt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setError(null);
                setFormData({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: "",
                });
              }}
              className="font-montserrat text-[10px] font-normal uppercase tracking-[0.2em] text-night/60 transition-opacity hover:opacity-80 sm:text-xs"
            >
              {mode === "login"
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

